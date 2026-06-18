<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// ==================== AUTHENTICATION ROUTES ====================
// This route is required for Laravel's authentication middleware
// It handles unauthenticated API requests
Route::get('/login', function () {
    return response()->json([
        'success' => false,
        'message' => 'Unauthenticated. Please login first.',
        'error' => 'Authentication required'
    ], 401);
})->name('login');