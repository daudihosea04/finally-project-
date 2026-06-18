<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    // Get all announcements
    public function index()
    {
        $announcements = Announcement::with('creator')->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $announcements
        ]);
    }

    // Get announcements for lecturer
    public function getLecturerAnnouncements(Request $request)
    {
        $announcements = Announcement::where('created_by', $request->user()->id)->latest()->get();
        return response()->json([
            'success' => true,
            'data' => $announcements
        ]);
    }

    // Create announcement
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => 'sometimes|string|in:high,medium,low'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $announcement = Announcement::create([
            'title' => $request->title,
            'content' => $request->content,
            'priority' => $request->priority ?? 'medium',
            'created_by' => $request->user()->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Announcement posted successfully',
            'data' => $announcement
        ], 201);
    }

    // Update announcement
    public function update(Request $request, $id)
    {
        $announcement = Announcement::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'priority' => 'sometimes|string|in:high,medium,low'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $announcement->update($request->only(['title', 'content', 'priority']));

        return response()->json([
            'success' => true,
            'message' => 'Announcement updated successfully',
            'data' => $announcement
        ]);
    }

    // Delete announcement
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Announcement deleted successfully'
        ]);
    }
}