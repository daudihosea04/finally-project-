<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\ExamAttempt;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ExamController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get all exams (based on role)
    public function getExams(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->isStudent()) {
                // Student sees exams for enrolled courses
                $courseIds = $user->courses()->pluck('courses.id');
                $exams = Exam::whereIn('course_id', $courseIds)
                    ->with('course')
                    ->orderBy('start_date', 'asc')
                    ->get();
            } elseif ($user->isLecturer()) {
                // Lecturer sees exams for their courses
                $courseIds = $user->taughtCourses()->pluck('id');
                $exams = Exam::whereIn('course_id', $courseIds)
                    ->with('course')
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                // Admin sees all exams
                $exams = Exam::with(['course', 'creator'])->orderBy('created_at', 'desc')->get();
            }
            
            $formattedExams = $exams->map(function($exam) use ($user) {
                $attempt = null;
                if ($user->isStudent()) {
                    $attempt = ExamAttempt::where('exam_id', $exam->id)
                        ->where('student_id', $user->id)
                        ->first();
                }
                
                return [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'description' => $exam->description,
                    'course_id' => $exam->course_id,
                    'course_name' => $exam->course->title,
                    'duration_minutes' => $exam->duration_minutes,
                    'total_questions' => $exam->questions()->count(),
                    'total_points' => $exam->total_points,
                    'start_date' => $exam->start_date,
                    'end_date' => $exam->end_date,
                    'status' => $exam->status,
                    'attempt' => $attempt ? [
                        'attempted_at' => $attempt->started_at,
                        'submitted_at' => $attempt->submitted_at,
                        'score' => $attempt->score,
                        'status' => $attempt->status
                    ] : null,
                    'can_attempt' => $user->isStudent() && !$attempt && $exam->start_date <= now() && $exam->end_date >= now()
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedExams
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get exams: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get single exam detail
    public function getExamDetail(Request $request, $examId)
    {
        try {
            $user = $request->user();
            $exam = Exam::with(['course', 'questions', 'creator'])->findOrFail($examId);
            
            // Check if user has access
            if ($user->isStudent()) {
                $isEnrolled = $user->courses()->where('course_id', $exam->course_id)->exists();
                if (!$isEnrolled) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You are not enrolled in this course'
                    ], 403);
                }
            }
            
            if ($user->isLecturer()) {
                $isLecturer = $user->taughtCourses()->where('id', $exam->course_id)->exists();
                if (!$isLecturer && !$user->isAdmin()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You are not authorized to view this exam'
                    ], 403);
                }
            }
            
            $attempt = null;
            if ($user->isStudent()) {
                $attempt = ExamAttempt::where('exam_id', $examId)
                    ->where('student_id', $user->id)
                    ->first();
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $exam->id,
                    'title' => $exam->title,
                    'description' => $exam->description,
                    'instructions' => $exam->instructions,
                    'course_id' => $exam->course_id,
                    'course_name' => $exam->course->title,
                    'duration_minutes' => $exam->duration_minutes,
                    'total_questions' => $exam->questions->count(),
                    'total_points' => $exam->total_points,
                    'passing_score' => $exam->passing_score,
                    'start_date' => $exam->start_date,
                    'end_date' => $exam->end_date,
                    'status' => $exam->status,
                    'questions' => $user->isStudent() && $attempt && $attempt->status === 'in_progress' ? 
                        $exam->questions->map(function($q) {
                            return [
                                'id' => $q->id,
                                'question' => $q->question,
                                'type' => $q->type,
                                'options' => $q->options,
                                'points' => $q->points
                            ];
                        }) : ($user->isLecturer() || $user->isAdmin() ? $exam->questions : null),
                    'attempt' => $attempt,
                    'can_start' => $user->isStudent() && !$attempt && $exam->start_date <= now() && $exam->end_date >= now(),
                    'can_resume' => $user->isStudent() && $attempt && $attempt->status === 'in_progress'
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Exam not found: ' . $e->getMessage()
            ], 404);
        }
    }

    // Create exam (lecturer/admin)
    public function createExam(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'instructions' => 'nullable|string',
                'course_id' => 'required|exists:courses,id',
                'duration_minutes' => 'required|integer|min:10|max:180',
                'total_points' => 'required|integer|min:1',
                'passing_score' => 'required|integer|min:0|max:100',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            $course = Course::findOrFail($request->course_id);
            
            // Check authorization
            if ($course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to create exams for this course'
                ], 403);
            }
            
            $exam = Exam::create([
                'title' => $request->title,
                'description' => $request->description,
                'instructions' => $request->instructions,
                'course_id' => $request->course_id,
                'created_by' => $user->id,
                'duration_minutes' => $request->duration_minutes,
                'total_points' => $request->total_points,
                'passing_score' => $request->passing_score,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => 'draft'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Exam created successfully',
                'data' => $exam
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create exam: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update exam
    public function updateExam(Request $request, $examId)
    {
        try {
            $exam = Exam::findOrFail($examId);
            $user = $request->user();
            
            // Check authorization
            if ($exam->course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this exam'
                ], 403);
            }
            
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'instructions' => 'nullable|string',
                'duration_minutes' => 'sometimes|integer|min:10|max:180',
                'total_points' => 'sometimes|integer|min:1',
                'passing_score' => 'sometimes|integer|min:0|max:100',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after:start_date'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $exam->update($request->only([
                'title', 'description', 'instructions', 'duration_minutes',
                'total_points', 'passing_score', 'start_date', 'end_date'
            ]));
            
            return response()->json([
                'success' => true,
                'message' => 'Exam updated successfully',
                'data' => $exam
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update exam: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete exam
    public function deleteExam(Request $request, $examId)
    {
        try {
            $exam = Exam::findOrFail($examId);
            $user = $request->user();
            
            // Check authorization
            if ($exam->course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this exam'
                ], 403);
            }
            
            $exam->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Exam deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete exam: ' . $e->getMessage()
            ], 500);
        }
    }

    // Publish exam
    public function publishExam(Request $request, $examId)
    {
        try {
            $exam = Exam::findOrFail($examId);
            $user = $request->user();
            
            // Check authorization
            if ($exam->course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to publish this exam'
                ], 403);
            }
            
            // Check if exam has questions
            if ($exam->questions()->count() === 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot publish exam without questions'
                ], 400);
            }
            
            $exam->update(['status' => 'published']);
            
            return response()->json([
                'success' => true,
                'message' => 'Exam published successfully',
                'data' => $exam
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to publish exam: ' . $e->getMessage()
            ], 500);
        }
    }

    // Start exam (student)
    public function startExam(Request $request, $examId)
    {
        try {
            $user = $request->user();
            $exam = Exam::findOrFail($examId);
            
            // Check if student is enrolled
            if (!$user->courses()->where('course_id', $exam->course_id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            // Check if exam is available
            if ($exam->status !== 'published') {
                return response()->json([
                    'success' => false,
                    'message' => 'Exam is not available'
                ], 400);
            }
            
            if ($exam->start_date > now()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exam has not started yet'
                ], 400);
            }
            
            if ($exam->end_date < now()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Exam has already ended'
                ], 400);
            }
            
            // Check if already attempted
            $existingAttempt = ExamAttempt::where('exam_id', $examId)
                ->where('student_id', $user->id)
                ->first();
            
            if ($existingAttempt) {
                if ($existingAttempt->status === 'completed') {
                    return response()->json([
                        'success' => false,
                        'message' => 'You have already completed this exam'
                    ], 400);
                }
                
                if ($existingAttempt->status === 'in_progress') {
                    return response()->json([
                        'success' => true,
                        'message' => 'Resuming existing exam attempt',
                        'data' => [
                            'attempt_id' => $existingAttempt->id,
                            'started_at' => $existingAttempt->started_at,
                            'time_remaining' => $this->getTimeRemaining($existingAttempt->started_at, $exam->duration_minutes),
                            'questions' => $this->getStudentAnswers($existingAttempt->id)
                        ]
                    ]);
                }
            }
            
            // Create new attempt
            $attempt = ExamAttempt::create([
                'exam_id' => $examId,
                'student_id' => $user->id,
                'started_at' => now(),
                'status' => 'in_progress'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Exam started successfully',
                'data' => [
                    'attempt_id' => $attempt->id,
                    'started_at' => $attempt->started_at,
                    'time_remaining' => $exam->duration_minutes * 60,
                    'questions' => $exam->questions->map(function($q) {
                        return [
                            'id' => $q->id,
                            'question' => $q->question,
                            'type' => $q->type,
                            'options' => $q->options,
                            'points' => $q->points
                        ];
                    })
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start exam: ' . $e->getMessage()
            ], 500);
        }
    }

    // Submit exam (student)
    public function submitExam(Request $request, $examId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'attempt_id' => 'required|exists:exam_attempts,id',
                'answers' => 'required|array'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            $exam = Exam::findOrFail($examId);
            $attempt = ExamAttempt::findOrFail($request->attempt_id);
            
            // Verify ownership
            if ($attempt->student_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            // Check if already submitted
            if ($attempt->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Exam already submitted'
                ], 400);
            }
            
            // Calculate score
            $totalScore = 0;
            $answersData = [];
            
            foreach ($request->answers as $answer) {
                $question = ExamQuestion::find($answer['question_id']);
                if ($question) {
                    $isCorrect = false;
                    if ($question->type === 'multiple_choice' || $question->type === 'true_false') {
                        $isCorrect = $answer['answer'] === $question->correct_answer;
                    } elseif ($question->type === 'essay') {
                        $isCorrect = null; // Needs manual grading
                    }
                    
                    if ($isCorrect === true) {
                        $totalScore += $question->points;
                    }
                    
                    $answersData[] = [
                        'question_id' => $answer['question_id'],
                        'answer' => $answer['answer'],
                        'is_correct' => $isCorrect,
                        'points_earned' => $isCorrect === true ? $question->points : 0
                    ];
                }
            }
            
            // Save answers
            DB::table('exam_answers')->insert(
                array_map(function($answer) use ($attempt, $user) {
                    return [
                        'attempt_id' => $attempt->id,
                        'student_id' => $user->id,
                        'question_id' => $answer['question_id'],
                        'answer' => $answer['answer'],
                        'is_correct' => $answer['is_correct'],
                        'points_earned' => $answer['points_earned'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ];
                }, $answersData)
            );
            
            // Calculate percentage
            $percentage = ($totalScore / $exam->total_points) * 100;
            $passed = $percentage >= $exam->passing_score;
            
            // Update attempt
            $attempt->update([
                'submitted_at' => now(),
                'score' => $totalScore,
                'percentage' => $percentage,
                'passed' => $passed,
                'status' => 'completed'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Exam submitted successfully',
                'data' => [
                    'score' => $totalScore,
                    'total_points' => $exam->total_points,
                    'percentage' => round($percentage, 1),
                    'passed' => $passed,
                    'submitted_at' => now()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit exam: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper methods
    private function getTimeRemaining($startedAt, $durationMinutes)
    {
        $endTime = Carbon::parse($startedAt)->addMinutes($durationMinutes);
        $remaining = now()->diffInSeconds($endTime, false);
        return max(0, $remaining);
    }

    private function getStudentAnswers($attemptId)
    {
        // Implementation for retrieving student answers
        return [];
    }
}