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
    // Get all submissions (Admin/Lecturer only)
    public function index()
    {
        $submissions = Submission::with(['assignment', 'student'])->paginate(20);
        return response()->json($submissions);
    }

    // Get single submission
    public function show($id)
    {
        $submission = Submission::with(['assignment', 'student'])->findOrFail($id);
        return response()->json($submission);
    }

    // Submit assignment (Student only)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'assignment_id' => 'required|exists:assignments,id',
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:20480', // 20MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $assignment = Assignment::findOrFail($request->assignment_id);
        
        // Check if already submitted
        $existing = Submission::where('assignment_id', $request->assignment_id)
                              ->where('student_id', $request->user()->id)
                              ->first();
        
        if ($existing) {
            return response()->json(['message' => 'Already submitted'], 400);
        }

        $data = [
            'assignment_id' => $request->assignment_id,
            'student_id' => $request->user()->id,
            'content' => $request->content,
            'submitted_at' => now(),
            'status' => now()->gt($assignment->due_date) ? 'late' : 'submitted',
        ];

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('submissions', 'public');
            $data['file_path'] = $path;
        }

        $submission = Submission::create($data);

        return response()->json([
            'message' => 'Assignment submitted successfully',
            'submission' => $submission
        ], 201);
    }

    // Grade submission (Lecturer only)
    public function update(Request $request, $id)
    {
        $submission = Submission::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'grade' => 'required|integer|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $submission->update([
            'grade' => $request->grade,
            'feedback' => $request->feedback,
            'status' => 'graded',
        ]);

        return response()->json([
            'message' => 'Submission graded successfully',
            'submission' => $submission
        ]);
    }

    // Get submissions by student
    public function getByStudent($id)
    {
        $submissions = Submission::where('student_id', $id)
                                 ->with('assignment')
                                 ->paginate(20);
        return response()->json($submissions);
    }

    // Get submissions by assignment
    public function getByAssignment($id)
    {
        $submissions = Submission::where('assignment_id', $id)
                                 ->with('student')
                                 ->paginate(20);
        return response()->json($submissions);
    }
}