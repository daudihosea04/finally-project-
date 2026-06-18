<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get all submissions (Admin/Lecturer only)
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->role === 'lecturer') {
                $assignmentIds = Assignment::where('lecturer_id', $user->id)->pluck('id');
                $submissions = Submission::whereIn('assignment_id', $assignmentIds)
                    ->with(['assignment', 'student'])
                    ->paginate(20);
            } elseif ($user->role === 'admin') {
                $submissions = Submission::with(['assignment', 'student'])->paginate(20);
            } else {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
            }
            
            return response()->json([
                'success' => true,
                'data' => $submissions
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch submissions: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get single submission
    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            $submission = Submission::with(['assignment', 'student'])->findOrFail($id);
            
            // Check authorization
            if ($user->role === 'student' && $submission->student_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to view this submission'
                ], 403);
            }
            
            if ($user->role === 'lecturer') {
                $assignment = $submission->assignment;
                if ($assignment->lecturer_id !== $user->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Unauthorized to view this submission'
                    ], 403);
                }
            }
            
            return response()->json([
                'success' => true,
                'data' => $submission
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Submission not found: ' . $e->getMessage()
            ], 404);
        }
    }

    // Submit assignment (Student only)
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'assignment_id' => 'required|exists:assignments,id',
                'content' => 'nullable|string',
                'file' => 'nullable|file|max:20480', // 20MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();
            
            if ($user->role !== 'student') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only students can submit assignments'
                ], 403);
            }

            $assignment = Assignment::findOrFail($request->assignment_id);
            
            // Check if student is enrolled
            if (!$assignment->course->isEnrolled($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            // Check if already submitted
            $existing = Submission::where('assignment_id', $request->assignment_id)
                ->where('student_id', $user->id)
                ->first();
            
            if ($existing && $existing->grade !== null) {
                return response()->json([
                    'success' => false,
                    'message' => 'This assignment has already been graded. Cannot resubmit.'
                ], 400);
            }

            $data = [
                'assignment_id' => $request->assignment_id,
                'student_id' => $user->id,
                'content' => $request->content,
                'submitted_at' => now(),
                'status' => now()->gt($assignment->due_date) ? 'late' : 'submitted',
            ];

            if ($request->hasFile('file')) {
                if ($existing && $existing->file_path) {
                    Storage::disk('public')->delete($existing->file_path);
                }
                $path = $request->file('file')->store('submissions', 'public');
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
                    'status' => $submission->status,
                    'file_url' => $submission->file_path ? Storage::url($submission->file_path) : null
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    // Grade submission (Lecturer/Admin only)
    public function grade(Request $request, $id)
    {
        try {
            $submission = Submission::findOrFail($id);
            $user = $request->user();
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
                'feedback' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $submission->update([
                'grade' => $request->grade,
                'feedback' => $request->feedback,
                'status' => 'graded',
            ]);
            
            // Update student's course average grade
            $this->updateStudentAverageGrade($submission->student_id, $assignment->course_id);

            return response()->json([
                'success' => true,
                'message' => 'Submission graded successfully',
                'data' => $submission
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to grade submission: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get submissions by student
    public function getByStudent(Request $request, $id)
    {
        try {
            $user = $request->user();
            
            // Check authorization
            if ($user->role !== 'admin' && $user->role !== 'lecturer' && $user->id != $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $submissions = Submission::where('student_id', $id)
                ->with('assignment')
                ->orderBy('created_at', 'desc')
                ->paginate(20);
                
            return response()->json([
                'success' => true,
                'data' => $submissions
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch submissions: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get submissions by assignment
    public function getByAssignment(Request $request, $id)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::findOrFail($id);
            
            // Check authorization
            if ($user->role !== 'admin' && $assignment->lecturer_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to view these submissions'
                ], 403);
            }
            
            $submissions = Submission::where('assignment_id', $id)
                ->with('student')
                ->orderBy('submitted_at', 'desc')
                ->paginate(20);
                
            $stats = [
                'total' => Submission::where('assignment_id', $id)->count(),
                'graded' => Submission::where('assignment_id', $id)->whereNotNull('grade')->count(),
                'pending' => Submission::where('assignment_id', $id)->whereNull('grade')->count(),
                'average_grade' => round(Submission::where('assignment_id', $id)->whereNotNull('grade')->avg('grade') ?? 0, 2)
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
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            if ($user->role === 'lecturer') {
                $assignmentIds = Assignment::where('lecturer_id', $user->id)->pluck('id');
                $submissions = Submission::whereIn('assignment_id', $assignmentIds)
                    ->with(['assignment', 'student'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            } else {
                $submissions = Submission::with(['assignment', 'student'])
                    ->orderBy('created_at', 'desc')
                    ->get();
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

    // Download submission file
    public function download(Request $request, $id)
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
    private function updateStudentAverageGrade($studentId, $courseId)
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
            
            $percentage = $totalPoints > 0 ? round(($totalEarned / $totalPoints) * 100, 1) : 0;
            
            \DB::table('enrollments')
                ->where('user_id', $studentId)
                ->where('course_id', $courseId)
                ->update(['grade' => $percentage]);
        }
    }
}