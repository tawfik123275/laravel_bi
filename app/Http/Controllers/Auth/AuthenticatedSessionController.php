<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AuthenticatedSessionController extends Controller{
public function store(LoginRequest $request)
{
    $request->authenticate();

    $request->session()->regenerate();

    $user = $request->user();

    if ($user->role === 'doctor') {
        return redirect('/doctor');
    }

    if ($user->role === 'lab') {
        return redirect('/lab/dashboard');
    }

    return redirect('/dashboard');
}
}

