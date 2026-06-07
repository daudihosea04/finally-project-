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
        $assignments = Assignment::with(['course', 'creator'])->paginate(20);
        return response()->json($assignments);
    }

    // Get single assignment
    public function show($id)
    {
        $assignment = Assignment::with(['course', 'creator', 'submissions'])->findOrFail($id);
        return response()->json($assignment);
    }

    // Create assignment (Lecturer only)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'course_id' => 'required|exists:courses,id',
            'due_date' => 'required|date',
            'total_points' => 'required|integer|min:1',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except('attachment');
        $data['created_by'] = $request->user()->id;

        if ($request->hasFile('attachment')) {
            $path = $request->file('attachment')->store('assignments', 'public');
            $data['attachment'] = $path;
        }

        $assignment = Assignment::create($data);

        return response()->json([
            'message' => 'Assignment created successfully',
            'assignment' => $assignment
        ], 201);
    }

    // Update assignment
    public function update(Request $request, $id)
    {
        $assignment = Assignment::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'due_date' => 'sometimes|date',
            'total_points' => 'sometimes|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $assignment->update($request->only(['title', 'description', 'due_date', 'due_time', 'total_points', 'status']));

        return response()->json([
            'message' => 'Assignment updated successfully',
            'assignment' => $assignment
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

        return response()->json(['message' => 'Assignment deleted successfully']);
    }

    // Get assignments by course
    public function getByCourse($id)
    {
        $assignments = Assignment::where('course_id', $id)->paginate(20);
        return response()->json($assignments);
    }
}