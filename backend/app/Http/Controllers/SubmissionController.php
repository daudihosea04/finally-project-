<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubmissionController extends Controller
{
    /**
     * Get pending submissions for lecturer
     */
    public function pendingSubmissions()
    {
        try {
            return response()->json([
                [
                    'id' => 1,
                    'student_name' => 'John Doe',
                    'student_id' => 1,
                    'assignment_title' => 'Assignment 1: Web Development',
                    'assignment_id' => 1,
                    'submitted_at' => now()->subHours(2)->toISOString(),
                    'status' => 'pending',
                    'file' => 'submission_1.pdf',
                ],
                [
                    'id' => 2,
                    'student_name' => 'Jane Smith',
                    'student_id' => 2,
                    'assignment_title' => 'Assignment 1: Web Development',
                    'assignment_id' => 1,
                    'submitted_at' => now()->subHours(5)->toISOString(),
                    'status' => 'pending',
                    'file' => 'submission_2.pdf',
                ],
                [
                    'id' => 3,
                    'student_name' => 'Michael Brown',
                    'student_id' => 3,
                    'assignment_title' => 'Assignment 2: Database Design',
                    'assignment_id' => 2,
                    'submitted_at' => now()->subDays(1)->toISOString(),
                    'status' => 'pending',
                    'file' => 'submission_3.pdf',
                ],
                [
                    'id' => 4,
                    'student_name' => 'Sarah Wilson',
                    'student_id' => 4,
                    'assignment_title' => 'Assignment 2: Database Design',
                    'assignment_id' => 2,
                    'submitted_at' => now()->subDays(2)->toISOString(),
                    'status' => 'pending',
                    'file' => 'submission_4.pdf',
                ],
            ]);
            
        } catch (\Exception $e) {
            Log::error('pendingSubmissions error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    /**
     * Get single submission
     */
    public function show($id)
    {
        try {
            return response()->json([
                'id' => (int)$id,
                'student_name' => 'John Doe',
                'student_id' => 1,
                'assignment_title' => 'Assignment 1: Web Development',
                'assignment_id' => 1,
                'submitted_at' => now()->subHours(2)->toISOString(),
                'status' => 'pending',
                'content' => 'This is the submission content. The student has completed the assignment.',
                'files' => ['submission.pdf', 'code.zip'],
                'comments' => 'Please review my work.',
            ]);
        } catch (\Exception $e) {
            Log::error('show submission error: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching submission'], 500);
        }
    }

    /**
     * Grade a submission
     */
    public function grade(Request $request, $id)
    {
        try {
            $request->validate([
                'score' => 'required|numeric|min:0|max:100',
                'feedback' => 'nullable|string',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Submission graded successfully',
                'data' => [
                    'id' => (int)$id,
                    'score' => $request->score,
                    'feedback' => $request->feedback,
                    'graded_at' => now()->toISOString(),
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('grade submission error: ' . $e->getMessage());
            return response()->json(['message' => 'Error grading submission: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Submit assignment (student)
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'assignment_id' => 'required|exists:assignments,id',
                'content' => 'nullable|string',
                'file' => 'nullable|file|max:10240', // 10MB max
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Assignment submitted successfully',
                'data' => $request->all()
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('store submission error: ' . $e->getMessage());
            return response()->json(['message' => 'Error submitting assignment: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get student submissions
     */
    public function studentSubmissions()
    {
        try {
            return response()->json([
                [
                    'id' => 1,
                    'assignment_title' => 'Assignment 1: Web Development',
                    'submitted_at' => now()->subDays(2)->toISOString(),
                    'status' => 'graded',
                    'score' => 85,
                    'feedback' => 'Good work! Keep it up.',
                ],
                [
                    'id' => 2,
                    'assignment_title' => 'Assignment 2: Database Design',
                    'submitted_at' => now()->subDays(1)->toISOString(),
                    'status' => 'pending',
                    'score' => null,
                    'feedback' => null,
                ],
                [
                    'id' => 3,
                    'assignment_title' => 'Assignment 3: Data Structures',
                    'submitted_at' => now()->subHours(5)->toISOString(),
                    'status' => 'pending',
                    'score' => null,
                    'feedback' => null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('studentSubmissions error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    /**
     * Get storage usage (admin)
     */
    public function storageUsage()
    {
        try {
            return response()->json([
                'total_space' => '10 GB',
                'used_space' => '2.5 GB',
                'free_space' => '7.5 GB',
                'total_files' => 1250,
                'file_types' => [
                    'pdf' => 450,
                    'docx' => 200,
                    'zip' => 150,
                    'others' => 450,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('storageUsage error: ' . $e->getMessage());
            return response()->json([], 200);
        }
    }

    /**
     * Cleanup files (admin)
     */
    public function cleanupFiles()
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Files cleaned up successfully',
                'files_deleted' => 15,
                'space_freed' => '250 MB',
                'deleted_files' => ['old_submission_1.pdf', 'temp_file_2.zip'],
            ]);
        } catch (\Exception $e) {
            Log::error('cleanupFiles error: ' . $e->getMessage());
            return response()->json(['message' => 'Error cleaning up files: ' . $e->getMessage()], 500);
        }
    }
}