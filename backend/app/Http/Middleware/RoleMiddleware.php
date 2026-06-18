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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please login.'
            ], 401);
        }

        // Check if user has any of the allowed roles
        $hasRole = false;
        foreach ($roles as $role) {
            if ($user->role === $role) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden. You do not have permission to access this resource.',
                'required_roles' => $roles,
                'your_role' => $user->role
            ], 403);
        }

        return $next($request);
    }
}