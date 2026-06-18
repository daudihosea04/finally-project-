<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, return null instead of redirecting to login
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        // For web requests, redirect to login page
        return route('login');
    }
}