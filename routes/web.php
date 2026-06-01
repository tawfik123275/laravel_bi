<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\ManagerAnalysisController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Doctor\DoctorController;

// here we will define all the routes for our application for the user interface 
Route::get('/', function () {
    return view('auth.login');
});
Route::middleware('auth')->group(function () {

    Route::get('/doctor', [DoctorController::class, 'index'])
        ->middleware('role:doctor');

    // Route::get('/lab/dashboard', [LabController::class, 'index'])
    //     ->middleware('role:lab');

});













// Route::get('/', [DashboardController::class, 'index']);
// Route::get('/doctor', [DoctorController::class, 'index']);
Route::get('/doctor/prescription', [DoctorController::class, 'prescription']);
Route::get('/analysis', [AnalysisController::class, 'index']);
Route::get('/analysis/create', [AnalysisController::class, 'create']);
Route::get('/managerAnalysis/index',[ManagerAnalysisController::class, 'index']);
Route::get('/patients', [PatientController::class, 'index']);

Route::get('/reports', [ReportController::class, 'index']);


Route::get('/settings', [SettingController::class, 'index']);
// side barre direction 
Route::post('/analysis/store', function (Illuminate\Http\Request $request) {
    return response()->json([
        'success' => true,
        'name' => $request->name
    ]);
});
Route::get('/analysis/{id}', [AnalysisController::class, 'store']);
Route::get('/analysis-requests', [AnalysisController::class, 'getDataRequest']);
Route::get('/analysis-data', [AnalysisController::class, 'getDataAnalysis']);
Route::post('/save-analysis-requests', [AnalysisController::class, 'saveNewRequest']);
Route::get(
    '/analysis-requests-details/{id}',
    [AnalysisController::class, 'getAnalysisDetails']
);
Route::post(
             '/analysis-requests-details/{id}/update-results', 
             [AnalysisController::class, 'updateResults' ]
            );
Route::get('/analysis-manager/prices', [AnalysisController::class, 'getDataAnalysis']);