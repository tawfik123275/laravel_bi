<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class BillingController extends Controller
{
    public function index()
    {
        $this->ensureBillingAccess();

        return view('billing.index');
    }

    public function invoices(Request $request)
    {
        $user = $this->ensureBillingAccess();
        $query = DB::table('billing_invoices as bi')
            ->leftJoin('laboratory_requests as lr', 'bi.request_id', '=', 'lr.id')
            ->leftJoin('patients_lab as p', 'lr.patient_id', '=', 'p.id')
            ->select(
                'bi.*',
                'p.full_name as patient_name',
                'lr.barcode'
            )
            ->orderByDesc('bi.id');

        if ($user->role === 'doctor') {
            $query->where('bi.doctor_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($query) use ($search) {
                $query->where('bi.invoice_number', 'like', "%{$search}%")
                    ->orWhere('p.full_name', 'like', "%{$search}%")
                    ->orWhere('lr.barcode', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && in_array($request->status, ['pending', 'partial', 'paid'], true)) {
            $query->where('bi.status', $request->status);
        }

        $invoices = $query->paginate(25)->appends($request->only(['search', 'status']));
        $totals = DB::table('billing_invoices')
            ->when($user->role === 'doctor', fn ($query) => $query->where('doctor_id', $user->id))
            ->selectRaw('COUNT(*) as invoice_count, COALESCE(SUM(total_amount), 0) as billed, COALESCE(SUM(amount_paid), 0) as received')
            ->first();

        return response()->json([
            'data' => $invoices->items(),
            'page' => $invoices->currentPage(),
            'pages' => $invoices->lastPage(),
            'totals' => [
                'count' => (int) $totals->invoice_count,
                'billed' => (float) $totals->billed,
                'received' => (float) $totals->received,
                'outstanding' => max(0, (float) $totals->billed - (float) $totals->received),
            ],
        ]);
    }

    public function payments($invoiceId)
    {
        $this->findAccessibleInvoice($invoiceId);

        return response()->json([
            'data' => DB::table('billing_payments')
                ->where('invoice_id', $invoiceId)
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function recordPayment(Request $request, $invoiceId)
    {
        $user = $this->ensureBillingAccess();
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01', 'max:9999999999.99', 'regex:/^\d+(?:\.\d{1,2})?$/'],
            'method' => ['required', 'in:cash,card,transfer'],
            'reference' => ['nullable', 'string', 'max:255'],
            'idempotency_key' => ['required', 'uuid'],
        ]);

        $duplicate = DB::transaction(function () use ($validated, $invoiceId, $user) {
            $invoice = DB::table('billing_invoices')
                ->where('id', $invoiceId)
                ->lockForUpdate()
                ->first();

            if (!$invoice || ($user->role === 'doctor' && (int) $invoice->doctor_id !== (int) $user->id)) {
                abort(404);
            }

            $existingPayment = DB::table('billing_payments')
                ->where('idempotency_key', $validated['idempotency_key'])
                ->first();

            if ($existingPayment) {
                if (
                    (int) $existingPayment->invoice_id !== (int) $invoice->id
                    || (int) round((float) $existingPayment->amount * 100) !== (int) round((float) $validated['amount'] * 100)
                    || $existingPayment->method !== $validated['method']
                    || $existingPayment->reference !== ($validated['reference'] ?? null)
                ) {
                    throw ValidationException::withMessages([
                        'idempotency_key' => 'This payment key was already used for a different payment.',
                    ]);
                }

                return true;
            }

            $amountCents = (int) round((float) $validated['amount'] * 100);
            $totalCents = (int) round((float) $invoice->total_amount * 100);
            $paidCents = (int) round((float) $invoice->amount_paid * 100);
            $remainingCents = max(0, $totalCents - $paidCents);

            if ($amountCents > $remainingCents) {
                throw ValidationException::withMessages([
                    'amount' => 'Payment cannot exceed the invoice balance.',
                ]);
            }

            $newPaidCents = $paidCents + $amountCents;
            DB::table('billing_payments')->insert([
                'invoice_id' => $invoice->id,
                'recorded_by' => $user->id,
                'idempotency_key' => $validated['idempotency_key'],
                'amount' => number_format($amountCents / 100, 2, '.', ''),
                'method' => $validated['method'],
                'reference' => $validated['reference'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('billing_invoices')
                ->where('id', $invoice->id)
                ->update([
                    'amount_paid' => number_format($newPaidCents / 100, 2, '.', ''),
                    'status' => $newPaidCents >= $totalCents ? 'paid' : 'partial',
                    'updated_at' => now(),
                ]);

            return false;
        });

        return response()->json([
            'success' => true,
            'duplicate' => $duplicate,
            'message' => $duplicate ? 'Payment was already recorded.' : 'Payment recorded.',
        ]);
    }

    private function findAccessibleInvoice($invoiceId)
    {
        $user = $this->ensureBillingAccess();
        $query = DB::table('billing_invoices')->where('id', $invoiceId);

        if ($user->role === 'doctor') {
            $query->where('doctor_id', $user->id);
        }

        $invoice = $query->first();
        abort_unless($invoice, 404);

        return $invoice;
    }

    private function ensureBillingAccess()
    {
        $user = Auth::user();
        abort_unless($user && in_array($user->role, ['doctor', 'lab', 'lab_staff', 'admin', 'clinic'], true), 403);

        return $user;
    }
}
