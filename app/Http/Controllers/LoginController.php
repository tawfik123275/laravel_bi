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
            'role' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {

            $request->session()->regenerate();

            $role = Auth::user()->role;

            if ($role == 'doctor') {
                return redirect('/doctor');
            }

            if ($role == 'patient') {
                return redirect('/patient');
            }

            if ($role == 'clinic') {
                return redirect('/clinic');
            }

            if ($role == 'lab') {
                return redirect('/lab');
            }
        }

        return back()->withErrors([
            'email' => 'Email ou mot de passe incorrect.'
        ]);
    }
}