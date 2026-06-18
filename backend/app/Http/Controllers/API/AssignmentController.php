<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get all assignments (Admin only)
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role === 'admin') {
                $assignments = Assignment::with(['course', 'lecturer'])->get();
            } elseif ($user->role === 'lecturer') {
                $assignments = Assignment::where('lecturer_id', $user->id)
                    ->with(['course'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                // Student - only enrolled courses
                $courseIds = $user->courses()->pluck('courses.id');
                $assignments = Assignment::whereIn('course_id', $courseIds)
                    ->with(['course', 'lecturer'])
                    ->orderBy('due_date', 'asc')
                    ->get();
            }
            
            return response()->json([
                'success' => true,
                'data' => $assignments
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch assignments: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get single assignment
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::with(['course', 'lecturer'])->findOrFail($id);
            
            // Check authorization for students
            if ($user->role === 'student') {
                $isEnrolled = $user->courses()->where('course_id', $assignment->course_id)->exists();
                if (!$isEnrolled) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You are not enrolled in this course'
                    ], 403);
                }
            }
            
            // Check authorization for lecturers
            if ($user->role === 'lecturer') {
                if ($assignment->lecturer_id !== $user->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You are not authorized to view this assignment'
                    ], 403);
                }
            }
            
            // Get student's submission if exists
            $submission = null;
            if ($user->role === 'student') {
                $submission = Submission::where('assignment_id', $id)
                    ->where('student_id', $user->id)
                    ->first();
            }
            
            // Get submissions for lecturer
            $submissions = null;
            if ($user->role === 'lecturer' || $user->role === 'admin') {
                $submissions = Submission::where('assignment_id', $id)
                    ->with('student')
                    ->orderBy('submitted_at', 'desc')
                    ->get();
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'course_id' => $assignment->course_id,
                    'course_name' => $assignment->course->title,
                    'lecturer_name' => $assignment->lecturer->name,
                    'due_date' => $assignment->due_date,
                    'due_time' => $assignment->due_time,
                    'total_points' => $assignment->total_points,
                    'status' => $assignment->status,
                    'attachment_url' => $assignment->attachment ? Storage::url($assignment->attachment) : null,
                    'my_submission' => $submission,
                    'all_submissions' => $submissions,
                    'can_submit' => ($user->role === 'student') && !$submission && $assignment->due_date >= now(),
                    'can_grade' => ($user->role === 'lecturer' || $user->role === 'admin'),
                    'submission_stats' => $submissions ? [
                        'total' => $submissions->count(),
                        'graded' => $submissions->whereNotNull('grade')->count(),
                        'pending' => $submissions->whereNull('grade')->count(),
                        'average_grade' => round($submissions->whereNotNull('grade')->avg('grade') ?? 0, 2)
                    ] : null
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment not found: ' . $e->getMessage()
            ], 404);
        }
    }

    // Create assignment (Lecturer/Admin)
    public function store(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'course_id' => 'required|exists:courses,id',
                'due_date' => 'required|date',
                'due_time' => 'nullable|date_format:H:i',
                'total_points' => 'required|integer|min:1|max:1000',
                'attachment' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Check if user is lecturer of this course
            $course = Course::find($request->course_id);
            if ($user->role !== 'admin' && $course->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to create assignments for this course'
                ], 403);
            }
            
            $assignmentData = [
                'title' => $request->title,
                'description' => $request->description,
                'course_id' => $request->course_id,
                'lecturer_id' => $user->id,
                'created_by' => $user->id,
                'due_date' => $request->due_date,
                'due_time' => $request->due_time,
                'total_points' => $request->total_points,
                'status' => 'active'
            ];
            
            if ($request->hasFile('attachment')) {
                $path = $request->file('attachment')->store('assignments', 'public');
                $assignmentData['attachment'] = $path;
            }

            $assignment = Assignment::create($assignmentData);

            return response()->json([
                'success' => true,
                'message' => 'Assignment created successfully',
                'data' => $assignment
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update assignment
    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::findOrFail($id);
            
            // Check authorization
            if ($user->role !== 'admin' && $assignment->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this assignment'
                ], 403);
            }
            
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'due_date' => 'sometimes|date',
                'due_time' => 'nullable|date_format:H:i',
                'total_points' => 'sometimes|integer|min:1|max:1000',
                'status' => 'sometimes|in:active,closed,archived',
                'attachment' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $updateData = $request->only(['title', 'description', 'due_date', 'due_time', 'total_points', 'status']);
            
            if ($request->hasFile('attachment')) {
                // Delete old attachment
                if ($assignment->attachment) {
                    Storage::disk('public')->delete($assignment->attachment);
                }
                $path = $request->file('attachment')->store('assignments', 'public');
                $updateData['attachment'] = $path;
            }
            
            $assignment->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Assignment updated successfully',
                'data' => $assignment
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete assignment
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::findOrFail($id);
            
            // Check authorization
            if ($user->role !== 'admin' && $assignment->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this assignment'
                ], 403);
            }
            
            // Delete attachment if exists
            if ($assignment->attachment) {
                Storage::disk('public')->delete($assignment->attachment);
            }
            
            // Delete all submissions files
            foreach ($assignment->submissions as $submission) {
                if ($submission->file_path) {
                    Storage::disk('public')->delete($submission->file_path);
                }
            }
            
            $assignment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Assignment deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get assignments by course
    public function getByCourse(Request $request, $courseId)
    {
        try {
            $user = $request->user();
            $course = Course::findOrFail($courseId);
            
            // Check authorization
            if ($user->role === 'student') {
                $isEnrolled = $user->courses()->where('course_id', $courseId)->exists();
                if (!$isEnrolled) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You are not enrolled in this course'
                    ], 403);
                }
            }
            
            if ($user->role === 'lecturer' && $course->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view assignments for this course'
                ], 403);
            }
            
            $assignments = Assignment::where('course_id', $courseId)
                ->with('lecturer')
                ->orderBy('due_date', 'asc')
                ->get();
            
            // Add submission info for students
            if ($user->role === 'student') {
                foreach ($assignments as $assignment) {
                    $submission = Submission::where('assignment_id', $assignment->id)
                        ->where('student_id', $user->id)
                        ->first();
                    $assignment->submitted = !is_null($submission);
                    $assignment->grade = $submission ? $submission->grade : null;
                    $assignment->submission_id = $submission ? $submission->id : null;
                }
            }
            
            return response()->json([
                'success' => true,
                'data' => $assignments
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch assignments: ' . $e->getMessage()
            ], 500);
        }
    }

    // Submit assignment (Student)
    public function submit(Request $request, $id)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::findOrFail($id);
            
            // Check if user is student
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only students can submit assignments'
                ], 403);
            }
            
            // Check enrollment
            $isEnrolled = $user->courses()->where('course_id', $assignment->course_id)->exists();
            if (!$isEnrolled) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            // Check existing submission
            $existing = Submission::where('assignment_id', $id)
                ->where('student_id', $user->id)
                ->first();
                
            if ($existing && $existing->grade !== null) {
                return response()->json([
                    'success' => false,
                    'message' => 'This assignment has already been graded. Cannot resubmit.'
                ], 400);
            }
            
            // Check deadline
            if (now()->gt($assignment->due_date)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Submission deadline has passed'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'content' => 'nullable|string',
                'attachment' => 'nullable|file|max:20480|mimes:pdf,doc,docx,zip,jpg,png'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = [
                'assignment_id' => $id,
                'student_id' => $user->id,
                'content' => $request->content,
                'submitted_at' => now(),
                'status' => now()->gt($assignment->due_date) ? 'late' : 'submitted'
            ];

            if ($request->hasFile('attachment')) {
                // Delete old file if exists
                if ($existing && $existing->file_path) {
                    Storage::disk('public')->delete($existing->file_path);
                }
                $path = $request->file('attachment')->store('submissions', 'public');
                $data['file_path'] = $path;
            }
            
            if ($existing) {
                $existing->update($data);
                $submission = $existing;
            } else {
                $submission = Submission::create($data);
            }

            return response()->json([
                'success' => true,
                'message' => 'Assignment submitted successfully',
                'data' => [
                    'submission_id' => $submission->id,
                    'submitted_at' => $submission->submitted_at,
                    'file_url' => $submission->file_path ? Storage::url($submission->file_path) : null,
                    'status' => $submission->status
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    // Grade submission (Lecturer/Admin)
    public function grade(Request $request, $id)
    {
        try {
            $user = $request->user();
            $submission = Submission::findOrFail($id);
            $assignment = $submission->assignment;
            
            // Check authorization
            if ($user->role !== 'admin' && $assignment->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to grade this submission'
                ], 403);
            }
            
            // Check if already graded
            if ($submission->grade !== null) {
                return response()->json([
                    'success' => false,
                    'message' => 'This submission has already been graded'
                ], 400);
            }

            $validator = Validator::make($request->all(), [
                'grade' => 'required|integer|min:0|max:' . $assignment->total_points,
                'feedback' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $percentage = round(($request->grade / $assignment->total_points) * 100, 1);

            $submission->update([
                'grade' => $request->grade,
                'feedback' => $request->feedback,
                'status' => 'graded'
            ]);
            
            // Update enrollment grade average
            $this->updateStudentGradeAverage($submission->student_id, $assignment->course_id);

            return response()->json([
                'success' => true,
                'message' => 'Submission graded successfully',
                'data' => [
                    'submission_id' => $submission->id,
                    'grade' => $request->grade,
                    'percentage' => $percentage,
                    'feedback' => $request->feedback
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to grade submission: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get submissions for assignment (Lecturer/Admin)
    public function getSubmissions(Request $request, $id)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::findOrFail($id);
            
            // Check authorization
            if ($user->role !== 'admin' && $assignment->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view submissions for this assignment'
                ], 403);
            }
            
            $submissions = Submission::where('assignment_id', $id)
                ->with('student')
                ->orderBy('submitted_at', 'desc')
                ->get();
                
            foreach ($submissions as $submission) {
                $submission->percentage = $assignment->total_points > 0 
                    ? round(($submission->grade / $assignment->total_points) * 100, 1) 
                    : 0;
                $submission->file_url = $submission->file_path ? Storage::url($submission->file_path) : null;
            }

            $stats = [
                'total' => $submissions->count(),
                'graded' => $submissions->whereNotNull('grade')->count(),
                'pending' => $submissions->whereNull('grade')->count(),
                'late' => $submissions->where('status', 'late')->count(),
                'average_grade' => round($submissions->whereNotNull('grade')->avg('grade') ?? 0, 2),
                'average_percentage' => round($submissions->whereNotNull('grade')->avg(function($s) use ($assignment) {
                    return ($s->grade / $assignment->total_points) * 100;
                }) ?? 0, 1)
            ];

            return response()->json([
                'success' => true,
                'data' => $submissions,
                'stats' => $stats
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch submissions: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get submissions for lecturer (all courses)
    public function getLecturerSubmissions(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'lecturer' && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Lecturer or Admin only'
                ], 403);
            }
            
            if ($user->role === 'lecturer') {
                $assignmentIds = Assignment::where('lecturer_id', $user->id)->pluck('id');
            } else {
                $assignmentIds = Assignment::pluck('id');
            }
            
            $submissions = Submission::whereIn('assignment_id', $assignmentIds)
                ->with(['assignment', 'student'])
                ->orderBy('created_at', 'desc')
                ->get();
                
            foreach ($submissions as $submission) {
                $submission->file_url = $submission->file_path ? Storage::url($submission->file_path) : null;
            }

            return response()->json([
                'success' => true,
                'data' => $submissions,
                'count' => $submissions->count()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch submissions: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get student's submission for an assignment
    public function mySubmission(Request $request, $id)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::findOrFail($id);
            
            // Check if student is enrolled
            $isEnrolled = $user->courses()->where('course_id', $assignment->course_id)->exists();
            if (!$isEnrolled && $user->role === 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            $submission = Submission::where('assignment_id', $id)
                ->where('student_id', $user->id)
                ->first();
                
            if ($submission) {
                $submission->file_url = $submission->file_path ? Storage::url($submission->file_path) : null;
                $submission->percentage = $assignment->total_points > 0 && $submission->grade
                    ? round(($submission->grade / $assignment->total_points) * 100, 1)
                    : 0;
            }

            return response()->json([
                'success' => true,
                'data' => $submission
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch submission: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get statistics for lecturer dashboard
    public function getStatistics(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'lecturer' && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            if ($user->role === 'lecturer') {
                $assignments = Assignment::where('lecturer_id', $user->id)->get();
            } else {
                $assignments = Assignment::all();
            }
            
            $stats = [
                'total_assignments' => $assignments->count(),
                'total_submissions' => 0,
                'graded_submissions' => 0,
                'pending_submissions' => 0,
                'average_grade' => 0,
                'submission_rate' => 0
            ];
            
            $allGrades = [];
            $totalExpectedSubmissions = 0;
            
            foreach ($assignments as $assignment) {
                $submissionCount = $assignment->submissions()->count();
                $gradedCount = $assignment->submissions()->whereNotNull('grade')->count();
                $studentCount = $assignment->course->students()->count();
                
                $stats['total_submissions'] += $submissionCount;
                $stats['graded_submissions'] += $gradedCount;
                $stats['pending_submissions'] += ($submissionCount - $gradedCount);
                $totalExpectedSubmissions += $studentCount;
                
                foreach ($assignment->submissions()->whereNotNull('grade')->get() as $submission) {
                    $percentage = ($submission->grade / $assignment->total_points) * 100;
                    $allGrades[] = $percentage;
                }
            }
            
            if (count($allGrades) > 0) {
                $stats['average_grade'] = round(array_sum($allGrades) / count($allGrades), 1);
            }
            
            if ($totalExpectedSubmissions > 0) {
                $stats['submission_rate'] = round(($stats['total_submissions'] / $totalExpectedSubmissions) * 100, 1);
            }

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Download submission file
    public function downloadSubmission(Request $request, $id)
    {
        try {
            $user = $request->user();
            $submission = Submission::findOrFail($id);
            $assignment = $submission->assignment;
            
            // Check authorization
            $canDownload = false;
            
            if ($user->id === $submission->student_id) {
                $canDownload = true;
            } elseif ($user->role === 'lecturer' && $assignment->lecturer_id === $user->id) {
                $canDownload = true;
            } elseif ($user->role === 'admin') {
                $canDownload = true;
            }
            
            if (!$canDownload) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to download this file'
                ], 403);
            }
            
            if (!$submission->file_path || !Storage::disk('public')->exists($submission->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }
            
            return Storage::disk('public')->download($submission->file_path);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download file: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // Helper method to update student's average grade for a course
    private function updateStudentGradeAverage($studentId, $courseId)
    {
        $submissions = Submission::whereHas('assignment', function($q) use ($courseId) {
            $q->where('course_id', $courseId);
        })->where('student_id', $studentId)->whereNotNull('grade')->get();
        
        if ($submissions->count() > 0) {
            $totalPoints = 0;
            $totalEarned = 0;
            
            foreach ($submissions as $submission) {
                $totalPoints += $submission->assignment->total_points;
                $totalEarned += $submission->grade;
            }
            
            $average = $totalPoints > 0 ? round(($totalEarned / $totalPoints) * 100, 1) : 0;
            
            \DB::table('enrollments')
                ->where('user_id', $studentId)
                ->where('course_id', $courseId)
                ->update(['grade' => $average]);
        }
    }
}