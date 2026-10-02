<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        return view('reports.index');
    }

    public function data(Request $request)
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:all,pending,in-progress,completed,cancelled'],
            'period' => ['nullable', 'in:all,today,week,month'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $user = Auth::user();
        $query = DB::table('laboratory_requests as lr')
            ->join('patients_lab as p', 'lr.patient_id', '=', 'p.id')
            ->leftJoin('billing_invoices as bi', 'bi.request_id', '=', 'lr.id')
            ->select(
                'lr.id',
                'lr.barcode',
                'lr.status',
                'lr.priority',
                'lr.total_amount',
                'lr.created_at',
                'p.full_name as patient_name',
                'p.phone as patient_phone',
                'bi.invoice_number',
                'bi.amount_paid'
            );

        if ($user->role === 'doctor') {
            $query->where('lr.doctor_id', $user->id);
        } elseif (in_array($user->role, ['lab', 'lab_staff'], true)) {
            $query->where(function ($query) use ($user) {
                $query->where('lr.laboratory_id', $user->id)
                    ->orWhere(function ($query) {
                        $query->whereNull('lr.laboratory_id')
                            ->where('lr.status', 'pending');
                    });
            });
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($query) use ($search) {
                $query->where('p.full_name', 'like', "%{$search}%")
                    ->orWhere('p.phone', 'like', "%{$search}%")
                    ->orWhere('lr.barcode', 'like', "%{$search}%")
                    ->orWhere('bi.invoice_number', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('lr.status', $filters['status']);
        }

        match ($filters['period'] ?? 'all') {
            'today' => $query->whereDate('lr.created_at', today()),
            'week' => $query->where('lr.created_at', '>=', now()->subDays(7)),
            'month' => $query->whereMonth('lr.created_at', now()->month)
                ->whereYear('lr.created_at', now()->year),
            default => null,
        };

        $summary = (clone $query)
            ->reorder()
            ->selectRaw(
                "COUNT(*) as request_count,
                SUM(CASE WHEN lr.status = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN lr.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
                COALESCE(SUM(lr.total_amount), 0) as requested_amount,
                COALESCE(SUM(COALESCE(bi.amount_paid, 0)), 0) as received_amount"
            )
            ->first();

        $reports = $query->orderByDesc('lr.id')->paginate(25);

        return response()->json([
            'data' => $reports->items(),
            'page' => $reports->currentPage(),
            'pages' => $reports->lastPage(),
            'summary' => [
                'requests' => (int) $summary->request_count,
                'pending' => (int) $summary->pending_count,
                'completed' => (int) $summary->completed_count,
                'requested' => (float) $summary->requested_amount,
                'received' => (float) $summary->received_amount,
                'outstanding' => max(0, (float) $summary->requested_amount - (float) $summary->received_amount),
            ],
        ]);
    }
}
