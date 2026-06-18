<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Course;
use App\Models\CourseMaterial;

class MaterialController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get all materials for a course
    public function index($courseId)
    {
        try {
            $course = Course::findOrFail($courseId);
            
            $materials = CourseMaterial::where('course_id', $courseId)
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $materials
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch materials',
                'data' => []
            ]);
        }
    }

    // Upload material
    public function upload(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|max:51200', // 50MB max
                'title' => 'required|string|max:255',
                'course_id' => 'required|exists:courses,id'
            ]);

            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $fileType = $file->getMimeType();
            $extension = $file->getClientOriginalExtension();
            
            // Store file
            $path = $file->store('course_materials/' . $request->course_id, 'public');
            
            $material = CourseMaterial::create([
                'course_id' => $request->course_id,
                'title' => $request->title,
                'file_name' => $originalName,
                'file_path' => $path,
                'file_size' => $fileSize,
                'file_type' => $fileType,
                'extension' => $extension,
                'uploaded_by' => auth()->id()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Material uploaded successfully',
                'data' => $material
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    // Download material
    public function download($id)
    {
        try {
            $material = CourseMaterial::findOrFail($id);
            
            if (!Storage::disk('public')->exists($material->file_path)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }
            
            return Storage::disk('public')->download($material->file_path, $material->file_name);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Download failed'
            ], 500);
        }
    }

    // Delete material
    public function destroy($id)
    {
        try {
            $material = CourseMaterial::findOrFail($id);
            
            // Delete file from storage
            if (Storage::disk('public')->exists($material->file_path)) {
                Storage::disk('public')->delete($material->file_path);
            }
            
            $material->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Material deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed'
            ], 500);
        }
    }
}