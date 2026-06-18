<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AnnouncementController extends Controller
{
    /**
     * Get all announcements
     */
    public function index(Request $request)
    {
        try {
            $courseId = $request->query('course_id');
            
            // Dummy data
            $announcements = [
                [
                    'id' => 1,
                    'title' => 'Welcome to the Course!',
                    'content' => 'Welcome to the new semester. Please review the syllabus.',
                    'course_id' => 1,
                    'created_at' => now()->subDays(2)->toISOString(),
                    'updated_at' => now()->subDays(2)->toISOString()
                ],
                [
                    'id' => 2,
                    'title' => 'Assignment 1 Released',
                    'content' => 'Assignment 1 has been released. Submit by October 15th.',
                    'course_id' => 1,
                    'created_at' => now()->subDays(1)->toISOString(),
                    'updated_at' => now()->subDays(1)->toISOString()
                ],
            ];
            
            // Filter by course_id if provided
            if ($courseId) {
                $announcements = array_filter($announcements, function($a) use ($courseId) {
                    return $a['course_id'] == $courseId;
                });
                $announcements = array_values($announcements);
            }
            
            return response()->json([
                'success' => true,
                'data' => $announcements,
                'message' => 'Announcements fetched successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch announcements'
            ], 500);
        }
    }

    /**
     * Get announcements for student
     */
    public function studentAnnouncements()
    {
        try {
            return response()->json([
                [
                    'id' => 1,
                    'title' => 'Welcome to the Course!',
                    'content' => 'Welcome to the new semester.',
                    'course_id' => 1,
                    'created_at' => now()->subDays(2)->toISOString()
                ],
                [
                    'id' => 2,
                    'title' => 'Assignment 1 Released',
                    'content' => 'Assignment 1 has been released.',
                    'course_id' => 1,
                    'created_at' => now()->subDays(1)->toISOString()
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('studentAnnouncements error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    /**
     * Get announcements for lecturer
     */
    public function lecturerAnnouncements()
    {
        try {
            return response()->json([
                [
                    'id' => 1,
                    'title' => 'Welcome to the Course!',
                    'content' => 'Welcome to the new semester.',
                    'course_id' => 1,
                    'created_at' => now()->subDays(2)->toISOString()
                ],
                [
                    'id' => 2,
                    'title' => 'Assignment 1 Released',
                    'content' => 'Assignment 1 has been released.',
                    'course_id' => 1,
                    'created_at' => now()->subDays(1)->toISOString()
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('lecturerAnnouncements error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'course_id' => 'nullable|integer',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Announcement created successfully',
                'data' => [
                    'id' => rand(100, 999),
                    'title' => $request->title,
                    'content' => $request->content,
                    'course_id' => $request->course_id,
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString()
                ]
            ], 201);
        } catch (\Exception $e) {
            \Log::error('store announcement error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create announcement: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => (int)$id,
                    'title' => 'Announcement ' . $id,
                    'content' => 'Content of announcement ' . $id,
                    'course_id' => 1,
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('show announcement error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch announcement'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Announcement updated successfully',
                'data' => [
                    'id' => (int)$id,
                    'title' => $request->title,
                    'content' => $request->content,
                    'course_id' => $request->course_id,
                    'updated_at' => now()->toISOString()
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('update announcement error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update announcement'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Announcement deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('destroy announcement error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete announcement'
            ], 500);
        }
    }
}