<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\GroupMember;
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
     * Constructor - Apply middleware
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get groups for lecturer
     * GET /api/lecturer/groups
     */
    public function lecturerGroups(Request $request)
    {
        try {
            $lecturerId = Auth::id();
            
            Log::info('Fetching groups for lecturer:', ['lecturer_id' => $lecturerId]);

            // Using DB facade to avoid model relationship issues
            $groups = DB::table('groups')
                ->leftJoin('courses', 'groups.course_id', '=', 'courses.id')
                ->leftJoin('users as creator', 'groups.created_by', '=', 'creator.id')
                ->where(function($query) use ($lecturerId) {
                    $query->where('groups.created_by', $lecturerId)
                          ->orWhere('courses.lecturer_id', $lecturerId);
                })
                ->select(
                    'groups.*',
                    'creator.name as creator_name',
                    'courses.title as course_name',
                    'courses.code as course_code'
                )
                ->orderBy('groups.created_at', 'desc')
                ->get();

            // Get member counts from group_members table
            $memberCounts = DB::table('group_members')
                ->select('group_id', DB::raw('COUNT(*) as member_count'))
                ->groupBy('group_id')
                ->get()
                ->keyBy('group_id');

            // If no members in group_members, try group_users
            if ($memberCounts->isEmpty()) {
                $memberCounts = DB::table('group_users')
                    ->select('group_id', DB::raw('COUNT(*) as member_count'))
                    ->groupBy('group_id')
                    ->get()
                    ->keyBy('group_id');
            }

            $formattedGroups = $groups->map(function($group) use ($memberCounts) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'code' => $group->code ?? $group->group_code,
                    'course_id' => $group->course_id,
                    'course_name' => $group->course_name,
                    'course_code' => $group->course_code,
                    'created_by' => $group->created_by,
                    'creator_name' => $group->creator_name,
                    'members_count' => $memberCounts[$group->id]->member_count ?? 0,
                    'max_members' => $group->max_members ?? 50,
                    'status' => $group->status ?? 'active',
                    'type' => $group->type ?? 'study',
                    'created_at' => $group->created_at,
                    'updated_at' => $group->updated_at,
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
                'message' => 'Failed to fetch groups: ' . $e->getMessage(),
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
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

            $groups = DB::table('groups')
                ->leftJoin('courses', 'groups.course_id', '=', 'courses.id')
                ->leftJoin('users as creator', 'groups.created_by', '=', 'creator.id')
                ->whereIn('groups.id', function($query) use ($studentId) {
                    $query->select('group_id')
                        ->from('group_members')
                        ->where('user_id', $studentId);
                })
                ->orWhereIn('groups.course_id', function($query) use ($studentId) {
                    $query->select('course_id')
                        ->from('enrollments')
                        ->where('user_id', $studentId);
                })
                ->select(
                    'groups.*',
                    'creator.name as creator_name',
                    'courses.title as course_name'
                )
                ->orderBy('groups.created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $groups
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
     * GET /api/admin/groups
     */
    public function index(Request $request)
    {
        try {
            $groups = DB::table('groups')
                ->leftJoin('courses', 'groups.course_id', '=', 'courses.id')
                ->leftJoin('users as creator', 'groups.created_by', '=', 'creator.id')
                ->select('groups.*', 'creator.name as creator_name', 'courses.title as course_name')
                ->orderBy('groups.created_at', 'desc')
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
     * GET /api/groups/{id}
     */
    public function show($id)
    {
        try {
            $group = DB::table('groups')
                ->leftJoin('courses', 'groups.course_id', '=', 'courses.id')
                ->leftJoin('users as creator', 'groups.created_by', '=', 'creator.id')
                ->where('groups.id', $id)
                ->select('groups.*', 'creator.name as creator_name', 'courses.title as course_name')
                ->first();

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group not found'
                ], 404);
            }

            // Get members
            $members = DB::table('group_members')
                ->leftJoin('users', 'group_members.user_id', '=', 'users.id')
                ->where('group_members.group_id', $id)
                ->select('users.id', 'users.name', 'users.email', 'group_members.role', 'group_members.joined_at')
                ->get();

            // If no members in group_members, try group_users
            if ($members->isEmpty()) {
                $members = DB::table('group_users')
                    ->leftJoin('users', 'group_users.user_id', '=', 'users.id')
                    ->where('group_users.group_id', $id)
                    ->select('users.id', 'users.name', 'users.email', 'group_users.role', 'group_users.joined_at')
                    ->get();
            }

            $memberCount = $members->count();

            $user = Auth::user();
            $isMember = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$isMember) {
                $isMember = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->exists();
            }

            $isAdmin = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->where('role', 'admin')
                ->exists();

            if (!$isAdmin) {
                $isAdmin = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->where('role', 'admin')
                    ->exists();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'code' => $group->code ?? $group->group_code,
                    'course_id' => $group->course_id,
                    'course_name' => $group->course_name,
                    'created_by' => $group->created_by,
                    'creator_name' => $group->creator_name,
                    'members' => $members,
                    'members_count' => $memberCount,
                    'max_members' => $group->max_members ?? 50,
                    'status' => $group->status ?? 'active',
                    'is_member' => $isMember,
                    'is_admin' => $isAdmin,
                    'created_at' => $group->created_at,
                    'updated_at' => $group->updated_at,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Show Group Error:', ['message' => $e->getMessage()]);
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
            Log::info('Group creation started', $request->all());
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'course_id' => 'required|exists:courses,id',
                'max_members' => 'nullable|integer|min:1|max:200',
                'created_by' => 'required|exists:users,id'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = Auth::user();
            $course = Course::find($request->course_id);
            $isAdmin = $user->role === 'admin';
            
            if (!$course) {
                return response()->json([
                    'success' => false,
                    'message' => 'Course not found'
                ], 404);
            }
            
            // FIXED: Check if user is lecturer OR admin
            $isLecturer = ($course->lecturer_id == $user->id);
            
            // Allow if user is admin OR lecturer
            if (!$isAdmin && !$isLecturer) {
                Log::warning('Unauthorized group creation attempt', [
                    'user_id' => $user->id,
                    'course_id' => $request->course_id,
                    'user_role' => $user->role,
                    'course_lecturer_id' => $course->lecturer_id ?? 'null'
                ]);
                
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
                'created_by' => $request->created_by,
                'code' => $code,
                'max_members' => $request->max_members ?? 50,
                'type' => $request->type ?? 'study',
                'status' => 'active'
            ]);
            
            Log::info('Group created with ID: ' . $group->id);
            
            // Add creator as first member with admin role
            $memberAdded = false;
            
            // Try group_members table first
            try {
                GroupMember::create([
                    'group_id' => $group->id,
                    'user_id' => $request->created_by,
                    'role' => 'admin',
                    'joined_at' => now()
                ]);
                $memberAdded = true;
                Log::info('Member added to group_members table');
            } catch (\Exception $e) {
                Log::warning('Failed to add to group_members: ' . $e->getMessage());
            }
            
            // Try group_users table if first failed
            if (!$memberAdded) {
                try {
                    DB::table('group_users')->insert([
                        'group_id' => $group->id,
                        'user_id' => $request->created_by,
                        'role' => 'admin',
                        'joined_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    $memberAdded = true;
                    Log::info('Member added to group_users table');
                } catch (\Exception $e) {
                    Log::warning('Failed to add to group_users: ' . $e->getMessage());
                }
            }
            
            $group->load('course', 'members');
            
            return response()->json([
                'success' => true,
                'message' => 'Group created successfully',
                'group' => $group,
                'data' => $group
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Group creation error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update group
     * PUT /api/lecturer/groups/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $group = DB::table('groups')->where('id', $id)->first();

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group not found'
                ], 404);
            }

            // Check permission
            $isAdmin = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->where('role', 'admin')
                ->exists();

            if (!$isAdmin) {
                $isAdmin = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->where('role', 'admin')
                    ->exists();
            }

            $isCreator = $group->created_by == $user->id;
            $isLecturer = DB::table('courses')
                ->where('id', $group->course_id)
                ->where('lecturer_id', $user->id)
                ->exists();
            $isSuperAdmin = $user->role === 'admin';

            if (!$isAdmin && !$isCreator && !$isLecturer && !$isSuperAdmin) {
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

            $updateData = $request->only(['name', 'description', 'max_members', 'status']);
            $updateData['updated_at'] = now();

            DB::table('groups')->where('id', $id)->update($updateData);

            $updatedGroup = DB::table('groups')->where('id', $id)->first();

            return response()->json([
                'success' => true,
                'message' => 'Group updated successfully',
                'data' => $updatedGroup
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
     * DELETE /api/lecturer/groups/{id}
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            $group = DB::table('groups')->where('id', $id)->first();

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group not found'
                ], 404);
            }

            // Check permission
            $isAdmin = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->where('role', 'admin')
                ->exists();

            if (!$isAdmin) {
                $isAdmin = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->where('role', 'admin')
                    ->exists();
            }

            $isCreator = $group->created_by == $user->id;
            $isLecturer = DB::table('courses')
                ->where('id', $group->course_id)
                ->where('lecturer_id', $user->id)
                ->exists();
            $isSuperAdmin = $user->role === 'admin';

            if (!$isAdmin && !$isCreator && !$isLecturer && !$isSuperAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to delete this group'
                ], 403);
            }

            // Delete all members first
            DB::table('group_members')->where('group_id', $id)->delete();
            DB::table('group_users')->where('group_id', $id)->delete();

            // Delete the group
            DB::table('groups')->where('id', $id)->delete();

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
     * POST /api/lecturer/groups/{id}/add-member
     */
    public function addMember(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'role' => 'nullable|string|in:admin,moderator,member'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();

            // Check permission
            $isAdmin = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->where('role', 'admin')
                ->exists();

            if (!$isAdmin) {
                $isAdmin = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->where('role', 'admin')
                    ->exists();
            }

            $group = DB::table('groups')->where('id', $id)->first();
            $isLecturer = DB::table('courses')
                ->where('id', $group->course_id)
                ->where('lecturer_id', $user->id)
                ->exists();
            $isSuperAdmin = $user->role === 'admin';

            if (!$isAdmin && !$isLecturer && !$isSuperAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to add members'
                ], 403);
            }

            // Check if already member
            $exists = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $request->user_id)
                ->exists();

            if (!$exists) {
                $exists = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $request->user_id)
                    ->exists();
            }

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'User is already a member of this group'
                ], 400);
            }

            // Check member limit
            $memberCount = DB::table('group_members')->where('group_id', $id)->count();
            if ($memberCount >= ($group->max_members ?? 50)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group has reached maximum members'
                ], 400);
            }

            // Add member
            try {
                DB::table('group_members')->insert([
                    'group_id' => $id,
                    'user_id' => $request->user_id,
                    'role' => $request->role ?? 'member',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            } catch (\Exception $e) {
                DB::table('group_users')->insert([
                    'group_id' => $id,
                    'user_id' => $request->user_id,
                    'role' => $request->role ?? 'member',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

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
     * POST /api/lecturer/groups/{id}/remove-member
     */
    public function removeMember(Request $request, $id)
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

            $user = Auth::user();

            // Check permission
            $isAdmin = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->where('role', 'admin')
                ->exists();

            if (!$isAdmin) {
                $isAdmin = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->where('role', 'admin')
                    ->exists();
            }

            $group = DB::table('groups')->where('id', $id)->first();
            $isLecturer = DB::table('courses')
                ->where('id', $group->course_id)
                ->where('lecturer_id', $user->id)
                ->exists();
            $isSuperAdmin = $user->role === 'admin';

            if (!$isAdmin && !$isLecturer && !$isSuperAdmin) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have permission to remove members'
                ], 403);
            }

            // Can't remove creator
            if ($request->user_id == $group->created_by) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot remove the group creator'
                ], 400);
            }

            // Remove member
            DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $request->user_id)
                ->delete();

            DB::table('group_users')
                ->where('group_id', $id)
                ->where('user_id', $request->user_id)
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
     * POST /api/lecturer/groups/{id}/join
     */
    public function join(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $group = DB::table('groups')->where('id', $id)->first();

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group not found'
                ], 404);
            }

            if ($group->status === 'inactive') {
                return response()->json([
                    'success' => false,
                    'message' => 'This group is not active'
                ], 400);
            }

            // Check if already member
            $exists = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$exists) {
                $exists = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->exists();
            }

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already a member of this group'
                ], 400);
            }

            // Check member limit
            $memberCount = DB::table('group_members')->where('group_id', $id)->count();
            if ($memberCount >= ($group->max_members ?? 50)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group has reached maximum members'
                ], 400);
            }

            // Add member
            try {
                DB::table('group_members')->insert([
                    'group_id' => $id,
                    'user_id' => $user->id,
                    'role' => 'member',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            } catch (\Exception $e) {
                DB::table('group_users')->insert([
                    'group_id' => $id,
                    'user_id' => $user->id,
                    'role' => 'member',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

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
     * Student join group (alias for join)
     * POST /api/student/groups/{id}/join
     */
    public function studentJoin(Request $request, $id)
    {
        return $this->join($request, $id);
    }

    /**
     * Leave group
     * POST /api/student/groups/{id}/leave
     */
    public function leave($id)
    {
        try {
            $user = Auth::user();
            $group = DB::table('groups')->where('id', $id)->first();

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group not found'
                ], 404);
            }

            // Can't leave if you're the creator
            if ($group->created_by == $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group creator cannot leave the group'
                ], 400);
            }

            $deleted = DB::table('group_members')
                ->where('group_id', $id)
                ->where('user_id', $user->id)
                ->delete();

            if (!$deleted) {
                $deleted = DB::table('group_users')
                    ->where('group_id', $id)
                    ->where('user_id', $user->id)
                    ->delete();
            }

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not a member of this group'
                ], 404);
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
     * GET /api/groups/by-code/{code}
     */
    public function getGroupByCode($code)
    {
        try {
            $group = DB::table('groups')
                ->leftJoin('courses', 'groups.course_id', '=', 'courses.id')
                ->leftJoin('users as creator', 'groups.created_by', '=', 'creator.id')
                ->where('groups.code', $code)
                ->orWhere('groups.group_code', $code)
                ->select('groups.*', 'creator.name as creator_name', 'courses.title as course_name')
                ->first();

            if (!$group) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid group code'
                ], 404);
            }

            $memberCount = DB::table('group_members')->where('group_id', $group->id)->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'course_name' => $group->course_name,
                    'members_count' => $memberCount,
                    'max_members' => $group->max_members ?? 50,
                    'code' => $group->code ?? $group->group_code,
                    'status' => $group->status ?? 'active',
                    'created_by' => $group->created_by,
                    'creator_name' => $group->creator_name
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
     * POST /api/groups/join-by-code
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
            $group = DB::table('groups')
                ->where('code', $request->code)
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
            $exists = DB::table('group_members')
                ->where('group_id', $group->id)
                ->where('user_id', $user->id)
                ->exists();

            if (!$exists) {
                $exists = DB::table('group_users')
                    ->where('group_id', $group->id)
                    ->where('user_id', $user->id)
                    ->exists();
            }

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already a member of this group'
                ], 400);
            }

            // Check member limit
            $memberCount = DB::table('group_members')->where('group_id', $group->id)->count();
            if ($memberCount >= ($group->max_members ?? 50)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Group has reached maximum members'
                ], 400);
            }

            // Add member
            try {
                DB::table('group_members')->insert([
                    'group_id' => $group->id,
                    'user_id' => $user->id,
                    'role' => 'member',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            } catch (\Exception $e) {
                DB::table('group_users')->insert([
                    'group_id' => $group->id,
                    'user_id' => $user->id,
                    'role' => 'member',
                    'joined_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

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

    /**
     * Get group members
     * GET /api/chat/group/{groupId}/members
     */
    public function getGroupMembers($groupId)
    {
        try {
            $user = Auth::user();

            // Check if user is a member
            $isMember = DB::table('group_members')
                ->where('group_id', $groupId)
                ->where('user_id', $user->id)
                ->exists();

            if (!$isMember) {
                $isMember = DB::table('group_users')
                    ->where('group_id', $groupId)
                    ->where('user_id', $user->id)
                    ->exists();
            }

            if (!$isMember && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not a member of this group'
                ], 403);
            }

            $members = DB::table('group_members')
                ->leftJoin('users', 'group_members.user_id', '=', 'users.id')
                ->where('group_members.group_id', $groupId)
                ->select('users.id', 'users.name', 'users.email', 'group_members.role', 'group_members.joined_at')
                ->get();

            if ($members->isEmpty()) {
                $members = DB::table('group_users')
                    ->leftJoin('users', 'group_users.user_id', '=', 'users.id')
                    ->where('group_users.group_id', $groupId)
                    ->select('users.id', 'users.name', 'users.email', 'group_users.role', 'group_users.joined_at')
                    ->get();
            }

            return response()->json([
                'success' => true,
                'data' => $members,
                'count' => $members->count()
            ]);

        } catch (\Exception $e) {
            Log::error('Get Group Members Error:', ['message' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch members'
            ], 500);
        }
    }
}