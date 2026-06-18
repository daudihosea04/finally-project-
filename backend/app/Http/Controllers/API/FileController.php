<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class FileController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Upload file
    public function upload(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:20480', // 20MB max
                'type' => 'required|string|in:assignment,submission,profile,general',
                'related_id' => 'nullable|integer'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $mimeType = $file->getMimeType();
            
            // Generate unique filename
            $fileName = Str::uuid() . '_' . time() . '_' . $originalName;
            $path = $file->storeAs('uploads/' . $request->type, $fileName, 'public');
            
            // Create file record
            $fileRecord = File::create([
                'user_id' => $user->id,
                'file_name' => $originalName,
                'file_path' => $path,
                'file_size' => $fileSize,
                'mime_type' => $mimeType,
                'type' => $request->type,
                'related_id' => $request->related_id,
                'download_count' => 0
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'data' => [
                    'id' => $fileRecord->id,
                    'file_name' => $originalName,
                    'file_url' => Storage::url($path),
                    'file_size' => $this->formatBytes($fileSize),
                    'uploaded_at' => now()
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    // Download file
    public function download(Request $request, $fileId)
    {
        try {
            $user = $request->user();
            $file = File::findOrFail($fileId);
            
            // Check authorization
            $canDownload = false;
            
            if ($file->user_id === $user->id) {
                $canDownload = true;
            } elseif ($user->isLecturer() && $file->type === 'submission') {
                // Lecturer can download student submissions for their courses
                $submission = Submission::find($file->related_id);
                if ($submission) {
                    $course = $submission->assignment->course;
                    if ($course->lecturer_id === $user->id) {
                        $canDownload = true;
                    }
                }
            } elseif ($user->isAdmin()) {
                $canDownload = true;
            } elseif ($user->isStudent() && $file->type === 'assignment') {
                // Student can download assignment files
                $assignment = Assignment::find($file->related_id);
                if ($assignment && $assignment->course->isEnrolled($user->id)) {
                    $canDownload = true;
                }
            }
            
            if (!$canDownload) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to download this file'
                ], 403);
            }
            
            // Increment download count
            $file->increment('download_count');
            
            if (!Storage::disk('public')->exists($file->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }
            
            return Storage::disk('public')->download($file->file_path, $file->file_name);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Download failed: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete file
    public function delete(Request $request, $fileId)
    {
        try {
            $user = $request->user();
            $file = File::findOrFail($fileId);
            
            // Check authorization
            if ($file->user_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this file'
                ], 403);
            }
            
            // Delete physical file
            if (Storage::disk('public')->exists($file->file_path)) {
                Storage::disk('public')->delete($file->file_path);
            }
            
            // Delete record
            $file->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get user's files
    public function getMyFiles(Request $request)
    {
        try {
            $user = $request->user();
            $type = $request->get('type');
            
            $query = File::where('user_id', $user->id);
            
            if ($type) {
                $query->where('type', $type);
            }
            
            $files = $query->orderBy('created_at', 'desc')->paginate(20);
            
            $files->getCollection()->transform(function($file) {
                return [
                    'id' => $file->id,
                    'file_name' => $file->file_name,
                    'file_size' => $this->formatBytes($file->file_size),
                    'type' => $file->type,
                    'download_url' => Storage::url($file->file_path),
                    'download_count' => $file->download_count,
                    'uploaded_at' => $file->created_at
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $files
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get files: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper method to format bytes
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}