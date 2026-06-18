<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function getDashboard()
    {
        return response()->json([
            'total_users' => 1250,
            'active_users' => 890,
            'total_courses' => 48,
            'active_courses' => 45,
            'total_assignments' => 156,
            'submission_rate' => 78
        ]);
    }
    
    public function getStatistics()
    {
        return response()->json([
            'users_growth' => 12,
            'courses_growth' => 3,
            'engagement_rate' => 85
        ]);
    }
    
    public function getAnalytics()
    {
        return response()->json([
            'total_platform_users' => 1250,
            'active_sessions' => 345,
            'daily_active_users' => 678,
            'weekly_growth' => 5.5
        ]);
    }
    
    public function getUsers()
    {
        return response()->json([
            ['id' => 1, 'name' => 'Admin User', 'email' => 'admin@ucc.ac.tz', 'role' => 'admin', 'status' => 'active'],
            ['id' => 2, 'name' => 'John Lecturer', 'email' => 'lecturer@ucc.ac.tz', 'role' => 'lecturer', 'status' => 'active'],
            ['id' => 3, 'name' => 'Test Student', 'email' => 'student@ucc.ac.tz', 'role' => 'student', 'status' => 'active']
        ]);
    }
    
    public function getUserDetail($userId)
    {
        return response()->json([
            'id' => $userId,
            'name' => 'User Name',
            'email' => 'user@example.com',
            'role' => 'student',
            'status' => 'active',
            'joined_date' => '2024-01-15'
        ]);
    }
    
    public function createUser(Request $request)
    {
        return response()->json(['message' => 'User created successfully']);
    }
    
    public function updateUser($userId, Request $request)
    {
        return response()->json(['message' => 'User updated successfully']);
    }
    
    public function deleteUser($userId)
    {
        return response()->json(['message' => 'User deleted successfully']);
    }
    
    public function activateUser($userId)
    {
        return response()->json(['message' => 'User activated']);
    }
    
    public function deactivateUser($userId)
    {
        return response()->json(['message' => 'User deactivated']);
    }
    
    public function getAllCourses()
    {
        return response()->json([
            ['id' => 1, 'name' => 'Web Development', 'enrolled' => 45, 'lecturer' => 'Prof. John'],
            ['id' => 2, 'name' => 'Database Systems', 'enrolled' => 40, 'lecturer' => 'Dr. Sarah'],
            ['id' => 3, 'name' => 'AI Fundamentals', 'enrolled' => 35, 'lecturer' => 'Prof. Mike']
        ]);
    }
    
    public function createCourse(Request $request)
    {
        return response()->json(['message' => 'Course created']);
    }
    
    public function updateCourse($courseId, Request $request)
    {
        return response()->json(['message' => 'Course updated']);
    }
    
    public function deleteCourse($courseId)
    {
        return response()->json(['message' => 'Course deleted']);
    }
    
    public function getDepartments()
    {
        return response()->json([
            ['id' => 1, 'name' => 'Computer Science', 'hod' => 'Prof. John', 'courses' => 12],
            ['id' => 2, 'name' => 'Information Technology', 'hod' => 'Dr. Sarah', 'courses' => 10]
        ]);
    }
    
    public function createDepartment(Request $request)
    {
        return response()->json(['message' => 'Department created']);
    }
    
    public function updateDepartment($departmentId, Request $request)
    {
        return response()->json(['message' => 'Department updated']);
    }
    
    public function deleteDepartment($departmentId)
    {
        return response()->json(['message' => 'Department deleted']);
    }
    
    public function getSettings()
    {
        return response()->json([
            'site_name' => 'UCC Connect Hub',
            'maintenance_mode' => false,
            'registration_open' => true,
            'timezone' => 'Africa/Dar_es_Salaam'
        ]);
    }
    
    public function updateSettings(Request $request)
    {
        return response()->json(['message' => 'Settings updated']);
    }
    
    public function getUsersReport()
    {
        return response()->json(['report_url' => '/reports/users.csv']);
    }
    
    public function getCoursesReport()
    {
        return response()->json(['report_url' => '/reports/courses.csv']);
    }
    
    public function getAttendanceReport()
    {
        return response()->json(['report_url' => '/reports/attendance.csv']);
    }
    
    public function getPerformanceReport()
    {
        return response()->json(['report_url' => '/reports/performance.csv']);
    }
    
    public function exportReport(Request $request)
    {
        return response()->json(['message' => 'Report generated', 'download_url' => '/exports/report.csv']);
    }
    
    public function sendNotificationToAll(Request $request)
    {
        return response()->json(['message' => 'Notification sent to all users']);
    }
    
    public function sendNotificationToRole(Request $request)
    {
        return response()->json(['message' => 'Notification sent to role']);
    }
    
    public function createBackup(Request $request)
    {
        return response()->json(['message' => 'Backup created', 'file' => 'backup_2026_06_11.sql']);
    }
    
    public function getBackups()
    {
        return response()->json(['backups' => ['backup_2026_06_01.sql', 'backup_2026_06_07.sql']]);
    }
    
    public function restoreBackup(Request $request)
    {
        return response()->json(['message' => 'Backup restored']);
    }
    
    public function deleteBackup($backupId)
    {
        return response()->json(['message' => 'Backup deleted']);
    }
}