<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Message;
use App\Models\Assignment;
use App\Models\Announcement;
use App\Models\Group;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class SearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Global search across all content types
     */
    public function globalSearch(Request $request)
    {
        try {
            $query = $request->input('q');
            $type = $request->input('type', 'all');
            $limit = $request->input('limit', 20);
            
            if (empty($query) || strlen($query) < 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Search query must be at least 2 characters'
                ], 422);
            }

            $results = [];
            $user = auth()->user();

            // Search Users
            if ($type === 'all' || $type === 'users') {
                $results['users'] = User::where('name', 'LIKE', "%{$query}%")
                    ->orWhere('email', 'LIKE', "%{$query}%")
                    ->limit($limit)
                    ->get()
                    ->map(fn($u) => [
                        'id' => $u->id,
                        'name' => $u->name,
                        'email' => $u->email,
                        'role' => $u->role,
                        'type' => 'user'
                    ]);
            }

            // Search Messages
            if ($type === 'all' || $type === 'messages') {
                $results['messages'] = Message::where('message', 'LIKE', "%{$query}%")
                    ->where(function($q) use ($user) {
                        $q->where('sender_id', $user->id)
                          ->orWhere('receiver_id', $user->id)
                          ->orWhere('group_id', '!=', null);
                    })
                    ->limit($limit)
                    ->get()
                    ->map(fn($m) => [
                        'id' => $m->id,
                        'message' => substr($m->message, 0, 100),
                        'sender_id' => $m->sender_id,
                        'created_at' => $m->created_at,
                        'type' => 'message'
                    ]);
            }

            // Search Assignments
            if ($type === 'all' || $type === 'assignments') {
                $results['assignments'] = Assignment::where('title', 'LIKE', "%{$query}%")
                    ->orWhere('description', 'LIKE', "%{$query}%")
                    ->limit($limit)
                    ->get()
                    ->map(fn($a) => [
                        'id' => $a->id,
                        'title' => $a->title,
                        'description' => substr($a->description, 0, 100),
                        'due_date' => $a->due_date,
                        'type' => 'assignment'
                    ]);
            }

            // Search Announcements
            if ($type === 'all' || $type === 'announcements') {
                $results['announcements'] = Announcement::where('title', 'LIKE', "%{$query}%")
                    ->orWhere('content', 'LIKE', "%{$query}%")
                    ->limit($limit)
                    ->get()
                    ->map(fn($a) => [
                        'id' => $a->id,
                        'title' => $a->title,
                        'content' => substr($a->content, 0, 100),
                        'created_at' => $a->created_at,
                        'type' => 'announcement'
                    ]);
            }

            // Search Groups
            if ($type === 'all' || $type === 'groups') {
                $results['groups'] = Group::where('name', 'LIKE', "%{$query}%")
                    ->orWhere('description', 'LIKE', "%{$query}%")
                    ->limit($limit)
                    ->get()
                    ->map(fn($g) => [
                        'id' => $g->id,
                        'name' => $g->name,
                        'description' => substr($g->description, 0, 100),
                        'type' => 'group'
                    ]);
            }

            // Search Courses
            if ($type === 'all' || $type === 'courses') {
                $results['courses'] = Course::where('title', 'LIKE', "%{$query}%")
                    ->orWhere('code', 'LIKE', "%{$query}%")
                    ->limit($limit)
                    ->get()
                    ->map(fn($c) => [
                        'id' => $c->id,
                        'title' => $c->title,
                        'code' => $c->code,
                        'type' => 'course'
                    ]);
            }

            $totalResults = 0;
            foreach ($results as $key => $value) {
                $totalResults += count($value);
            }

            Log::info('Search performed', [
                'query' => $query,
                'type' => $type,
                'results' => $totalResults
            ]);

            return response()->json([
                'success' => true,
                'data' => $results,
                'total' => $totalResults,
                'query' => $query
            ]);

        } catch (\Exception $e) {
            Log::error('Search error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Search failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search by specific type
     */
    public function searchByType(Request $request, $type)
    {
        $request->merge(['type' => $type]);
        return $this->globalSearch($request);
    }
}