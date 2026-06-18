<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Student analytics
    public function studentAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user->isStudent()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only students can access student analytics'
                ], 403);
            }
            
            // Performance trends
            $trends = Submission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('AVG(grade) as average'))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->limit(6)
                ->get();
            
            // Grade distribution
            $distribution = Submission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->select(DB::raw('
                    CASE 
                        WHEN grade >= 90 THEN "A"
                        WHEN grade >= 80 THEN "B"
                        WHEN grade >= 70 THEN "C"
                        WHEN grade >= 60 THEN "D"
                        ELSE "F"
                    END as letter_grade
                '), DB::raw('COUNT(*) as count'))
                ->groupBy('letter_grade')
                ->get();
            
            // Predictions
            $currentGPA = Submission::where('student_id', $user->id)->avg('grade') / 25 ?? 0;
            $trend = $trends->last()->average ?? 0;
            $predictedGPA = ($currentGPA * 0.7) + (($trend / 25) * 0.3);
            
            $predictions = [
                'predicted_gpa' => round($predictedGPA, 2),
                'pass_rate' => round(Submission::where('student_id', $user->id)->where('grade', '>=', 60)->count() / max(1, Submission::where('student_id', $user->id)->count()) * 100, 1),
                'at_risk' => $currentGPA < 2.0,
                'improvement_needed' => $currentGPA < 2.5 ? ['Focus on assignments', 'Attend more lectures'] : []
            ];
            
            return response()->json([
                'success' => true,
                'data' => [
                    'trends' => $trends,
                    'distribution' => $distribution,
                    'predictions' => $predictions,
                    'gpa' => round($currentGPA, 2),
                    'average_score' => round(Submission::where('student_id', $user->id)->avg('grade') ?? 0, 1)
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get student analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Lecturer analytics
    public function lecturerAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user->isLecturer()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only lecturers can access lecturer analytics'
                ], 403);
            }
            
            $courses = $user->taughtCourses;
            
            $analytics = [
                'courses_taught' => $courses->count(),
                'total_students' => $courses->sum(function($course) {
                    return $course->students()->count();
                }),
                'average_grade' => round(Submission::whereHas('assignment.course', function($q) use ($user) {
                    $q->where('lecturer_id', $user->id);
                })->avg('grade') ?? 0, 1),
                'submission_rate' => round($this->getSubmissionRate($user->id), 1),
                'top_performing_course' => $this->getTopPerformingCourse($user->id),
                'needs_improvement' => $this->getNeedsImprovementCourse($user->id),
                'engagement_trends' => $this->getEngagementTrends($user->id)
            ];
            
            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get lecturer analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Admin analytics
    public function adminAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only admins can access admin analytics'
                ], 403);
            }
            
            $totalUsers = User::count();
            $activeUsers = User::where('status', 'active')->count();
            
            $analytics = [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'total_courses' => Course::count(),
                'active_courses' => Course::where('status', 'active')->count(),
                'total_assignments' => Assignment::count(),
                'total_submissions' => Submission::count(),
                'average_grade' => round(Submission::avg('grade') ?? 0, 1),
                'completion_rate' => round(($activeUsers / max(1, $totalUsers)) * 100, 1),
                'user_growth' => $this->getUserGrowth(),
                'course_popularity' => $this->getCoursePopularity(),
                'engagement_metrics' => $this->getEngagementMetrics()
            ];
            
            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get admin analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Course analytics
    public function courseAnalytics(Request $request, $courseId)
    {
        try {
            $user = $request->user();
            $course = Course::findOrFail($courseId);
            
            // Check authorization
            if ($user->isStudent() && !$course->isEnrolled($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            if ($user->isLecturer() && $course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view analytics for this course'
                ], 403);
            }
            
            $analytics = [
                'course_id' => $course->id,
                'course_name' => $course->title,
                'total_students' => $course->students()->count(),
                'average_attendance' => round($course->students()->avg('attendance') ?? 0, 1),
                'average_grade' => round(Submission::whereHas('assignment', function($q) use ($courseId) {
                    $q->where('course_id', $courseId);
                })->avg('grade') ?? 0, 1),
                'assignment_completion' => $this->getAssignmentCompletion($courseId),
                'grade_distribution' => $this->getGradeDistribution($courseId),
                'top_performers' => $this->getTopPerformers($courseId, 5),
                'engagement_score' => $this->getCourseEngagementScore($courseId)
            ];
            
            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get course analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Performance analytics
    public function getPerformanceAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            $data = [
                'overall_performance' => $this->getOverallPerformance($user),
                'strengths' => $this->getStrengths($user),
                'weaknesses' => $this->getWeaknesses($user),
                'recommendations' => $this->getRecommendations($user),
                'comparison' => $this->getPeerComparison($user)
            ];
            
            return response()->json([
                'success' => true,
                'data' => $data
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get performance analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Attendance analytics
    public function getAttendanceAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->isStudent()) {
                $analytics = [
                    'overall_attendance' => round(DB::table('enrollments')->where('user_id', $user->id)->avg('attendance') ?? 0, 1),
                    'attendance_by_course' => $this->getAttendanceByCourse($user->id),
                    'trends' => $this->getAttendanceTrends($user->id),
                    'status' => $this->getAttendanceStatus($user->id)
                ];
            } elseif ($user->isLecturer()) {
                $analytics = [
                    'course_averages' => $this->getCourseAttendanceAverages($user->id),
                    'overall_average' => round(DB::table('enrollments')
                        ->whereIn('course_id', $user->taughtCourses()->pluck('id'))
                        ->avg('attendance') ?? 0, 1),
                    'at_risk_students' => $this->getAtRiskStudents($user->id)
                ];
            } else {
                $analytics = [
                    'institution_average' => round(DB::table('enrollments')->avg('attendance') ?? 0, 1),
                    'department_comparison' => $this->getDepartmentAttendanceComparison(),
                    'monthly_trends' => $this->getMonthlyAttendanceTrends()
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get attendance analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Engagement analytics
    public function getEngagementAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            $analytics = [
                'chat_participation' => ChatMessage::where('sender_id', $user->id)->count(),
                'assignment_submissions' => Submission::where('student_id', $user->id)->count(),
                'course_interactions' => $this->getCourseInteractions($user->id),
                'engagement_score' => $this->calculateEngagementScore($user->id),
                'active_days' => $this->getActiveDays($user->id),
                'last_active' => $user->last_login_at ?? $user->created_at
            ];
            
            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get engagement analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper methods for analytics
    private function getSubmissionRate($lecturerId)
    {
        $totalAssignments = Assignment::where('lecturer_id', $lecturerId)->count();
        $totalSubmissions = Submission::whereHas('assignment', function($q) use ($lecturerId) {
            $q->where('lecturer_id', $lecturerId);
        })->count();
        
        $expectedSubmissions = $totalAssignments * User::whereHas('courses', function($q) use ($lecturerId) {
            $q->where('lecturer_id', $lecturerId);
        })->count();
        
        return $expectedSubmissions > 0 ? ($totalSubmissions / $expectedSubmissions) * 100 : 0;
    }

    private function getTopPerformingCourse($lecturerId)
    {
        return Course::where('lecturer_id', $lecturerId)
            ->withAvg('students', 'grade')
            ->orderBy('students_avg_grade', 'desc')
            ->first();
    }

    private function getNeedsImprovementCourse($lecturerId)
    {
        return Course::where('lecturer_id', $lecturerId)
            ->withAvg('students', 'grade')
            ->orderBy('students_avg_grade', 'asc')
            ->first();
    }

    private function getEngagementTrends($lecturerId)
    {
        return DB::table('submissions')
            ->join('assignments', 'submissions.assignment_id', '=', 'assignments.id')
            ->where('assignments.lecturer_id', $lecturerId)
            ->select(DB::raw('DATE_FORMAT(submissions.created_at, "%Y-%m") as month'), DB::raw('COUNT(*) as submissions'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->limit(6)
            ->get();
    }

    private function getUserGrowth()
    {
        return DB::table('users')
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('COUNT(*) as new_users'))
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();
    }

    private function getCoursePopularity()
    {
        return Course::withCount('students')
            ->orderBy('students_count', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'students_count']);
    }

    private function getEngagementMetrics()
    {
        return [
            'daily_active_users' => User::where('last_login_at', '>=', now()->subDay())->count(),
            'weekly_active_users' => User::where('last_login_at', '>=', now()->subWeek())->count(),
            'monthly_active_users' => User::where('last_login_at', '>=', now()->subMonth())->count(),
            'total_chat_messages' => ChatMessage::count()
        ];
    }

    private function getAssignmentCompletion($courseId)
    {
        $totalAssignments = Assignment::where('course_id', $courseId)->count();
        $completedSubmissions = Submission::whereHas('assignment', function($q) use ($courseId) {
            $q->where('course_id', $courseId);
        })->whereNotNull('grade')->count();
        
        return $totalAssignments > 0 ? round(($completedSubmissions / ($totalAssignments * Course::find($courseId)->students()->count())) * 100, 1) : 0;
    }

    private function getGradeDistribution($courseId)
    {
        return Submission::whereHas('assignment', function($q) use ($courseId) {
            $q->where('course_id', $courseId);
        })->select(DB::raw('
            CASE 
                WHEN grade >= 90 THEN "A"
                WHEN grade >= 80 THEN "B"
                WHEN grade >= 70 THEN "C"
                WHEN grade >= 60 THEN "D"
                ELSE "F"
            END as letter_grade
        '), DB::raw('COUNT(*) as count'))
        ->groupBy('letter_grade')
        ->get();
    }

    private function getTopPerformers($courseId, $limit = 5)
    {
        return DB::table('enrollments')
            ->join('users', 'enrollments.user_id', '=', 'users.id')
            ->where('enrollments.course_id', $courseId)
            ->orderBy('enrollments.grade', 'desc')
            ->limit($limit)
            ->get(['users.name', 'users.email', 'enrollments.grade']);
    }

    private function getCourseEngagementScore($courseId)
    {
        $chatActivity = ChatMessage::where('course_id', $courseId)->count();
        $submissionRate = $this->getAssignmentCompletion($courseId);
        
        return round(($chatActivity * 0.3) + ($submissionRate * 0.7), 1);
    }

    private function getOverallPerformance($user)
    {
        if ($user->isStudent()) {
            return [
                'gpa' => round(Submission::where('student_id', $user->id)->avg('grade') / 25 ?? 0, 2),
                'completion_rate' => round(Submission::where('student_id', $user->id)->whereNotNull('grade')->count() / max(1, Submission::where('student_id', $user->id)->count()) * 100, 1),
                'total_credits_earned' => $user->courses()->sum('credits')
            ];
        }
        return null;
    }

    private function getStrengths($user)
    {
        // Implementation for calculating strengths
        return ['Good attendance', 'Consistent assignment submission'];
    }

    private function getWeaknesses($user)
    {
        // Implementation for calculating weaknesses
        return [];
    }

    private function getRecommendations($user)
    {
        // Implementation for generating recommendations
        return ['Focus on improving grades in core courses'];
    }

    private function getPeerComparison($user)
    {
        // Implementation for peer comparison
        return ['above_average' => true, 'percentile' => 75];
    }

    private function getAttendanceByCourse($studentId)
    {
        return DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->where('enrollments.user_id', $studentId)
            ->get(['courses.title', 'enrollments.attendance']);
    }

    private function getAttendanceTrends($studentId)
    {
        return DB::table('attendance_records')
            ->where('student_id', $studentId)
            ->select(DB::raw('DATE_FORMAT(date, "%Y-%m") as month'), DB::raw('COUNT(*) as total'), DB::raw('SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->limit(6)
            ->get()
            ->map(function($item) {
                $item->rate = $item->total > 0 ? round(($item->present / $item->total) * 100, 1) : 0;
                return $item;
            });
    }

    private function getAttendanceStatus($studentId)
    {
        $avgAttendance = DB::table('enrollments')->where('user_id', $studentId)->avg('attendance') ?? 0;
        
        if ($avgAttendance >= 80) return 'Excellent';
        if ($avgAttendance >= 60) return 'Satisfactory';
        return 'At Risk';
    }

    private function getCourseAttendanceAverages($lecturerId)
    {
        return DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->where('courses.lecturer_id', $lecturerId)
            ->select('courses.title', DB::raw('AVG(enrollments.attendance) as avg_attendance'))
            ->groupBy('courses.id', 'courses.title')
            ->get();
    }

    private function getAtRiskStudents($lecturerId)
    {
        return DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->join('users', 'enrollments.user_id', '=', 'users.id')
            ->where('courses.lecturer_id', $lecturerId)
            ->where('enrollments.attendance', '<', 60)
            ->select('users.name', 'users.email', 'courses.title', 'enrollments.attendance')
            ->get();
    }

    private function getDepartmentAttendanceComparison()
    {
        return DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->join('departments', 'courses.department_id', '=', 'departments.id')
            ->select('departments.name', DB::raw('AVG(enrollments.attendance) as avg_attendance'))
            ->groupBy('departments.id', 'departments.name')
            ->get();
    }

    private function getMonthlyAttendanceTrends()
    {
        return DB::table('attendance_records')
            ->select(DB::raw('DATE_FORMAT(date, "%Y-%m") as month'), DB::raw('COUNT(*) as total'), DB::raw('SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present'))
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->limit(6)
            ->get()
            ->map(function($item) {
                $item->rate = $item->total > 0 ? round(($item->present / $item->total) * 100, 1) : 0;
                return $item;
            });
    }

    private function getCourseInteractions($userId)
    {
        return DB::table('chat_messages')
            ->where('sender_id', $userId)
            ->select('course_id', DB::raw('COUNT(*) as message_count'))
            ->groupBy('course_id')
            ->get();
    }

    private function calculateEngagementScore($userId)
    {
        $chatCount = ChatMessage::where('sender_id', $userId)->count();
        $submissionCount = Submission::where('student_id', $userId)->count();
        
        $chatScore = min(100, ($chatCount / 100) * 100);
        $submissionScore = min(100, $submissionCount * 10);
        
        return round(($chatScore * 0.3) + ($submissionScore * 0.7), 1);
    }

    private function getActiveDays($userId)
    {
        $lastLogin = User::find($userId)->last_login_at;
        if (!$lastLogin) return 0;
        
        return now()->diffInDays($lastLogin);
    }
}