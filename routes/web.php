<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\ManagerAnalysisController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Doctor\DoctorController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\BillingController;

// here we will define all the routes for our application for the user interface 
Route::get('/', function () {
    return redirect('/login');
});
Route::middleware('auth')->group(function () {
    Route::middleware('role:doctor')->prefix('doctor')->group(function () {
        Route::get('/', [DoctorController::class, 'index']);
        Route::get('/analysisManager', [DoctorController::class, 'analysisManager']);
        Route::get('/newAnalysisTest', [DoctorController::class, 'newAnalysisTest']);
        Route::get('/newPatients', [DoctorController::class, 'newPatient']);
        Route::get('/patients', [DoctorController::class, 'patients']);
        Route::get('/prescription', [DoctorController::class, 'prescription']);
    });

    Route::middleware('role:doctor,lab,lab_staff,admin,clinic')->group(function () {
        Route::get('/analysis', [AnalysisController::class, 'index']);
        Route::get('/analysis-requests', [AnalysisController::class, 'getDataRequest']);
        Route::get('/analysis-requests-details/{id}', [AnalysisController::class, 'getAnalysisDetails']);
        Route::get('/analysis-data', [AnalysisController::class, 'getDataAnalysis']);
        Route::get('/analysis-manager/prices', [AnalysisController::class, 'getDataAnalysis']);
    });

    Route::middleware('role:doctor')->group(function () {
        Route::get('/analysis/create', [AnalysisController::class, 'create']);
        Route::post('/save-analysis-requests', [AnalysisController::class, 'saveNewRequest']);
    });
    Route::middleware('role:lab,lab_staff')->group(function () {
        Route::post('/analysis-requests/{id}/claim', [AnalysisController::class, 'claimRequest']);
        Route::post('/analysis-requests-details/{id}/update-results', [AnalysisController::class, 'updateResults']);
    });

    Route::middleware('role:doctor,lab,lab_staff,admin,clinic')->group(function () {
        Route::get('/managerAnalysis/index', [ManagerAnalysisController::class, 'index']);
        Route::get('/patients', [PatientController::class, 'index']);
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/settings', [SettingController::class, 'index']);
        Route::get('/billing', [BillingController::class, 'index']);
        Route::get('/billing/invoices', [BillingController::class, 'invoices']);
        Route::get('/billing/invoices/{invoiceId}/payments', [BillingController::class, 'payments']);
        Route::post('/billing/invoices/{invoiceId}/payments', [BillingController::class, 'recordPayment']);
    });

    Route::middleware('role:patient')->get('/patient', fn () => abort(403, 'A patient portal is not configured.'));
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
});
Route::get('/login', [LoginController::class, 'index'])
    ->name('login');

Route::post('/login', [LoginController::class, 'store']);