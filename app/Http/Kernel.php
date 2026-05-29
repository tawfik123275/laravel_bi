<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;
use App\Http\Middleware\RoleMiddleware ; 


class Kernel extends HttpKernel
{

    protected $middlewareAliases = [

        'role' => \App\Http\Middleware\RoleMiddleware::class ,

    ];

}