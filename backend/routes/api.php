<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\API\GroupController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\VirtualRoomController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\VideoCallController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==================== PUBLIC ROUTES (No authentication) ====================

Route::post('/auth/student-register', [AuthController::class, 'studentRegister']);
Route::post('/auth/lecturer-register', [AuthController::class, 'lecturerRegister']);
Route::post('/auth/admin-register', [AuthController::class, 'adminRegister']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail']);
Route::post('/auth/resend-verification', [AuthController::class, 'resendVerification']);

// ==================== TEST ROUTE ====================

Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API is working!'
    ]);
});

// ==================== PUBLIC GROUP ROUTES ====================

Route::get('/groups/by-code/{code}', [GroupController::class, 'getGroupByCode']);
Route::post('/groups/join-by-code', [GroupController::class, 'joinByCode']);

// ==================== PROTECTED ROUTES (Authentication required) ====================

Route::middleware(['auth:sanctum'])->group(function () {
    
    // ===== AUTH & USER PROFILE ROUTES =====
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'changePassword']);
    Route::post('/user/online-status', [AuthController::class, 'updateOnlineStatus']);
    
    // ===== LECTURER ROUTES =====
    Route::prefix('lecturer')->group(function () {
        // Courses
        Route::get('/courses', [CourseController::class, 'lecturerCourses']);
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
        Route::get('/courses/{id}/students', [CourseController::class, 'lecturerStudents']);
        
        // Assignments
        Route::get('/assignments', [AssignmentController::class, 'lecturerAssignments']);
        Route::get('/assignments/{id}', [AssignmentController::class, 'show']);
        Route::post('/assignments', [AssignmentController::class, 'store']);
        Route::put('/assignments/{id}', [AssignmentController::class, 'update']);
        Route::delete('/assignments/{id}', [AssignmentController::class, 'destroy']);
        
        // Submissions
        Route::get('/submissions/pending', [SubmissionController::class, 'pendingSubmissions']);
        Route::get('/submissions/{id}', [SubmissionController::class, 'show']);
        Route::put('/submissions/{id}/grade', [SubmissionController::class, 'grade']);
        
        // Students
        Route::get('/students', [CourseController::class, 'lecturerStudents']);
        Route::get('/students/{id}', [StudentController::class, 'show']);
        Route::get('/students/{id}/progress', [StudentController::class, 'progress']);
        
        // Announcements
        Route::get('/announcements', [CourseController::class, 'lecturerAnnouncements']);
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);
        
        // Virtual Rooms
        Route::get('/virtual-rooms', [CourseController::class, 'lecturerVirtualRooms']);
        Route::post('/virtual-rooms', [VirtualRoomController::class, 'store']);
        Route::put('/virtual-rooms/{id}', [VirtualRoomController::class, 'update']);
        Route::delete('/virtual-rooms/{id}', [VirtualRoomController::class, 'destroy']);
        Route::post('/virtual-rooms/{id}/join', [VirtualRoomController::class, 'join']);
        
        // Reports
        Route::post('/reports/generate', [ReportController::class, 'generate']);
        Route::get('/reports/export-grades/{courseId}', [CourseController::class, 'exportGrades']);
        
        // Groups
        Route::get('/groups', [GroupController::class, 'lecturerGroups']);
        Route::post('/groups', [GroupController::class, 'store']);
        Route::put('/groups/{id}', [GroupController::class, 'update']);
        Route::delete('/groups/{id}', [GroupController::class, 'destroy']);
        Route::post('/groups/{id}/join', [GroupController::class, 'join']);
        Route::post('/groups/{id}/add-member', [GroupController::class, 'addMember']);
        Route::post('/groups/{id}/remove-member', [GroupController::class, 'removeMember']);
    });
    
    // ===== STUDENT ROUTES =====
    Route::prefix('student')->group(function () {
        // Courses
        Route::get('/courses', [CourseController::class, 'studentCourses']);
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        
        // Assignments
        Route::get('/assignments', [AssignmentController::class, 'studentAssignments']);
        Route::get('/assignments/{id}', [AssignmentController::class, 'show']);
        
        // Submissions
        Route::post('/assignments/{id}/submit', [SubmissionController::class, 'store']);
        Route::get('/submissions', [SubmissionController::class, 'studentSubmissions']);
        
        // Groups
        Route::get('/groups', [GroupController::class, 'studentGroups']);
        Route::post('/groups/{id}/join', [GroupController::class, 'studentJoin']);
        Route::post('/groups/{id}/leave', [GroupController::class, 'leave']);
        
        // Announcements
        Route::get('/announcements', [AnnouncementController::class, 'studentAnnouncements']);
        
        // Virtual Rooms
        Route::get('/virtual-rooms', [VirtualRoomController::class, 'studentRooms']);
        Route::post('/virtual-rooms/{id}/join', [VirtualRoomController::class, 'studentJoin']);
        
        // Progress
        Route::get('/progress', [StudentController::class, 'myProgress']);
    });
    
    // ===== ADMIN ROUTES =====
    Route::prefix('admin')->group(function () {
        // User Management
        Route::get('/users', [AuthController::class, 'getAllUsers']);
        Route::get('/users/{id}', [AuthController::class, 'getUser']);
        Route::post('/users', [AuthController::class, 'createUser']);
        Route::put('/users/{id}', [AuthController::class, 'updateUser']);
        Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);
        Route::post('/users/{id}/role', [AuthController::class, 'assignRole']);
        
        // Bulk Operations
        Route::post('/bulk/students', [AuthController::class, 'bulkUploadStudents']);
        Route::post('/bulk/lecturers', [AuthController::class, 'bulkUploadLecturers']);
        
        // Analytics & Reports
        Route::get('/analytics', [ReportController::class, 'systemAnalytics']);
        Route::get('/analytics/users', [ReportController::class, 'userAnalytics']);
        Route::get('/analytics/engagement', [ReportController::class, 'engagementAnalytics']);
        Route::get('/stats', [AuthController::class, 'getStats']);
        
        // Student Approval
        Route::post('/students/{id}/approve', [AuthController::class, 'approveStudent']);
        Route::delete('/students/{id}/reject', [AuthController::class, 'rejectStudent']);
    });
    
    // ===== CHAT ROUTES =====
    Route::prefix('chat')->group(function () {
        // ===== UNIFIED API (Recommended) =====
        Route::post('/send', [ChatController::class, 'sendMessage']);
        Route::get('/{type}/{id}/messages', [ChatController::class, 'getMessages']);
        Route::get('/{type}/{id}/participants', [ChatController::class, 'getParticipants']);
        Route::get('/conversations', [ChatController::class, 'getConversations']);
        Route::put('/messages/{id}/read', [ChatController::class, 'markAsRead']);
        Route::delete('/messages/{id}', [ChatController::class, 'deleteMessage']);
        Route::post('/status', [ChatController::class, 'updateOnlineStatus']);
        Route::post('/upload', [ChatController::class, 'uploadFile']);
        Route::get('/files/{fileId}/download', [ChatController::class, 'downloadFile']);
        Route::post('/typing/{conversationId}', [ChatController::class, 'sendTypingIndicator']);
        Route::get('/typing/{conversationId}/users', [ChatController::class, 'getTypingUsers']);
        Route::post('/messages/{messageId}/reaction', [ChatController::class, 'addReaction']);
        Route::delete('/messages/{messageId}/reaction', [ChatController::class, 'removeReaction']);
        Route::post('/course/broadcast', [ChatController::class, 'broadcastToCourse']);
        Route::get('/unread-count', [ChatController::class, 'getUnreadCount']);
        Route::get('/search', [ChatController::class, 'searchMessages']);
        Route::get('/stats', [ChatController::class, 'getStats']);
        Route::get('/groups', [ChatController::class, 'getUserGroups']);
        Route::get('/participants', [ChatController::class, 'getChatParticipants']);
        
        // ===== LEGACY - PRIVATE CHAT =====
        Route::get('/private/{userId}/messages', [ChatController::class, 'getPrivateMessages']);
        Route::post('/private/send', [ChatController::class, 'sendPrivateMessage']);
        Route::get('/private/{userId}/participant', [ChatController::class, 'getPrivateParticipant']);
        Route::get('/private/conversation/{userId}', [ChatController::class, 'getOrCreatePrivateConversation']);
        
        // ===== LEGACY - GROUP CHAT =====
        Route::post('/group/create', [ChatController::class, 'createGroup']);
        Route::get('/group/{groupId}/messages', [ChatController::class, 'getGroupMessages']);
        Route::post('/group/send', [ChatController::class, 'sendGroupMessage']);
        Route::get('/group/{groupId}/members', [ChatController::class, 'getGroupMembers']);
        Route::get('/group/{groupId}/online', [ChatController::class, 'getOnlineGroupUsers']);
        Route::post('/group/join', [ChatController::class, 'joinGroupByCode']);
        Route::post('/group/{groupId}/add-member', [ChatController::class, 'addGroupMember']);
        Route::delete('/group/{groupId}/member/{userId}', [ChatController::class, 'removeGroupMember']);
        Route::post('/group/{groupId}/leave', [ChatController::class, 'leaveGroup']);
        
        // ===== LEGACY - COURSE CHAT =====
        Route::get('/course/{courseId}/messages', [ChatController::class, 'getCourseMessages']);
        Route::post('/course/send', [ChatController::class, 'sendCourseMessage']);
        Route::get('/course/{courseId}/students', [ChatController::class, 'getCourseStudents']);
        Route::get('/course/{courseId}/online', [ChatController::class, 'getCourseOnlineUsers']);
        
        // ===== LEGACY - MESSAGE ACTIONS =====
        Route::post('/messages/{conversationId}/read', [ChatController::class, 'markConversationAsRead']);
    });
    
    // ===== NOTIFICATION ROUTES =====
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread', [NotificationController::class, 'unread']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::post('/send', [NotificationController::class, 'send']);
        Route::post('/send-to-course', [NotificationController::class, 'sendToCourse']);
        Route::post('/send-to-all', [NotificationController::class, 'sendToAll']);
    });
    
    // ===== COURSE MANAGEMENT ROUTES =====
    Route::prefix('courses')->group(function () {
        Route::get('/{id}', [CourseController::class, 'show']);
        Route::get('/{id}/students', [CourseController::class, 'getCourseStudents']);
        Route::get('/{id}/assignments', [CourseController::class, 'getCourseAssignments']);
        Route::get('/{id}/materials', [CourseController::class, 'getCourseMaterials']);
        Route::post('/{id}/materials/upload', [CourseController::class, 'uploadMaterial']);
        Route::delete('/materials/{id}', [CourseController::class, 'deleteMaterial']);
        Route::get('/materials/{id}/download', [CourseController::class, 'downloadMaterial']);
        Route::get('/{id}/export-grades', [CourseController::class, 'exportGrades']);
        Route::post('/{id}/send-message', [CourseController::class, 'sendMessage']);
    });
    
    // ===== ANNOUNCEMENTS ROUTES =====
    Route::prefix('announcements')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index']);
        Route::post('/', [AnnouncementController::class, 'store']);
        Route::get('/{id}', [AnnouncementController::class, 'show']);
        Route::put('/{id}', [AnnouncementController::class, 'update']);
        Route::delete('/{id}', [AnnouncementController::class, 'destroy']);
    });

    // ===========================================================
    // ===== ROLE-BASED DASHBOARD ROUTES ==========================
    // ===========================================================
    
    // ===== ADMIN ONLY DASHBOARD =====
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'success' => true,
                'message' => 'Welcome to Admin Dashboard',
                'role' => 'admin',
                'permissions' => [
                    'manage_users',
                    'manage_courses',
                    'manage_lecturers',
                    'view_stats',
                    'manage_roles'
                ],
                'stats' => [
                    'total_users' => \App\Models\User::count(),
                    'total_students' => \App\Models\User::where('role', 'student')->count(),
                    'total_lecturers' => \App\Models\User::where('role', 'lecturer')->count(),
                    'total_admins' => \App\Models\User::where('role', 'admin')->count(),
                ]
            ]);
        });
    });
    
    // ===== LECTURER & ADMIN DASHBOARD =====
    Route::middleware(['role:lecturer,admin'])->group(function () {
        Route::get('/lecturer/dashboard', function () {
            $user = auth()->user();
            return response()->json([
                'success' => true,
                'message' => 'Welcome to Lecturer Dashboard',
                'role' => 'lecturer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'department' => $user->department,
                ],
                'permissions' => [
                    'manage_courses',
                    'manage_assignments',
                    'grade_students',
                    'view_reports'
                ],
                'stats' => [
                    'total_courses' => \App\Models\Course::where('lecturer_id', $user->id)->count(),
                    'total_students' => \App\Models\Enrollment::whereHas('course', function($q) use ($user) {
                        $q->where('lecturer_id', $user->id);
                    })->count(),
                    'pending_submissions' => \App\Models\Submission::whereHas('assignment', function($q) use ($user) {
                        $q->whereHas('course', function($c) use ($user) {
                            $c->where('lecturer_id', $user->id);
                        });
                    })->where('status', 'submitted')->count(),
                ]
            ]);
        });
    });
    
    // ===== STUDENT, LECTURER & ADMIN DASHBOARD =====
    Route::middleware(['role:student,lecturer,admin'])->group(function () {
        Route::get('/student/dashboard', function () {
            $user = auth()->user();
            return response()->json([
                'success' => true,
                'message' => 'Welcome to Student Dashboard',
                'role' => 'student',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'registration_number' => $user->student->registration_number ?? 'N/A',
                ],
                'permissions' => [
                    'view_courses',
                    'submit_assignments',
                    'view_grades',
                    'join_groups'
                ],
                'stats' => [
                    'enrolled_courses' => \App\Models\Enrollment::where('user_id', $user->id)->count(),
                    'completed_assignments' => \App\Models\Submission::where('user_id', $user->id)
                        ->where('status', 'graded')
                        ->count(),
                    'pending_assignments' => \App\Models\Assignment::whereHas('course', function($q) use ($user) {
                        $q->whereHas('students', function($s) use ($user) {
                            $s->where('user_id', $user->id);
                        });
                    })->whereDoesntHave('submissions', function($s) use ($user) {
                        $s->where('user_id', $user->id);
                    })->count(),
                    'average_grade' => \App\Models\Submission::where('user_id', $user->id)
                        ->where('status', 'graded')
                        ->avg('grade') ?? 0,
                ]
            ]);
        });
    });
});

// ==================== VIDEO CALL ROUTES (Outside auth group) ====================

Route::middleware(['auth:sanctum'])->prefix('video-call')->group(function () {
    Route::post('/initialize/{roomId}', [VideoCallController::class, 'initialize']);
    Route::get('/participants/{roomId}', [VideoCallController::class, 'getParticipants']);
    Route::post('/end/{roomId}', [VideoCallController::class, 'endCall']);
    Route::post('/signal/{roomId}', [VideoCallController::class, 'signal']);
});

// ==================== FALLBACK ROUTE ====================

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Route not found'
    ], 404);
});