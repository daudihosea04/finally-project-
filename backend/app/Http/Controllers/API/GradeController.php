<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GradeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get student's grades for all courses
    public function getStudentGrades(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only students can access this endpoint'
                ], 403);
            }
            
            $courses = $user->courses()->with('lecturer')->get();
            
            $grades = $courses->map(function($course) use ($user) {
                $enrollment = $course->students()->where('user_id', $user->id)->first();
                
                // Get all submissions for this course
                $submissions = Submission::whereHas('assignment', function($q) use ($course) {
                    $q->where('course_id', $course->id);
                })->where('student_id', $user->id)->get();
                
                $totalPoints = 0;
                $earnedPoints = 0;
                
                foreach ($submissions as $submission) {
                    if ($submission->grade !== null) {
                        $totalPoints += $submission->assignment->total_points;
                        $earnedPoints += $submission->grade;
                    }
                }
                
                $percentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 1) : 0;
                $letterGrade = $this->getLetterGrade($percentage);
                
                return [
                    'course_id' => $course->id,
                    'course_name' => $course->title,
                    'course_code' => $course->code,
                    'instructor' => $course->lecturer->name,
                    'credits' => $course->credits,
                    'grade_percentage' => $percentage,
                    'letter_grade' => $letterGrade,
                    'enrollment_grade' => $enrollment->pivot->grade ?? 'Not graded yet',
                    'submissions_count' => $submissions->count(),
                    'graded_count' => $submissions->whereNotNull('grade')->count()
                ];
            });
            
            // Calculate overall GPA
            $totalCredits = $courses->sum('credits');
            $totalPoints = 0;
            
            foreach ($grades as $grade) {
                $gradePoint = $this->getGradePoint($grade['letter_grade']);
                $totalPoints += $gradePoint * $grade['credits'];
            }
            
            $gpa = $totalCredits > 0 ? round($totalPoints / $totalCredits, 2) : 0;
            
            return response()->json([
                'success' => true,
                'data' => [
                    'gpa' => $gpa,
                    'total_credits' => $totalCredits,
                    'total_points' => $totalPoints,
                    'courses' => $grades
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get grades: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get grades for a specific course (lecturer)
    public function getCourseGrades(Request $request, $courseId)
    {
        try {
            $user = $request->user();
            $course = \App\Models\Course::findOrFail($courseId);
            
            if ($user->role !== 'admin' && $course->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view grades for this course'
                ], 403);
            }
            
            $students = $course->students()->get();
            $grades = [];
            
            foreach ($students as $student) {
                $enrollment = $student->pivot;
                $submissions = Submission::whereHas('assignment', function($q) use ($courseId) {
                    $q->where('course_id', $courseId);
                })->where('student_id', $student->id)->get();
                
                $totalPoints = 0;
                $earnedPoints = 0;
                
                foreach ($submissions as $submission) {
                    if ($submission->grade !== null) {
                        $totalPoints += $submission->assignment->total_points;
                        $earnedPoints += $submission->grade;
                    }
                }
                
                $percentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 1) : 0;
                
                $grades[] = [
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'registration_number' => $student->registration_number,
                    'overall_grade' => $enrollment->grade ?? 'Not graded',
                    'overall_percentage' => $percentage,
                    'submissions_count' => $submissions->count(),
                    'graded_count' => $submissions->whereNotNull('grade')->count(),
                    'average_score' => round($submissions->whereNotNull('grade')->avg('grade') ?? 0, 1)
                ];
            }
            
            // Sort by overall percentage
            usort($grades, function($a, $b) {
                return $b['overall_percentage'] <=> $a['overall_percentage'];
            });
            
            return response()->json([
                'success' => true,
                'data' => [
                    'course_id' => $courseId,
                    'course_name' => $course->title,
                    'total_students' => count($grades),
                    'average_grade' => round(collect($grades)->avg('overall_percentage'), 1),
                    'students' => $grades
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get course grades: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get grade analytics
    public function getGradeAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role === 'student') {
                $courses = $user->courses;
                $grades = [];
                
                foreach ($courses as $course) {
                    $submissions = Submission::whereHas('assignment', function($q) use ($course) {
                        $q->where('course_id', $course->id);
                    })->where('student_id', $user->id)->whereNotNull('grade')->get();
                    
                    if ($submissions->count() > 0) {
                        $grades[] = $submissions->avg('grade');
                    }
                }
                
                $analytics = [
                    'overall_average' => count($grades) > 0 ? round(array_sum($grades) / count($grades), 1) : 0,
                    'best_performing_course' => $this->getBestPerformingCourse($user->id),
                    'grade_distribution' => $this->getStudentGradeDistribution($user->id),
                    'improvement_trend' => $this->getGradeTrend($user->id)
                ];
                
            } elseif ($user->role === 'lecturer') {
                $courses = $user->taughtCourses;
                $allGrades = [];
                
                foreach ($courses as $course) {
                    $avgGrade = Submission::whereHas('assignment', function($q) use ($course) {
                        $q->where('course_id', $course->id);
                    })->avg('grade') ?? 0;
                    
                    $allGrades[] = [
                        'course_name' => $course->title,
                        'average_grade' => round($avgGrade, 1),
                        'total_submissions' => Submission::whereHas('assignment', function($q) use ($course) {
                            $q->where('course_id', $course->id);
                        })->count()
                    ];
                }
                
                $analytics = [
                    'overall_average' => count($allGrades) > 0 ? round(collect($allGrades)->avg('average_grade'), 1) : 0,
                    'courses' => $allGrades,
                    'grade_distribution' => $this->getLecturerGradeDistribution($user->id),
                    'top_students' => $this->getTopStudents($user->id, 5)
                ];
                
            } else {
                // Admin analytics
                $analytics = [
                    'institution_average' => round(Submission::avg('grade') ?? 0, 1),
                    'total_submissions' => Submission::count(),
                    'graded_submissions' => Submission::whereNotNull('grade')->count(),
                    'passing_rate' => round(Submission::where('grade', '>=', 60)->count() / max(1, Submission::count()) * 100, 1),
                    'grade_distribution' => $this->getInstitutionGradeDistribution()
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get grade analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper methods
    private function getLetterGrade($percentage)
    {
        if ($percentage >= 90) return 'A';
        if ($percentage >= 80) return 'B';
        if ($percentage >= 70) return 'C';
        if ($percentage >= 60) return 'D';
        return 'F';
    }
    
    private function getGradePoint($letterGrade)
    {
        switch($letterGrade) {
            case 'A': return 4.0;
            case 'B': return 3.0;
            case 'C': return 2.0;
            case 'D': return 1.0;
            default: return 0.0;
        }
    }
    
    private function getBestPerformingCourse($studentId)
    {
        $courses = \App\Models\User::find($studentId)->courses;
        $bestCourse = null;
        $bestGrade = 0;
        
        foreach ($courses as $course) {
            $enrollment = $course->students()->where('user_id', $studentId)->first();
            if ($enrollment && $enrollment->pivot->grade > $bestGrade) {
                $bestGrade = $enrollment->pivot->grade;
                $bestCourse = $course->title;
            }
        }
        
        return $bestCourse;
    }
    
    private function getStudentGradeDistribution($studentId)
    {
        $submissions = Submission::where('student_id', $studentId)->whereNotNull('grade')->get();
        
        return [
            'A' => $submissions->where('grade', '>=', 90)->count(),
            'B' => $submissions->whereBetween('grade', [80, 89])->count(),
            'C' => $submissions->whereBetween('grade', [70, 79])->count(),
            'D' => $submissions->whereBetween('grade', [60, 69])->count(),
            'F' => $submissions->where('grade', '<', 60)->count()
        ];
    }
    
    private function getGradeTrend($studentId)
    {
        return Submission::where('student_id', $studentId)
            ->whereNotNull('grade')
            ->orderBy('created_at', 'asc')
            ->select('grade', 'created_at')
            ->limit(10)
            ->get();
    }
    
    private function getLecturerGradeDistribution($lecturerId)
    {
        $submissions = Submission::whereHas('assignment', function($q) use ($lecturerId) {
            $q->where('lecturer_id', $lecturerId);
        })->whereNotNull('grade')->get();
        
        return [
            'A' => $submissions->where('grade', '>=', 90)->count(),
            'B' => $submissions->whereBetween('grade', [80, 89])->count(),
            'C' => $submissions->whereBetween('grade', [70, 79])->count(),
            'D' => $submissions->whereBetween('grade', [60, 69])->count(),
            'F' => $submissions->where('grade', '<', 60)->count()
        ];
    }
    
    private function getTopStudents($lecturerId, $limit = 5)
    {
        return DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->join('users', 'enrollments.user_id', '=', 'users.id')
            ->where('courses.lecturer_id', $lecturerId)
            ->whereNotNull('enrollments.grade')
            ->select('users.name', 'users.email', 'enrollments.grade', 'courses.title as course_name')
            ->orderBy('enrollments.grade', 'desc')
            ->limit($limit)
            ->get();
    }
    
    private function getInstitutionGradeDistribution()
    {
        $submissions = Submission::whereNotNull('grade')->get();
        
        return [
            'A' => $submissions->where('grade', '>=', 90)->count(),
            'B' => $submissions->whereBetween('grade', [80, 89])->count(),
            'C' => $submissions->whereBetween('grade', [70, 79])->count(),
            'D' => $submissions->whereBetween('grade', [60, 69])->count(),
            'F' => $submissions->where('grade', '<', 60)->count(),
            'total' => $submissions->count()
        ];
    }
}