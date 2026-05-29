<?php

namespace App\Http\Controllers\Doctor;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DoctorController extends Controller
{     
   

    public function __construct()
    {
            // $doctorId = Auth::id(); // ✅ r
       
    }
    public function index()
    {
        return view('doctor.index');
    }
     public function prescription()
    {
        // $doctorId = Auth::id(); // ✅ real logged-in doctor
         $doctorId = 12;
        return view('doctor.prescription', compact('doctorId'));
    }
}