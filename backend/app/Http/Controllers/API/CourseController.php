<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    // Get all courses
    public function index()
    {
        $courses = Course::with('lecturer')->get();
        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    // Get single course
    public function show($id)
    {
        $course = Course::with(['lecturer', 'students'])->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    // Create course (Lecturer/Admin only)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:courses',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1|max:6',
            'schedule' => 'nullable|string',
            'room' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course = Course::create([
            'code' => $request->code,
            'title' => $request->title,
            'description' => $request->description,
            'credits' => $request->credits,
            'lecturer_id' => $request->user()->id,
            'schedule' => $request->schedule,
            'room' => $request->room,
            'status' => 'active'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Course created successfully',
            'data' => $course
        ], 201);
    }

    // Update course
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|string|unique:courses,code,' . $id,
            'title' => 'sometimes|string|max:255',
            'credits' => 'sometimes|integer|min:1|max:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $course->update($request->only(['code', 'title', 'description', 'credits', 'schedule', 'room', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Course updated successfully',
            'data' => $course
        ]);
    }

    // Delete course (Admin only)
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully'
        ]);
    }

    // Get courses by lecturer
    public function getByLecturer($id)
    {
        $courses = Course::where('lecturer_id', $id)->get();
        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    // Get enrolled courses for student
    public function getEnrolledCourses($id)
    {
        $user = User::findOrFail($id);
        $courses = $user->courses()->get();
        return response()->json([
            'success' => true,
            'data' => $courses
        ]);
    }

    // Enroll student in course
    public function enroll(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $user = $request->user();

        if ($user->courses()->where('course_id', $id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Already enrolled'
            ], 400);
        }

        $user->courses()->attach($id, ['enrolled_at' => now(), 'status' => 'active']);

        return response()->json([
            'success' => true,
            'message' => 'Enrolled successfully'
        ]);
    }
}