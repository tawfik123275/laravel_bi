<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        abort_unless($user, 403);

        $allowedRoles = array_map(
            fn (string $role) => $role === 'lab_staff' ? 'lab' : $role,
            $roles
        );
        $userRole = $user->role === 'lab_staff' ? 'lab' : $user->role;

        abort_unless(in_array($userRole, $allowedRoles, true), 403);

        return $next($request);
    }
}
