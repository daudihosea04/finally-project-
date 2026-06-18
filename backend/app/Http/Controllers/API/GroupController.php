<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GroupController extends Controller
{
    /**
     * Get groups for lecturer - FIXED
     * GET /api/lecturer/groups
     */
    public function lecturerGroups(Request $request)
    {
        try {
            $lecturerId = Auth::id();
            
            Log::info('Fetching groups for lecturer:', ['lecturer_id' => $lecturerId]);
            
            // Get groups where user is creator OR groups for courses they teach
            $groups = Group::with(['creator', 'course', 'members.user'])
                ->where(function($query) use ($lecturerId) {
                    $query->where('created_by', $lecturerId)
                          ->orWhereHas('course', function($q) use ($lecturerId) {
                              $q->where('lecturer_id', $lecturerId);
                          });
                })
                ->orderBy('created_at', 'desc')
                ->get();
            
            // Format the response
            $formattedGroups = $groups->map(function($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'code' => $group->code ?? $group->group_code,
                    'course_id' => $group->course_id,
                    'course_name' => $group->course ? $group->course->title : null,
                    'course_code' => $group->course ? $group->course->code : null,
                    'members_count' => $group->members ? $group->members->count() : 0,
                    'max_members' => $group->max_members ?? 50,
                    'created_by' => $group->created_by,
                    'creator_name' => $group->creator ? $group->creator->name : null,
                    'status' => $group->status ?? 'active',
                    'created_at' => $group->created_at ? $group->created_at->toISOString() : null,
                    'updated_at' => $group->updated_at ? $group->updated_at->toISOString() : null,
                    'members' => $group->members ? $group->members->map(function($member) {
                        return [
                            'id' => $member->user_id,
                            'name' => $member->user ? $member->user->name : null,
                            'email' => $member->user ? $member->user->email : null,
                            'role' => $member->role ?? 'member',
                            'joined_at' => $member->joined_at ? $member->joined_at->toISOString() : null
                        ];
                    }) : []
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedGroups,
                'count' => $formattedGroups->count()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Lecturer Groups Error:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch groups',
                'message' => $e->getMessage(),
                'debug' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
        }
    }

    /**
     * Get groups for student
     * GET /api/student/groups
     */
    public function studentGroups(Request $request)
    {
        try {
            $studentId = Auth::id();
            
            $groups = Group::whereHas('members', function($q) use ($studentId) {
                $q->where('user_id', $studentId);
            })->with(['creator', 'course', 'members.user'])
              ->orderBy('created_at', 'desc')
              ->get();
            
            $formattedGroups = $groups->map(function($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'code' => $group->code ?? $group->group_code,
                    'course_id' => $group->course_id,
                    'course_name' => $group->course ? $group->course->title : null,
                    'members_count' => $group->members ? $group->members->count() : 0,
                    'max_members' => $group->max_members ?? 50,
                    'created_by' => $group->created_by,
                    'creator_name' => $group->creator ? $group->creator->name : null,
                    'status' => $group->status ?? 'active',
                    'created_at' => $group->created_at ? $group->created_at->toISOString() : null,
                    'is_member' => true
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedGroups
            ]);
            
        } catch (\Exception $e) {
            Log::error('Student Groups Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'data' => []
            ], 500);
        }
    }

    /**
     * Get all groups (Admin)
     */
    public function index(Request $request)
    {
        try {
            $groups = Group::with(['creator', 'course', 'members.user'])
                ->withCount('members')
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $groups
            ]);
            
        } catch (\Exception $e) {
            Log::error('All Groups Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch groups'
            ], 500);
        }
    }

    /**
     * Get single group details
     */
    public function show($id)
    {
        try {
            $group = Group::with(['creator', 'course', 'members.user'])
                ->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $group
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Group not found'
            ], 404);
        }
    }

    /**
     * Create a new group - FIXED
     * POST /api/lecturer/groups
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'course_id' => 'required|exists:courses,id',
                'max_members' => 'nullable|integer|min:1|max:200'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = Auth::user();
            $course = Course::find($request->course_id);
            
            // Check if user is lecturer of this course or admin
            if (!$course || ($course->lecturer_id !== $user->id && $user->role !== 'admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to create groups for this course'
                ], 403);
            }
            
            // Generate unique group code
            do {
                $code = strtoupper(Str::random(8));
            } while (Group::where('code', $code)->orWhere('group_code', $code)->exists());
            
            // Create group
            $group = Group::create([
                'name' => $request->name,
                'description' => $request->description,
                'course_id' => $request->course_id,
                'created_by' => $user->id,
                'code' => $code,
                'max_members' => $request->max_members ?? 50,
                'status' => 'active'
            ]);
            
            // Add creator as admin - try both table names
            try {
                // Try group_users table
                DB::table('group_users')->insert([
                    'group_id' => $group->id,
                    'user_id' => $user->id,
                    'role' => 'admin',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            } catch (\Exception $e) {
                // Try group_members table
                DB::table('group_members')->insert([
                    'group_id' => $group->id,
                    'user_id' => $user->id,
                    'role' => 'admin',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Group created successfully',
                'data' => $group->load(['creator', 'course'])
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Create Group Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update group
     */
    public function update(Request $request, $id)
    {
        try {
            $group = Group::findOrFail($id);
            $user = Auth::user();
            
            // Check permission
            if ($group->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to update this group'
                ], 403);
            }
            
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'max_members' => 'nullable|integer|min:1|max:200',
                'status' => 'sometimes|in:active,inactive'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $group->update($request->only(['name', 'description', 'max_members', 'status']));
            
            return response()->json([
                'success' => true,
                'message' => 'Group updated successfully',
                'data' => $group->load(['creator', 'course'])
            ]);
            
        } catch (\Exception $e) {
            Log::error('Update Group Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete group
     */
    public function destroy($id)
    {
        try {
            $group = Group::findOrFail($id);
            $user = Auth::user();
            
            if ($group->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to delete this group'
                ], 403);
            }
            
            // Delete all members first
            DB::table('group_users')->where('group_id', $id)->delete();
            DB::table('group_members')->where('group_id', $id)->delete();
            
            $group->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Group deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Delete Group Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add member to group
     */
    public function addMember(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $group = Group::findOrFail($id);
            $user = Auth::user();
            
            // Check permission
            if ($group->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to add members'
                ], 403);
            }
            
            // Check if already member
            $exists = DB::table('group_users')
                ->where('group_id', $id)
                ->where('user_id', $request->user_id)
                ->exists();
                
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is already a member of this group'
                ], 400);
            }
            
            // Check member limit
            $memberCount = DB::table('group_users')
                ->where('group_id', $id)
                ->count();
                
            if ($memberCount >= ($group->max_members ?? 50)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group has reached maximum members'
                ], 400);
            }
            
            // Add member
            DB::table('group_users')->insert([
                'group_id' => $id,
                'user_id' => $request->user_id,
                'role' => 'member',
                'joined_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Member added successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Add Member Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to add member: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove member from group
     */
    public function removeMember($id, $userId)
    {
        try {
            $group = Group::findOrFail($id);
            $user = Auth::user();
            
            if ($group->created_by !== $user->id && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to remove members'
                ], 403);
            }
            
            // Can't remove creator
            if ($userId == $group->created_by) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot remove the group creator'
                ], 400);
            }
            
            DB::table('group_users')
                ->where('group_id', $id)
                ->where('user_id', $userId)
                ->delete();
                
            DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $userId)
                ->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Member removed successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Remove Member Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove member: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Join group (public)
     */
    public function join(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $group = Group::findOrFail($id);
            
            if ($group->status === 'inactive') {
                return response()->json([
                    'success' => false,
                    'message' => 'This group is not active'
                ], 400);
            }
            
            // Check if already member
            $exists = DB::table('group_users')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->exists();
                
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already a member of this group'
                ], 400);
            }
            
            // Check member limit
            $memberCount = DB::table('group_users')
                ->where('group_id', $id)
                ->count();
                
            if ($memberCount >= ($group->max_members ?? 50)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group has reached maximum members'
                ], 400);
            }
            
            DB::table('group_users')->insert([
                'group_id' => $id,
                'user_id' => $user->id,
                'role' => 'member',
                'joined_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully joined the group'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Join Group Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to join group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Leave group
     */
    public function leave($id)
    {
        try {
            $user = Auth::user();
            $group = Group::findOrFail($id);
            
            // Can't leave if you're the creator
            if ($group->created_by == $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group creator cannot leave the group'
                ], 400);
            }
            
            $deleted = DB::table('group_users')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->delete();
                
            if (!$deleted) {
                DB::table('group_members')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->delete();
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully left the group'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Leave Group Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to leave group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get group by code (for invite)
     */
    public function getGroupByCode($code)
    {
        try {
            $group = Group::where('code', $code)
                ->orWhere('group_code', $code)
                ->with(['creator', 'course'])
                ->first();
            
            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid group code'
                ], 404);
            }
            
            $memberCount = DB::table('group_users')
                ->where('group_id', $group->id)
                ->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'course' => $group->course ? $group->course->title : null,
                    'members_count' => $memberCount,
                    'max_members' => $group->max_members ?? 50,
                    'code' => $group->code ?? $group->group_code,
                    'status' => $group->status ?? 'active'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Get Group By Code Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch group'
            ], 500);
        }
    }

    /**
     * Join group by code
     */
    public function joinByCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'code' => 'required|string'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = Auth::user();
            $group = Group::where('code', $request->code)
                ->orWhere('group_code', $request->code)
                ->first();
            
            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid group code'
                ], 404);
            }
            
            if ($group->status === 'inactive') {
                return response()->json([
                    'success' => false,
                    'message' => 'This group is not active'
                ], 400);
            }
            
            // Check if already member
            $exists = DB::table('group_users')
                ->where('group_id', $group->id)
                ->where('user_id', $user->id)
                ->exists();
                
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already a member of this group'
                ], 400);
            }
            
            DB::table('group_users')->insert([
                'group_id' => $group->id,
                'user_id' => $user->id,
                'role' => 'member',
                'joined_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully joined the group',
                'data' => $group
            ]);
            
        } catch (\Exception $e) {
            Log::error('Join By Code Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to join group: ' . $e->getMessage()
            ], 500);
        }
    }
}