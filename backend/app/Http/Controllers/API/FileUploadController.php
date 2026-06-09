<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FileUploadController extends Controller
{
    // Upload assignment file (Lecturer)
    public function uploadAssignmentFile(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:pdf,doc,docx,zip|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $assignment = Assignment::findOrFail($id);
        
        // Delete old file if exists
        if ($assignment->attachment) {
            Storage::disk('public')->delete($assignment->attachment);
        }
        
        $path = $request->file('file')->store('assignments', 'public');
        $assignment->update(['attachment' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'path' => Storage::url($path)
        ]);
    }

    // Upload submission file (Student)
    public function uploadSubmissionFile(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:pdf,doc,docx,zip,jpg,png|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $submission = Submission::findOrFail($id);
        
        // Delete old file if exists
        if ($submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }
        
        $path = $request->file('file')->store('submissions', 'public');
        $submission->update(['file_path' => $path]);

        return response()->json([
            'success' => true,
            'message' => 'File uploaded successfully',
            'path' => Storage::url($path)
        ]);
    }

    // Download file
    public function download($type, $id)
    {
        if ($type === 'assignment') {
            $item = Assignment::findOrFail($id);
            $path = $item->attachment;
        } elseif ($type === 'submission') {
            $item = Submission::findOrFail($id);
            $path = $item->file_path;
        } else {
            return response()->json(['message' => 'Invalid type'], 400);
        }

        if (!$path || !Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($path);
    }

    // Delete file
    public function delete($type, $id)
    {
        if ($type === 'assignment') {
            $item = Assignment::findOrFail($id);
            $path = $item->attachment;
            $item->update(['attachment' => null]);
        } elseif ($type === 'submission') {
            $item = Submission::findOrFail($id);
            $path = $item->file_path;
            $item->update(['file_path' => null]);
        } else {
            return response()->json(['message' => 'Invalid type'], 400);
        }

        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        return response()->json([
            'success' => true,
            'message' => 'File deleted successfully'
        ]);
    }
}