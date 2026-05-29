<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Analysis;
use Illuminate\Support\Facades\Auth;
use Psy\Readline\Hoa\Console;

class AnalysisController extends Controller
{

  public function index()
{
    // $userId = auth()->id(); // ✅ real logged user ID

    return view('analysis.index', compact('userId'));
}

    public function create()
    {
        return view('analysis.create');
    }


   public function getDataRequest(Request $request)
{
    $search = $request->search;
    $status = $request->status;
    $barcode = $request->barcode;
    $date = $request->date;
    $pending = $request->pending; 

    $query = DB::table('laboratory_requests as lr')

        ->join('patients_lab as p', 'lr.patient_id', '=', 'p.id')

        ->select(
            'lr.*',
            'p.full_name as patient_name',
            'p.phone as patient_phone'
        )

        ->orderBy('lr.id', 'desc');

    // SEARCH
    if ($search) {

        $query->where(function ($q) use ($search) {

            $q->where('p.full_name', 'like', "%{$search}%")
              ->orWhere('p.phone', 'like', "%{$search}%");
        });
    }

    // STATUS
    if ($status && $status != 'all') {

        $query->where('lr.status', $status);
    }
   
    

    // BARCODE
    if ($barcode) {

        $query->where('lr.barcode', 'like', "%{$barcode}%");
    }

    // DATE
    if ($date && $date != 'all') {

        if ($date == 'today') {

            $query->whereDate('lr.created_at', today());

        } elseif ($date == 'week') {

            $query->where('lr.created_at', '>=', now()->subDays(7));

        } elseif ($date == 'month') {

            $query->whereMonth('lr.created_at', now()->month)
                  ->whereYear('lr.created_at', now()->year);
        }
    }

    $data = $query->paginate(5);

    return response()->json([
        'data' => $data->items(),
        'page' => $data->currentPage(),
        'pages' => $data->lastPage(),
    ]);
}
    public function getDataAnalysis()
    {
        $data = DB::table('analysis_types')->get();
        
        return response()->json($data);
    }




    public function saveNewRequest(Request $request)
    {
        $validated = $request->validate([
             'laboratory_id' => 'nullable|integer',
             'doctor_id'=> 'nullable|integer',
             'analyses' => 'required|array|min:1',
             'analyses.*' => 'string',

             'prioritySelect' => 'required|string',
             'clinical_notes' => 'nullable|string',
             'requiredDate' => 'required|date',

            'patientName' => 'required|string|max:255',
            'patientPhone' => 'required|string|max:20',
            'patientEmail'=> 'nullable|email|max:255',
            'notification_methods' => 'nullable|array',
            'notification_methods.emailCheck' => 'nullable|boolean',
            'notification_methods.smsCheck' => 'nullable|boolean',
        ]);

        DB::beginTransaction();

        try {

            // 1️⃣ Create patient
            $patientId = DB::table('patients_lab')->insertGetId([
                'full_name' => $validated['patientName'],
                'phone' => $validated['patientPhone'],
                'email' => $validated['patientEmail'],
                'date_of_birth' => $request->patientDob,
                'gender' => $request->patientGender,
                'national_id' => $request->patientNationalId,
                'daily_number' => rand(1000, 9999),
                'daily_number_date' => now()->toDateString(),
                'created_at' => now()
            ]);

            // 2️⃣ Get analyses details
            $analysisDetails = [];
            $totalAmount = 0;

            foreach ($validated['analyses'] as $name) {

                $analysis = DB::table('analysis_types')
                    ->where('name', $name)
                    ->where('is_active', 1)
                    ->first();

                if ($analysis) {

                    $analysisDetails[] = [
                        'name' => $analysis->code_name,
                        'real_name' => $analysis->name,
                        'price' => $analysis->price,
                        'description' => $analysis->description,
                        'tube_color' => $analysis->tube_color,
                    ];

                    $totalAmount += $analysis->price;
                }
            }

            // 3️⃣ Create request
            $requestId = DB::table('laboratory_requests')->insertGetId([
                'doctor_id' => $validated['doctor_id']?? null,
                'laboratory_id' => $validated['laboratory_id']?? null,
                'patient_id' => $patientId,
                'analysis_types' => json_encode($validated['analyses']),
                'analysis_details' => json_encode($analysisDetails),
                'total_amount' => $totalAmount,
                'priority' => $validated['prioritySelect'],
                'clinical_notes' => $validated['clinical_notes']?? null,
                'required_date' => $validated['requiredDate'],
                'notification_methods' => json_encode($validated['notification_methods'] ?? []),
                'barcode' => 'BC-' . time(),
                'status' => 'pending',
                'created_at' => now(),
            ]);

            // 4️⃣ Parameters insert
            $analysisParameters = [
                "TP" => ["(%)", "INR", "Temps de Quick"],
                "HGPO" => ["G1", "G2", "G3"],
                "CHIMIE DES URINES" => ["GLUCOSE", "CORPS CÉTONIQUES", "SANG"],
                "TEST DE DROGUES" => ["AMP", "BZO", "COC", "THC"],
            ];
            foreach ($analysisParameters as $analysisName => $params) {

                if (in_array($analysisName, $validated['analyses'])) {

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

            DB::commit();
            // dd([
            //     'success' => true,
            //     'request_id' => $requestId,
            //     'message' => 'Request created successfully'
            // ]);
            return response()->json([
                'success' => true,
                'request_id' => $requestId,
                'message' => 'Request created successfully'
            ]);
        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function getAnalysisDetails($id)
    {
       
    
        $request = DB::table('laboratory_requests as lr')
            ->join('patients_lab as p', 'lr.patient_id', '=', 'p.id')
            ->select(
                'lr.*',
                'p.full_name as patient_name',
                'p.phone as patient_phone',
                'p.email as patient_email'
            )
            ->where('lr.id', $id)
            ->first();

        if (!$request) {
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
                'request' => $request,
                'parameters' => $parameters
            ]
        ]);

    }
    public function updateResults(Request $request, $id)
    {
    DB::table('laboratory_requests')
        ->where('id', $id)
        ->update([
            'results' => json_encode($request->results),
            'status' => $request->status,
            'updated_at' => now()
        ]);

    return response()->json([
        'success' => true,
        'message' => 'Updated successfully'
    ]);
    }
    
}
