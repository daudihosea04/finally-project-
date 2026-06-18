<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AssignmentController extends Controller
{
    /**
     * Get assignments for lecturer
     */
    public function lecturerAssignments()
    {
        try {
            return response()->json([
                [
                    'id' => 1,
                    'title' => 'Assignment 1: Web Development',
                    'description' => 'Build a simple React application with API integration',
                    'course_id' => 1,
                    'course_name' => 'Advanced Web Development',
                    'due_date' => '2026-10-15 23:59:59',
                    'max_score' => 100,
                    'submissions_count' => 15,
                    'status' => 'active',
                    'created_at' => now()->toISOString(),
                ],
                [
                    'id' => 2,
                    'title' => 'Assignment 2: Database Design',
                    'description' => 'Design a database schema for a library management system',
                    'course_id' => 2,
                    'course_name' => 'Database Systems',
                    'due_date' => '2026-10-30 23:59:59',
                    'max_score' => 100,
                    'submissions_count' => 12,
                    'status' => 'active',
                    'created_at' => now()->toISOString(),
                ],
                [
                    'id' => 3,
                    'title' => 'Assignment 3: Data Structures Implementation',
                    'description' => 'Implement and analyze various data structures',
                    'course_id' => 3,
                    'course_name' => 'Data Structures and Algorithms',
                    'due_date' => '2026-11-15 23:59:59',
                    'max_score' => 100,
                    'submissions_count' => 8,
                    'status' => 'pending',
                    'created_at' => now()->toISOString(),
                ],
                [
                    'id' => 4,
                    'title' => 'Assignment 4: Mobile App Project',
                    'description' => 'Build a complete mobile application using React Native',
                    'course_id' => 4,
                    'course_name' => 'Mobile App Development',
                    'due_date' => '2026-12-01 23:59:59',
                    'max_score' => 100,
                    'submissions_count' => 5,
                    'status' => 'pending',
                    'created_at' => now()->toISOString(),
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error('lecturerAssignments error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    /**
     * Get assignments for student
     */
    public function studentAssignments()
    {
        try {
            return response()->json([
                [
                    'id' => 1,
                    'title' => 'Assignment 1',
                    'description' => 'Complete the first assignment',
                    'due_date' => '2026-10-15 23:59:59',
                    'max_score' => 100,
                    'status' => 'pending',
                    'submitted' => false,
                ],
                [
                    'id' => 2,
                    'title' => 'Assignment 2',
                    'description' => 'Complete the second assignment',
                    'due_date' => '2026-10-30 23:59:59',
                    'max_score' => 100,
                    'status' => 'pending',
                    'submitted' => false,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('studentAssignments error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    /**
     * Get single assignment
     */
    public function show($id)
    {
        try {
            return response()->json([
                'id' => (int)$id,
                'title' => 'Assignment 1: Web Development',
                'description' => 'Build a simple React application with API integration',
                'course_id' => 1,
                'course_name' => 'Advanced Web Development',
                'due_date' => '2026-10-15 23:59:59',
                'max_score' => 100,
                'submissions_count' => 15,
                'status' => 'active',
                'instructions' => 'Create a React application that consumes a REST API',
                'resources' => ['React Documentation', 'API Documentation'],
                'created_at' => now()->toISOString(),
            ]);
        } catch (\Exception $e) {
            Log::error('show assignment error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching assignment'], 500);
        }
    }

    /**
     * Create assignment
     */
    public function store(Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Assignment created successfully',
                'data' => $request->all()
            ], 201);
        } catch (\Exception $e) {
            Log::error('store assignment error: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating assignment: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update assignment
     */
    public function update(Request $request, $id)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Assignment updated successfully',
                'data' => $request->all()
            ]);
        } catch (\Exception $e) {
            Log::error('update assignment error: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating assignment: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete assignment
     */
    public function destroy($id)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Assignment deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('destroy assignment error: ' . $e->getMessage());
            return response()->json(['message' => 'Error deleting assignment: ' . $e->getMessage()], 500);
        }
    }
}