<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function index()
    {
        return view('auth.login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            'role' => ['required', 'in:doctor,patient,clinic,lab,lab_staff,admin'],
        ]);

        $selectedRole = $credentials['role'] === 'lab_staff' ? 'lab' : $credentials['role'];
        $authenticated = Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ]);

        if ($authenticated && (Auth::user()->role === 'lab_staff' ? 'lab' : Auth::user()->role) === $selectedRole) {
            $request->session()->regenerate();

            $role = Auth::user()->role;

            return redirect(match ($role) {
                'doctor' => '/doctor',
                'patient' => '/patient',
                'lab', 'lab_staff' => '/analysis',
                default => '/analysis',
            });
        }

        if ($authenticated) {
            Auth::logout();
        }

        return back()->withErrors([
            'email' => 'Email ou mot de passe incorrect.'
        ]);
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}