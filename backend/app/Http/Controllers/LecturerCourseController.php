<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;  // ADD THIS LINE
use App\Models\User;

class LecturerCourseController extends Controller
{
    /**
     * Get all courses for the authenticated lecturer
     */
    public function index()
    {
        try {
            $user = Auth::user();
            
            // If you have a Course model with relationship
            // $courses = Course::where('lecturer_id', $user->id)->get();
            
            // For now, return dummy data
            $courses = [
                [
                    'id' => 1,
                    'name' => 'Introduction to Computer Science',
                    'code' => 'CS101',
                    'description' => 'Basic concepts of computer science including algorithms, data structures, and programming fundamentals.',
                    'credits' => 3,
                    'lecturer_id' => $user->id,
                    'lecturer_name' => $user->name,
                    'department' => 'Computer Science',
                    'status' => 'active',
                    'semester' => 'Fall 2026',
                    'students_count' => 25,
                    'schedule' => 'Monday & Wednesday, 10:00 AM - 11:30 AM',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString(),
                ],
                [
                    'id' => 2,
                    'name' => 'Data Structures and Algorithms',
                    'code' => 'CS201',
                    'description' => 'Advanced data structures and algorithm analysis techniques.',
                    'credits' => 4,
                    'lecturer_id' => $user->id,
                    'lecturer_name' => $user->name,
                    'department' => 'Computer Science',
                    'status' => 'active',
                    'semester' => 'Fall 2026',
                    'students_count' => 20,
                    'schedule' => 'Tuesday & Thursday, 2:00 PM - 3:30 PM',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString(),
                ],
                [
                    'id' => 3,
                    'name' => 'Web Development with React',
                    'code' => 'CS301',
                    'description' => 'Building modern web applications using React, Redux, and modern JavaScript.',
                    'credits' => 3,
                    'lecturer_id' => $user->id,
                    'lecturer_name' => $user->name,
                    'department' => 'Computer Science',
                    'status' => 'active',
                    'semester' => 'Fall 2026',
                    'students_count' => 18,
                    'schedule' => 'Monday & Wednesday, 3:30 PM - 5:00 PM',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString(),
                ],
                [
                    'id' => 4,
                    'name' => 'Database Systems',
                    'code' => 'CS202',
                    'description' => 'Database design, SQL, and management systems.',
                    'credits' => 3,
                    'lecturer_id' => $user->id,
                    'lecturer_name' => $user->name,
                    'department' => 'Computer Science',
                    'status' => 'active',
                    'semester' => 'Fall 2026',
                    'students_count' => 22,
                    'schedule' => 'Tuesday & Thursday, 11:00 AM - 12:30 PM',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString(),
                ],
            ];
            
            return response()->json([
                'success' => true,
                'data' => $courses,
                'message' => 'Courses fetched successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error fetching lecturer courses: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific course
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            
            $course = [
                'id' => (int)$id,
                'name' => 'Introduction to Computer Science',
                'code' => 'CS101',
                'description' => 'Basic concepts of computer science.',
                'credits' => 3,
                'lecturer_id' => $user->id,
                'lecturer_name' => $user->name,
                'department' => 'Computer Science',
                'status' => 'active',
                'semester' => 'Fall 2026',
                'students_count' => 25,
                'created_at' => now()->toISOString(),
                'updated_at' => now()->toISOString(),
            ];
            
            return response()->json([
                'success' => true,
                'data' => $course,
                'message' => 'Course fetched successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get students for a course
     */
    public function getStudents(Request $request)
    {
        try {
            $students = [
                [
                    'id' => 1,
                    'name' => 'John Doe',
                    'email' => 'john@ucc.ac.tz',
                    'registration_number' => '2024-001',
                    'program' => 'BSc Computer Science',
                    'year' => 2,
                ],
                [
                    'id' => 2,
                    'name' => 'Jane Smith',
                    'email' => 'jane@ucc.ac.tz',
                    'registration_number' => '2024-002',
                    'program' => 'BSc Computer Science',
                    'year' => 2,
                ],
                [
                    'id' => 3,
                    'name' => 'Michael Brown',
                    'email' => 'michael@ucc.ac.tz',
                    'registration_number' => '2024-003',
                    'program' => 'BSc Information Technology',
                    'year' => 2,
                ],
            ];
            
            return response()->json([
                'success' => true,
                'data' => $students,
                'message' => 'Students fetched successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get assignments for a course
     */
    public function getAssignments(Request $request)
    {
        try {
            $assignments = [
                [
                    'id' => 1,
                    'title' => 'Assignment 1: Programming Basics',
                    'description' => 'Write a program to implement basic algorithms.',
                    'due_date' => '2026-10-15 23:59:59',
                    'max_score' => 100,
                    'submissions_count' => 15,
                ],
                [
                    'id' => 2,
                    'title' => 'Assignment 2: Data Structures',
                    'description' => 'Implement and analyze data structures.',
                    'due_date' => '2026-10-30 23:59:59',
                    'max_score' => 100,
                    'submissions_count' => 12,
                ],
            ];
            
            return response()->json([
                'success' => true,
                'data' => $assignments,
                'message' => 'Assignments fetched successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch assignments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new course
     */
    public function store(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50',
                'description' => 'nullable|string',
                'credits' => 'required|integer|min:1|max:6',
                'department' => 'required|string|max:100',
                'semester' => 'required|string|max:50',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Course creation logic would go here
            // $course = Course::create($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Course created successfully',
                'data' => $request->all()
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a course
     */
    public function update(Request $request, $id)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'code' => 'sometimes|string|max:50',
                'description' => 'nullable|string',
                'credits' => 'sometimes|integer|min:1|max:6',
                'status' => 'sometimes|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Course update logic would go here
            // $course = Course::find($id);
            // $course->update($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Course updated successfully',
                'data' => $request->all()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a course
     */
    public function destroy($id)
    {
        try {
            // Course deletion logic would go here
            // $course = Course::find($id);
            // $course->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete course',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}