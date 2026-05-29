<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ManagerAnalysisController extends Controller
{
     public function index()
    {
        return view('managerAnalysis.index');
    }
}
