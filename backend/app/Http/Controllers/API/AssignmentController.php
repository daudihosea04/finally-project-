<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    // Get all assignments
    public function index()
    {
        $assignments = Assignment::with(['course', 'lecturer'])->get();
        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    // Get single assignment
    public function show($id)
    {
        $assignment = Assignment::with(['course', 'lecturer', 'submissions.student'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $assignment
        ]);
    }

    // Create assignment (Lecturer/Admin)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'due_date' => 'required|date',
            'total_points' => 'required|integer|min:1|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $assignment = Assignment::create([
            'title' => $request->title,
            'description' => $request->description,
            'course_id' => $request->course_id,
            'lecturer_id' => $request->user()->id,
            'due_date' => $request->due_date,
            'total_points' => $request->total_points,
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Assignment created successfully',
            'data' => $assignment
        ], 201);
    }

    // Update assignment
    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|date',
            'total_points' => 'sometimes|integer|min:1|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $assignment->update($request->only(['title', 'description', 'due_date', 'total_points', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Assignment updated successfully',
            'data' => $assignment
        ]);
    }

    // Delete assignment
    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        
        if ($assignment->attachment) {
            Storage::disk('public')->delete($assignment->attachment);
        }
        
        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Assignment deleted successfully'
        ]);
    }

    // Get assignments by course
    public function getByCourse($courseId)
    {
        $assignments = Assignment::where('course_id', $courseId)
            ->with('lecturer')
            ->orderBy('due_date', 'asc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    // Get assignments for lecturer
    public function getByLecturer(Request $request)
    {
        $assignments = Assignment::where('lecturer_id', $request->user()->id)
            ->with('course')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    // Get assignments for student (enrolled courses)
    public function getForStudent(Request $request)
    {
        $user = $request->user();
        $courseIds = $user->courses()->pluck('course_id');
        
        $assignments = Assignment::whereIn('course_id', $courseIds)
            ->with(['course', 'lecturer'])
            ->orderBy('due_date', 'asc')
            ->get();
        
        foreach ($assignments as $assignment) {
            $submission = Submission::where('assignment_id', $assignment->id)
                ->where('student_id', $user->id)
                ->first();
            
            $assignment->submitted = !is_null($submission);
            $assignment->grade = $submission ? $submission->grade : null;
            $assignment->submission_id = $submission ? $submission->id : null;
        }
        
        return response()->json([
            'success' => true,
            'data' => $assignments
        ]);
    }

    // Submit assignment (Student)
    public function submit(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        $user = $request->user();

        if ($user->role !== 'student') {
            return response()->json([
                'success' => false,
                'message' => 'Only students can submit assignments'
            ], 403);
        }

        $existing = Submission::where('assignment_id', $id)
                              ->where('student_id', $user->id)
                              ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already submitted this assignment'
            ], 400);
        }

        if (now()->gt($assignment->due_date)) {
            return response()->json([
                'success' => false,
                'message' => 'Submission deadline has passed'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'content' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240',
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
            'status' => 'submitted'
        ];

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('submissions', 'public');
            $data['file_path'] = $path;
        }

        $submission = Submission::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Assignment submitted successfully',
            'data' => $submission
        ], 201);
    }

    // Grade submission (Lecturer/Admin)
    public function grade(Request $request, $id)
    {
        $submission = Submission::findOrFail($id);
        $user = $request->user();

        if (!in_array($user->role, ['lecturer', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'grade' => 'required|integer|min:0|max:1000',
            'feedback' => 'nullable|string'
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
            'status' => 'graded'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Submission graded successfully',
            'data' => $submission
        ]);
    }

    // Get submissions for assignment (Lecturer/Admin)
    public function getSubmissions($id)
    {
        $submissions = Submission::where('assignment_id', $id)
            ->with('student')
            ->orderBy('submitted_at', 'desc')
            ->get();

        $stats = [
            'total' => $submissions->count(),
            'graded' => $submissions->where('status', 'graded')->count(),
            'pending' => $submissions->where('status', 'submitted')->count(),
            'average_grade' => $submissions->whereNotNull('grade')->avg('grade')
        ];

        return response()->json([
            'success' => true,
            'data' => $submissions,
            'stats' => $stats
        ]);
    }

    // Get my submission for an assignment (Student)
    public function mySubmission(Request $request, $id)
    {
        $submission = Submission::where('assignment_id', $id)
            ->where('student_id', $request->user()->id)
            ->first();

        return response()->json([
            'success' => true,
            'data' => $submission
        ]);
    }

    // Get statistics for lecturer dashboard
    public function getStatistics(Request $request)
    {
        $user = $request->user();
        
        $assignments = Assignment::where('lecturer_id', $user->id)
            ->with('submissions')
            ->get();
        
        $stats = [
            'total_assignments' => $assignments->count(),
            'total_submissions' => 0,
            'graded_submissions' => 0,
            'average_grade' => 0
        ];
        
        $allGrades = [];
        
        foreach ($assignments as $assignment) {
            $stats['total_submissions'] += $assignment->submissions->count();
            $stats['graded_submissions'] += $assignment->submissions->where('status', 'graded')->count();
            
            foreach ($assignment->submissions->whereNotNull('grade') as $submission) {
                $allGrades[] = $submission->grade;
            }
        }
        
        if (count($allGrades) > 0) {
            $stats['average_grade'] = round(array_sum($allGrades) / count($allGrades), 2);
        }
        
        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }

    // Get submissions for lecturer (FIXED VERSION)
    public function getLecturerSubmissions(Request $request)
    {
        try {
            // Check if user is authenticated
            if (!$request->user()) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }
            
            // Check if user is lecturer or admin
            if ($request->user()->role !== 'lecturer' && $request->user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized - Lecturer only'
                ], 403);
            }
            
            // Get all submissions with assignments and students
            $submissions = Submission::with(['assignment', 'student'])->get();
            
            return response()->json([
                'success' => true,
                'data' => $submissions,
                'message' => 'Submissions fetched successfully',
                'count' => $submissions->count()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ], 500);
        }
    }
}