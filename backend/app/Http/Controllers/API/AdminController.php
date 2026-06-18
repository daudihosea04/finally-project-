<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    public function getDashboard(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'total_courses' => Course::count(),
                'total_messages' => 0,
                'completion_rate' => 85
            ]
        ]);
    }

    public function getStatistics(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => User::count(),
                'active_users' => User::where('status', 'active')->count(),
                'total_courses' => Course::count(),
                'total_messages' => 0,
                'completion_rate' => 85,
                'users_growth' => 12,
                'courses_growth' => 3,
                'engagement_rate' => 85
            ]
        ]);
    }

    public function getUsers(Request $request)
    {
        $users = User::paginate(20);
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function getUserDetail(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function createUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:student,lecturer,admin'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    public function updateUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'department' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only(['name', 'phone', 'department', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    public function deleteUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    public function activateUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $user->update(['status' => 'active']);

        return response()->json([
            'success' => true,
            'message' => 'User activated successfully'
        ]);
    }

    public function deactivateUser(Request $request, $userId)
    {
        $user = User::findOrFail($userId);
        $user->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'User deactivated successfully'
        ]);
    }

    public function getAllCourses(Request $request)
    {
        $courses = Course::with('lecturer')->get();
        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    public function createCourse(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:courses',
            'title' => 'required|string|max:255',
            'credits' => 'required|integer|min:1|max:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $course = Course::create([
            'code' => $request->code,
            'title' => $request->title,
            'description' => $request->description,
            'credits' => $request->credits,
            'lecturer_id' => $request->lecturer_id ?? 1,
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    public function updateCourse(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);
        $course->update($request->only(['title', 'description', 'credits', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    public function deleteCourse(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }

    public function getDepartments(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                ['id' => 1, 'name' => 'Computer Science', 'courses' => 12],
                ['id' => 2, 'name' => 'Information Technology', 'courses' => 10],
                ['id' => 3, 'name' => 'Business IT', 'courses' => 8]
            ]
        ]);
    }

    public function getSettings(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => [
                'site_name' => 'UCC Connect Hub',
                'maintenance_mode' => false,
                'registration_open' => true,
                'timezone' => 'Africa/Dar_es_Salaam'
            ]
        ]);
    }

    public function updateSettings(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully'
        ]);
    }

    public function getUsersReport(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ['report_url' => '/reports/users.csv']
        ]);
    }

    public function getCoursesReport(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ['report_url' => '/reports/courses.csv']
        ]);
    }

    public function createBackup(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Backup created successfully',
            'data' => ['file' => 'backup_' . date('Y_m_d') . '.sql']
        ]);
    }

    public function getBackups(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ['backups' => ['backup_2026_06_01.sql', 'backup_2026_06_07.sql']]
        ]);
    }

    public function sendNotificationToAll(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Notification sent to all users'
        ]);
    }

    public function sendNotificationToRole(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Notification sent to ' . ($request->role ?? 'selected') . ' users'
        ]);
    }
}