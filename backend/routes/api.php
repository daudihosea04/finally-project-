<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CourseController;
use App\Http\Controllers\API\AssignmentController;
use App\Http\Controllers\API\FileUploadController;

// ========== PUBLIC ROUTES (No authentication required) ==========
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// ========== PROTECTED ROUTES (Authentication required) ==========
Route::middleware('auth:sanctum')->group(function () {
    
    // ========== AUTHENTICATION ROUTES ==========
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/user/password', [AuthController::class, 'changePassword']);
    
    // ========== COURSE ROUTES ==========
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/lecturer', [CourseController::class, 'lecturerCourses']);
    Route::get('/courses/student', [CourseController::class, 'studentCourses']);
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    Route::get('/courses/lecturer/{id}', [CourseController::class, 'getByLecturer']);
    Route::get('/courses/student/{id}', [CourseController::class, 'getEnrolledCourses']);
    Route::get('/courses/{id}/students', [CourseController::class, 'students']);
    Route::get('/courses/{id}/assignments', [CourseController::class, 'assignments']);
    Route::post('/courses/{id}/enroll', [CourseController::class, 'enroll']);
    
    // ========== ASSIGNMENT ROUTES ==========
    Route::get('/assignments', [AssignmentController::class, 'index']);
    Route::get('/assignments/lecturer', [AssignmentController::class, 'getByLecturer']);
    Route::get('/assignments/student', [AssignmentController::class, 'getForStudent']);
    Route::get('/assignments/course/{courseId}', [AssignmentController::class, 'getByCourse']);
    Route::get('/assignments/{id}', [AssignmentController::class, 'show']);
    Route::post('/assignments', [AssignmentController::class, 'store']);
    Route::put('/assignments/{id}', [AssignmentController::class, 'update']);
    Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy']);
    
    // ========== SUBMISSION ROUTES ==========
    Route::get('/submissions/lecturer', [AssignmentController::class, 'getLecturerSubmissions']);
    Route::post('/assignments/{id}/submit', [AssignmentController::class, 'submit']);
    Route::post('/submissions/{id}/grade', [AssignmentController::class, 'grade']);
    Route::get('/assignments/{id}/submissions', [AssignmentController::class, 'getSubmissions']);
    Route::get('/assignments/{id}/my-submission', [AssignmentController::class, 'mySubmission']);
    Route::get('/assignments/statistics', [AssignmentController::class, 'getStatistics']);
    
    // ========== FILE UPLOAD ROUTES ==========
    Route::post('/files/assignment/{id}', [FileUploadController::class, 'uploadAssignmentFile']);
    Route::post('/files/submission/{id}', [FileUploadController::class, 'uploadSubmissionFile']);
    Route::get('/files/download/{type}/{id}', [FileUploadController::class, 'download']);
    Route::delete('/files/{type}/{id}', [FileUploadController::class, 'delete']);
});