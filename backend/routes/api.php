<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\AssignmentController;
use App\Http\Controllers\API\SubmissionController;
use App\Http\Controllers\API\ChatController;

/*
|--------------------------------------------------------------------------
| API Routes for UCC Connect Hub
|--------------------------------------------------------------------------
*/

// Public Routes (No Authentication Required)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected Routes (Authentication Required)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth Routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    
    // Course Routes
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    Route::get('/courses/lecturer/{id}', [CourseController::class, 'getByLecturer']);
    Route::get('/courses/student/{id}', [CourseController::class, 'getEnrolledCourses']);
    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']);
    
    // Assignment Routes
    Route::get('/assignments', [AssignmentController::class, 'index']);
    Route::get('/assignments/{id}', [AssignmentController::class, 'show']);
    Route::post('/assignments', [AssignmentController::class, 'store']);
    Route::put('/assignments/{id}', [AssignmentController::class, 'update']);
    Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy']);
    Route::get('/assignments/course/{id}', [AssignmentController::class, 'getByCourse']);
    
    // Submission Routes
    Route::get('/submissions', [SubmissionController::class, 'index']);
    Route::get('/submissions/{id}', [SubmissionController::class, 'show']);
    Route::post('/submissions', [SubmissionController::class, 'store']);
    Route::put('/submissions/{id}', [SubmissionController::class, 'update']);
    Route::get('/submissions/student/{id}', [SubmissionController::class, 'getByStudent']);
    Route::get('/submissions/assignment/{id}', [SubmissionController::class, 'getByAssignment']);
    
    // Chat Routes
    Route::get('/groups', [ChatController::class, 'getGroups']);
    Route::post('/groups', [ChatController::class, 'createGroup']);
    Route::get('/groups/{id}/messages', [ChatController::class, 'getMessages']);
    Route::post('/groups/{id}/messages', [ChatController::class, 'sendMessage']);
    Route::post('/groups/{id}/join', [ChatController::class, 'joinGroup']);
    Route::delete('/groups/{id}/leave', [ChatController::class, 'leaveGroup']);
});