<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Group;
use App\Models\Notification;

class ReportController extends Controller
{
    /**
     * Generate report
     * POST /api/reports/generate
     */
    public function generate(Request $request)
    {
        try {
            $user = Auth::user();
            
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'type' => 'required|in:user,analytics,engagement',
                'format' => 'nullable|in:pdf,csv,json',
                'user_id' => 'nullable|exists:users,id',
                'course_id' => 'nullable|exists:courses,id',
                'date_from' => 'nullable|date',
                'date_to' => 'nullable|date'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $reportData = [];

            switch ($request->type) {
                case 'user':
                    $reportData = $this->generateUserReport($request);
                    break;
                case 'analytics':
                    $reportData = $this->generateAnalyticsReport($request);
                    break;
                case 'engagement':
                    $reportData = $this->generateEngagementReport($request);
                    break;
                default:
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid report type'
                    ], 400);
            }

            Log::info('Report generated', [
                'type' => $request->type,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'data' => $reportData,
                'message' => 'Report generated successfully',
                'generated_at' => now()->toISOString()
            ]);

        } catch (\Exception $e) {
            Log::error('Report generation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate User Report
     */
    private function generateUserReport($request)
    {
        $userId = $request->user_id ?? Auth::id();
        $user = User::with(['student', 'lecturer'])->find($userId);

        if (!$user) {
            return ['error' => 'User not found'];
        }

        // Get user's courses
        if ($user->role === 'student') {
            $courses = \DB::table('enrollments')
                ->join('courses', 'enrollments.course_id', '=', 'courses.id')
                ->where('enrollments.user_id', $userId)
                ->select('courses.*', 'enrollments.grade', 'enrollments.status')
                ->get();
        } else {
            $courses = Course::where('lecturer_id', $userId)->get();
        }

        // Get user's submissions
        $submissions = Submission::where('student_id', $userId)
            ->with('assignment')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get user's notifications
        $notifications = Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        // Get user's groups
        $groups = \DB::table('group_users')
            ->join('groups', 'group_users.group_id', '=', 'groups.id')
            ->where('group_users.user_id', $userId)
            ->select('groups.*')
            ->get();

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'registration_number' => $user->registration_number ?? 'N/A',
                'department' => $user->department ?? 'N/A',
                'joined_at' => $user->created_at->toISOString(),
                'last_login' => $user->last_login_at ? $user->last_login_at->toISOString() : null
            ],
            'courses' => $courses,
            'submissions' => $submissions,
            'notifications' => $notifications,
            'groups' => $groups,
            'statistics' => [
                'total_courses' => $courses->count(),
                'total_submissions' => $submissions->count(),
                'average_grade' => $submissions->avg('grade') ?? 0,
                'total_notifications' => $notifications->count()
            ]
        ];
    }

    /**
     * Generate Analytics Report
     */
    private function generateAnalyticsReport($request)
    {
        $dateFrom = $request->date_from ?? now()->subDays(30);
        $dateTo = $request->date_to ?? now();

        $totalUsers = User::count();
        $totalStudents = User::where('role', 'student')->count();
        $totalLecturers = User::where('role', 'lecturer')->count();
        $totalAdmins = User::where('role', 'admin')->count();

        $totalCourses = Course::count();
        $totalAssignments = Assignment::count();
        $totalSubmissions = Submission::count();

        // Active users in last 30 days
        $activeUsers = User::where('last_login_at', '>=', now()->subDays(30))->count();

        // New users in last 30 days
        $newUsers = User::where('created_at', '>=', now()->subDays(30))->count();

        // Submissions in date range
        $recentSubmissions = Submission::whereBetween('created_at', [$dateFrom, $dateTo])->count();

        // Average grade
        $avgGrade = Submission::where('status', 'graded')->avg('grade') ?? 0;

        return [
            'summary' => [
                'total_users' => $totalUsers,
                'total_students' => $totalStudents,
                'total_lecturers' => $totalLecturers,
                'total_admins' => $totalAdmins,
                'total_courses' => $totalCourses,
                'total_assignments' => $totalAssignments,
                'total_submissions' => $totalSubmissions
            ],
            'activity' => [
                'active_users_30_days' => $activeUsers,
                'new_users_30_days' => $newUsers,
                'submissions_30_days' => $recentSubmissions,
                'average_grade' => round($avgGrade, 2),
                'submission_rate' => $totalAssignments > 0 ? round(($totalSubmissions / $totalAssignments) * 100, 1) : 0
            ],
            'date_range' => [
                'from' => $dateFrom,
                'to' => $dateTo
            ]
        ];
    }

    /**
     * Generate Engagement Report
     */
    private function generateEngagementReport($request)
    {
        $dateFrom = $request->date_from ?? now()->subDays(30);
        $dateTo = $request->date_to ?? now();

        // Get daily active users for chart data
        $dailyActive = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dailyActive[$date] = User::whereDate('last_login_at', $date)->count();
        }

        // Get course engagement
        $courseEngagement = Course::withCount(['students', 'assignments'])
            ->take(10)
            ->get()
            ->map(function($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'students_count' => $course->students_count ?? 0,
                    'assignments_count' => $course->assignments_count ?? 0
                ];
            });

        // Group engagement
        $groupEngagement = Group::withCount('members')
            ->take(10)
            ->get()
            ->map(function($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'members_count' => $group->members_count ?? 0,
                    'created_at' => $group->created_at->toISOString()
                ];
            });

        return [
            'daily_active_users' => $dailyActive,
            'course_engagement' => $courseEngagement,
            'group_engagement' => $groupEngagement,
            'date_range' => [
                'from' => $dateFrom,
                'to' => $dateTo
            ]
        ];
    }

    /**
     * System analytics
     * GET /api/analytics
     */
    public function systemAnalytics()
    {
        try {
            $totalUsers = User::count();
            $totalStudents = User::where('role', 'student')->count();
            $totalLecturers = User::where('role', 'lecturer')->count();
            $totalAdmins = User::where('role', 'admin')->count();
            
            $totalCourses = Course::count();
            $totalAssignments = Assignment::count();
            $totalSubmissions = Submission::count();
            
            $activeUsers = User::where('last_login_at', '>=', now()->subDays(30))->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'users' => [
                        'total' => $totalUsers,
                        'students' => $totalStudents,
                        'lecturers' => $totalLecturers,
                        'admins' => $totalAdmins,
                        'active' => $activeUsers
                    ],
                    'courses' => $totalCourses,
                    'assignments' => $totalAssignments,
                    'submissions' => $totalSubmissions,
                    'submission_rate' => $totalAssignments > 0 ? round(($totalSubmissions / $totalAssignments) * 100, 1) : 0,
                    'average_grade' => round(Submission::where('status', 'graded')->avg('grade') ?? 0, 2)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('System analytics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get analytics'
            ], 500);
        }
    }

    /**
     * User analytics
     * GET /api/analytics/users
     */
    public function userAnalytics()
    {
        try {
            $usersByRole = User::select('role', \DB::raw('count(*) as count'))
                ->groupBy('role')
                ->get();

            $usersByStatus = User::select('status', \DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get();

            $newUsers = User::where('created_at', '>=', now()->subDays(30))->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'by_role' => $usersByRole,
                    'by_status' => $usersByStatus,
                    'new_users_30_days' => $newUsers,
                    'total_users' => User::count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('User analytics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user analytics'
            ], 500);
        }
    }

    /**
     * Engagement analytics
     * GET /api/analytics/engagement
     */
    public function engagementAnalytics()
    {
        try {
            // Get daily active users for last 7 days
            $dailyActive = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $dailyActive[] = [
                    'date' => $date,
                    'count' => User::whereDate('last_login_at', $date)->count()
                ];
            }

            // Get top 5 courses by enrollment
            $topCourses = Course::withCount('students')
                ->orderBy('students_count', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'daily_active' => $dailyActive,
                    'top_courses' => $topCourses,
                    'total_active_users' => User::where('last_login_at', '>=', now()->subDays(7))->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Engagement analytics error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get engagement analytics'
            ], 500);
        }
    }
}