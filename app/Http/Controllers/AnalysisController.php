<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AnalysisController extends Controller
{

  public function index()
{
    $userId = Auth::id();

    return view('analysis.index', compact('userId'));
}

    public function create()
    {
        return view('analysis.create');
    }


   public function getDataRequest(Request $request)
{
    $filters = $request->validate([
    'search' => ['nullable', 'string', 'max:255'],
    'status' => ['nullable', 'in:all,pending,in-progress,completed,cancelled'],
    'barcode' => ['nullable', 'string', 'max:255'],
    'date' => ['nullable', 'in:all,today,week,month'],
    ]);
    $search = $filters['search'] ?? '';
    $status = $filters['status'] ?? 'all';
    $barcode = $filters['barcode'] ?? '';
    $date = $filters['date'] ?? 'all';
    $query = DB::table('laboratory_requests as lr')

        ->join('patients_lab as p', 'lr.patient_id', '=', 'p.id')

        ->select(
            'lr.*',
            'p.full_name as patient_name',
            'p.phone as patient_phone'
        )

        ->orderBy('lr.id', 'desc');

    if (Auth::user()->role === 'doctor') {
        $query->where('lr.doctor_id', Auth::id());
    } elseif (in_array(Auth::user()->role, ['lab', 'lab_staff'], true)) {
        $query->where(function ($query) {
            $query->whereNull('lr.laboratory_id')
                ->orWhere('lr.laboratory_id', Auth::id());
        });
    }

    $statsQuery = DB::table('laboratory_requests as lr');
    if (Auth::user()->role === 'doctor') {
        $statsQuery->where('lr.doctor_id', Auth::id());
    } elseif (in_array(Auth::user()->role, ['lab', 'lab_staff'], true)) {
        $statsQuery->where(function ($query) {
            $query->whereNull('lr.laboratory_id')
                ->orWhere('lr.laboratory_id', Auth::id());
        });
    }
    $stats = $statsQuery->selectRaw(
        "COUNT(*) as total_count,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        COALESCE(SUM(total_amount), 0) as total_amount"
    )->first();

    // SEARCH
    if ($search) {

        $query->where(function ($q) use ($search) {

            $q->where('p.full_name', 'like', "%{$search}%")
              ->orWhere('p.phone', 'like', "%{$search}%");
        });
    }

    // STATUS
    if (in_array($status, ['pending', 'in-progress', 'completed', 'cancelled'], true)) {

        $query->where('lr.status', $status);
    }
   
    

    // BARCODE
    if ($barcode) {

        $query->where('lr.barcode', 'like', "%{$barcode}%");
    }

    // DATE
    if (in_array($date, ['today', 'week', 'month'], true)) {

        if ($date == 'today') {

            $query->whereDate('lr.created_at', today());

        } elseif ($date == 'week') {

            $query->where('lr.created_at', '>=', now()->subDays(7));

        } elseif ($date == 'month') {

            $query->whereMonth('lr.created_at', now()->month)
                  ->whereYear('lr.created_at', now()->year);
        }
    }

    $data = $query->paginate(25);

    return response()->json([
        'data' => $data->items(),
        'page' => $data->currentPage(),
        'pages' => $data->lastPage(),
        'stats' => [
            'total' => (int) $stats->total_count,
            'pending' => (int) $stats->pending_count,
            'completed' => (int) $stats->completed_count,
            'amount' => (float) $stats->total_amount,
        ],
    ]);
}
    public function getDataAnalysis()
    {
        $data = DB::table('analysis_types')->where('is_active', 1)->get();
        
        return response()->json($data);
    }




    public function saveNewRequest(Request $request)
    {
        $validated = $request->validate([
            'analyses' => ['required', 'array', 'min:1'],
            'analyses.*' => ['required', 'string', 'distinct'],
            'prioritySelect' => ['required', 'in:normal,urgent,high,low'],
            'clinical_notes' => ['nullable', 'string', 'max:5000'],
            'requiredDate' => ['required', 'date', 'after_or_equal:today'],
            'patientName' => ['required', 'string', 'max:255'],
            'patientPhone' => ['required', 'string', 'max:20'],
            'patientEmail' => ['nullable', 'email', 'max:255'],
            'patientDob' => ['nullable', 'date', 'before_or_equal:today'],
            'patientGender' => ['nullable', 'in:male,female'],
            'patientNationalId' => ['nullable', 'string', 'max:100'],
            'notification_methods' => ['nullable', 'array'],
            'notification_methods.emailCheck' => ['nullable', 'boolean'],
            'notification_methods.smsCheck' => ['nullable', 'boolean'],
        ]);

        $analyses = DB::table('analysis_types')
            ->whereIn('name', $validated['analyses'])
            ->where('is_active', 1)
            ->get();

        if ($analyses->count() !== count($validated['analyses'])) {
            throw ValidationException::withMessages([
                'analyses' => 'One or more selected tests are unavailable.',
            ]);
        }

        $totalCents = $analyses->sum(fn ($analysis) => (int) round((float) $analysis->price * 100));
        if ($totalCents <= 0) {
            throw ValidationException::withMessages([
                'analyses' => 'Selected tests must have a positive price.',
            ]);
        }
        $analysisDetails = $analyses->map(fn ($analysis) => [
            'name' => $analysis->code_name,
            'real_name' => $analysis->name,
            'price' => number_format((int) round((float) $analysis->price * 100) / 100, 2, '.', ''),
            'description' => $analysis->description,
            'tube_color' => $analysis->tube_color,
        ])->all();

        $result = DB::transaction(function () use ($validated, $analysisDetails, $totalCents) {
            $patientId = DB::table('patients_lab')->insertGetId([
                'full_name' => $validated['patientName'],
                'phone' => $validated['patientPhone'],
                'email' => $validated['patientEmail'] ?? null,
                'date_of_birth' => $validated['patientDob'] ?? null,
                'gender' => $validated['patientGender'] ?? null,
                'national_id' => $validated['patientNationalId'] ?? null,
                'daily_number' => rand(1000, 9999),
                'daily_number_date' => now()->toDateString(),
                'created_at' => now(),
            ]);

            $doctorId = Auth::id();
            $requestId = DB::table('laboratory_requests')->insertGetId([
                'doctor_id' => $doctorId,
                'laboratory_id' => null,
                'patient_id' => $patientId,
                'analysis_types' => json_encode($validated['analyses']),
                'analysis_details' => json_encode($analysisDetails),
                'total_amount' => number_format($totalCents / 100, 2, '.', ''),
                'priority' => $validated['prioritySelect'],
                'clinical_notes' => $validated['clinical_notes'] ?? null,
                'required_date' => $validated['requiredDate'],
                'notification_methods' => json_encode($validated['notification_methods'] ?? []),
                'barcode' => 'BC-' . Str::uuid(),
                'status' => 'pending',
                'created_at' => now(),
            ]);

            DB::table('billing_invoices')->insert([
                'invoice_number' => 'INV-' . now()->format('Ymd') . '-' . str_pad((string) $requestId, 6, '0', STR_PAD_LEFT),
                'request_id' => $requestId,
                'doctor_id' => $doctorId,
                'laboratory_id' => null,
                'total_amount' => number_format($totalCents / 100, 2, '.', ''),
                'amount_paid' => 0,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $analysisParameters = [
                "TP" => ["(%)", "INR", "Temps de Quick"],
                "HGPO" => ["G1", "G2", "G3"],
                "CHIMIE DES URINES" => ["GLUCOSE", "CORPS CÉTONIQUES", "SANG"],
                "TEST DE DROGUES" => ["AMP", "BZO", "COC", "THC"],
            ];
            foreach ($analysisParameters as $analysisName => $params) {

                if (in_array($analysisName, $validated['analyses'], true)) {
                    foreach ($params as $param) {
                        DB::table('attrui_par_analysis')->insert([
                            'laboratory_request_id' => $requestId,
                            'analysis_name' => $analysisName,
                            'parameter_name' => $param,
                            'created_at' => now(),
                        ]);
                    }
                }
            }

            return $requestId;
        });

        return response()->json([
            'success' => true,
            'request_id' => $result,
            'message' => 'Request created successfully',
        ], 201);
    }
    public function getAnalysisDetails($id)
    {
        $query = DB::table('laboratory_requests as lr')
            ->join('patients_lab as p', 'lr.patient_id', '=', 'p.id')
            ->select(
                'lr.*',
                'p.full_name as patient_name',
                'p.phone as patient_phone',
                'p.email as patient_email'
            )
            ->where('lr.id', $id);

        if (Auth::user()->role === 'doctor') {
            $query->where('lr.doctor_id', Auth::id());
        } elseif (in_array(Auth::user()->role, ['lab', 'lab_staff'], true)) {
            $query->where(function ($query) {
                $query->whereNull('lr.laboratory_id')
                    ->orWhere('lr.laboratory_id', Auth::id());
            });
        }

        $analysisRequest = $query->first();

        if (!$analysisRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Request not found'
            ], 404);
        }

        $parameters = DB::table('attrui_par_analysis')
            ->where('laboratory_request_id', $id)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'request' => $analysisRequest,
                'parameters' => $parameters
            ]
        ]);

    }
    public function claimRequest($id)
    {
        $claimed = DB::transaction(function () use ($id) {
            $updated = DB::table('laboratory_requests')
                ->where('id', $id)
                ->whereNull('laboratory_id')
                ->where('status', 'pending')
                ->update([
                    'laboratory_id' => Auth::id(),
                    'status' => 'in-progress',
                    'updated_at' => now(),
                ]);

            if ($updated) {
                DB::table('billing_invoices')
                    ->where('request_id', $id)
                    ->update([
                        'laboratory_id' => Auth::id(),
                        'updated_at' => now(),
                    ]);
            }

            return $updated;
        });

        if (!$claimed) {
            return response()->json([
                'success' => false,
                'message' => 'This request is no longer available to claim.',
            ], 409);
        }

        return response()->json(['success' => true]);
    }

    public function updateResults(Request $request, $id)
    {
        $validated = $request->validate([
            'results' => ['required', 'array', 'min:1', 'max:100'],
            'results.*' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'in:in-progress,completed'],
        ]);

        $results = array_map(fn ($value) => trim((string) $value), $validated['results']);
        foreach (array_keys($results) as $key) {
            if (!is_string($key) || strlen($key) > 100) {
                throw ValidationException::withMessages([
                    'results' => 'Result names must be no longer than 100 characters.',
                ]);
            }
        }

        $updated = DB::transaction(function () use ($id, $validated, $results) {
            $analysisRequest = DB::table('laboratory_requests')
                ->where('id', $id)
                ->where('laboratory_id', Auth::id())
                ->lockForUpdate()
                ->first();

            if (!$analysisRequest || $analysisRequest->status !== 'in-progress') {
                return false;
            }

            $details = json_decode($analysisRequest->analysis_details ?? '[]', true) ?: [];
            $allowedResults = DB::table('attrui_par_analysis')
                ->where('laboratory_request_id', $id)
                ->pluck('parameter_name')
                ->all();
            foreach ($details as $detail) {
                $allowedResults[] = $detail['real_name'] ?? $detail['name'] ?? null;
            }
            $allowedResults = array_values(array_unique(array_filter($allowedResults)));

            if (array_diff(array_keys($results), $allowedResults)) {
                throw ValidationException::withMessages([
                    'results' => 'Results must match tests on this request.',
                ]);
            }

            if ($validated['status'] === 'completed' && count(array_filter($results, fn ($value) => $value !== '')) !== count($results)) {
                throw ValidationException::withMessages([
                    'results' => 'Enter a result for every requested test before completing the request.',
                ]);
            }

            return DB::table('laboratory_requests')
                ->where('id', $analysisRequest->id)
                ->where('laboratory_id', Auth::id())
                ->where('status', 'in-progress')
                ->update([
                    'results' => json_encode($results),
                    'status' => $validated['status'],
                    'updated_at' => now(),
                ]);
        });

        if (!$updated) {
            return response()->json([
                'success' => false,
                'message' => 'The request status changed. Reload the request and try again.',
            ], 409);
        }

        return response()->json([
            'success' => true,
            'message' => 'Results updated successfully.',
        ]);
    }
    
}
