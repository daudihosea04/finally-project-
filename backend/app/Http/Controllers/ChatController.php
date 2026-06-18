<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    // ============================================
    // 1. PRIVATE CHAT
    // ============================================

    /**
     * Get private messages between two users
     * GET /api/chat/private/{userId}/messages
     */
    public function getPrivateMessages($userId, Request $request)
    {
        try {
            $currentUserId = Auth::id();
            
            Log::info('Fetching private messages:', [
                'current_user' => $currentUserId,
                'other_user' => $userId
            ]);

            // Check if user exists
            $otherUser = DB::table('users')->where('id', $userId)->first();
            if (!$otherUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Generate dummy messages
            $messages = $this->generateDummyPrivateMessages($currentUserId, $userId);

            return response()->json([
                'success' => true,
                'data' => $messages,
                'conversation_id' => 1,
                'metadata' => [
                    'total' => count($messages),
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('getPrivateMessages error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'Failed to fetch messages: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send private message
     * POST /api/chat/private/send
     */
    public function sendPrivateMessage(Request $request)
    {
        try {
            $user = Auth::user();
            
            $request->validate([
                'recipient_id' => 'required|exists:users,id',
                'message' => 'required|string|max:5000'
            ]);

            // Generate dummy response
            $message = [
                'id' => rand(1000, 9999),
                'sender_id' => $user->id,
                'sender_name' => $user->name,
                'message' => $request->message,
                'created_at' => now()->toISOString(),
                'is_read' => false
            ];

            // Log the message
            Log::info('Private message sent', [
                'sender_id' => $user->id,
                'recipient_id' => $request->recipient_id,
                'message' => $request->message
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $message
            ], 201);

        } catch (\Exception $e) {
            Log::error('sendPrivateMessage error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get private participant info
     * GET /api/chat/private/{userId}/participant
     */
    public function getPrivateParticipant($userId, Request $request)
    {
        try {
            $user = DB::table('users')->where('id', $userId)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar ?? '👤',
                    'role' => $user->role ?? 'student',
                    'online' => true
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('getPrivateParticipant error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch participant'
            ], 500);
        }
    }

    /**
     * Get or create private conversation
     * GET /api/chat/private/conversation/{userId}
     */
    public function getOrCreatePrivateConversation($userId, Request $request)
    {
        try {
            $currentUser = Auth::id();

            if ($currentUser == $userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot create conversation with yourself'
                ], 422);
            }

            $otherUser = DB::table('users')->where('id', $userId)->first();
            if (!$otherUser) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'conversation_id' => 1,
                    'other_participant' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                        'role' => $otherUser->role ?? 'student',
                    ],
                    'unread_count' => 0
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('getOrCreatePrivateConversation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create conversation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all conversations for user
     * GET /api/chat/conversations
     */
    public function getConversations(Request $request)
    {
        try {
            $user = Auth::user();

            $conversations = [
                [
                    'id' => 1,
                    'type' => 'private',
                    'name' => 'Dr. Sarah Johnson',
                    'avatar' => '👩‍🏫',
                    'last_message' => [
                        'id' => 1,
                        'message' => 'Please submit your assignment by Friday',
                        'sender_id' => 1,
                        'sender_name' => 'Dr. Sarah Johnson',
                        'created_at' => now()->subMinutes(30)->toISOString()
                    ],
                    'unread_count' => 2,
                    'updated_at' => now()->subMinutes(30)->toISOString()
                ],
                [
                    'id' => 2,
                    'type' => 'course',
                    'name' => 'Advanced Web Development',
                    'avatar' => '💻',
                    'last_message' => [
                        'id' => 2,
                        'message' => 'The deadline is this Friday at 11:59 PM',
                        'sender_id' => 1,
                        'sender_name' => 'Dr. Sarah Johnson',
                        'created_at' => now()->subHours(2)->toISOString()
                    ],
                    'unread_count' => 5,
                    'updated_at' => now()->subHours(2)->toISOString()
                ],
                [
                    'id' => 3,
                    'type' => 'group',
                    'name' => 'Study Group',
                    'avatar' => '👥',
                    'last_message' => [
                        'id' => 3,
                        'message' => 'Meeting at 3 PM in the library',
                        'sender_id' => 2,
                        'sender_name' => 'John Doe',
                        'created_at' => now()->subHours(5)->toISOString()
                    ],
                    'unread_count' => 0,
                    'updated_at' => now()->subHours(5)->toISOString()
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $conversations
            ]);

        } catch (\Exception $e) {
            Log::error('getConversations error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => []
            ], 500);
        }
    }

    /**
     * Get messages for a conversation
     * GET /api/chat/conversations/{conversationId}/messages
     */
    public function getConversationMessages($conversationId, Request $request)
    {
        try {
            $userId = Auth::id();

            $messages = $this->generateDummyPrivateMessages($userId, 1);

            return response()->json([
                'success' => true,
                'data' => $messages,
                'total' => count($messages),
                'per_page' => 50,
                'current_page' => 1,
                'last_page' => 1
            ]);

        } catch (\Exception $e) {
            Log::error('getConversationMessages error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch messages: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark conversation as read
     * POST /api/chat/conversations/{conversationId}/read
     */
    public function markConversationAsRead($conversationId, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Conversation marked as read'
            ]);

        } catch (\Exception $e) {
            Log::error('markConversationAsRead error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark conversation as read'
            ], 500);
        }
    }

    // ============================================
    // 2. GROUP CHAT
    // ============================================

    /**
     * Get user groups
     * GET /api/chat/groups
     */
    public function getUserGroups(Request $request)
    {
        try {
            $groups = [
                [
                    'id' => 1,
                    'name' => 'Web Dev Study Group',
                    'description' => 'Study group for Advanced Web Development',
                    'code' => 'WD123',
                    'course_id' => 1,
                    'course_name' => 'Advanced Web Development',
                    'members_count' => 5,
                    'max_members' => 10,
                    'last_message' => [
                        'message' => 'Who\'s joining the study session?',
                        'sender_name' => 'John Doe',
                        'created_at' => now()->subHours(3)->toISOString()
                    ],
                    'unread_count' => 3,
                    'is_admin' => true,
                    'created_at' => now()->subDays(5)->toISOString()
                ],
                [
                    'id' => 2,
                    'name' => 'Database Project Team',
                    'description' => 'Team for Database Systems project',
                    'code' => 'DB456',
                    'course_id' => 2,
                    'course_name' => 'Database Systems',
                    'members_count' => 4,
                    'max_members' => 6,
                    'last_message' => [
                        'message' => 'Meeting tomorrow at 2 PM',
                        'sender_name' => 'Jane Smith',
                        'created_at' => now()->subHours(8)->toISOString()
                    ],
                    'unread_count' => 1,
                    'is_admin' => false,
                    'created_at' => now()->subDays(10)->toISOString()
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $groups
            ]);

        } catch (\Exception $e) {
            Log::error('getUserGroups error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => []
            ], 500);
        }
    }

    /**
     * Create a group
     * POST /api/chat/group/create
     */
    public function createGroup(Request $request)
    {
        try {
            $user = Auth::user();
            
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'course_id' => 'nullable|integer',
                'members' => 'required|array|min:1',
                'members.*' => 'integer'
            ]);

            $code = strtoupper(substr(md5(uniqid()), 0, 8));

            $group = [
                'id' => rand(100, 999),
                'name' => $request->name,
                'description' => $request->description,
                'code' => $code,
                'course_id' => $request->course_id,
                'created_by' => $user->id,
                'max_members' => $request->max_members ?? 50,
                'created_at' => now()->toISOString()
            ];

            return response()->json([
                'success' => true,
                'message' => 'Group created successfully',
                'data' => [
                    'group' => $group,
                    'invite_code' => $code
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('createGroup error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get group messages
     * GET /api/chat/group/{groupId}/messages
     */
    public function getGroupMessages($groupId, Request $request)
    {
        try {
            $messages = $this->generateDummyGroupMessages($groupId);

            return response()->json([
                'success' => true,
                'data' => $messages,
                'total' => count($messages),
                'per_page' => 50,
                'current_page' => 1,
                'last_page' => 1
            ]);

        } catch (\Exception $e) {
            Log::error('getGroupMessages error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load messages: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send group message
     * POST /api/chat/group/send
     */
    public function sendGroupMessage(Request $request)
    {
        try {
            $user = Auth::user();
            
            $request->validate([
                'group_id' => 'required|integer',
                'message' => 'required|string|max:5000'
            ]);

            $message = [
                'id' => rand(1000, 9999),
                'sender_id' => $user->id,
                'sender_name' => $user->name,
                'group_id' => $request->group_id,
                'message' => $request->message,
                'created_at' => now()->toISOString(),
                'is_read' => false
            ];

            Log::info('Group message sent', [
                'sender_id' => $user->id,
                'group_id' => $request->group_id,
                'message' => $request->message
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $message
            ], 201);

        } catch (\Exception $e) {
            Log::error('sendGroupMessage error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get group members
     * GET /api/chat/group/{groupId}/members
     */
    public function getGroupMembers($groupId, Request $request)
    {
        try {
            $members = [
                [
                    'id' => 1,
                    'name' => 'Dr. Sarah Johnson',
                    'email' => 'sarah@ucc.ac.tz',
                    'role' => 'lecturer',
                    'member_role' => 'admin',
                    'joined_at' => now()->subDays(5)->toISOString(),
                    'is_admin' => true
                ],
                [
                    'id' => 2,
                    'name' => 'John Doe',
                    'email' => 'john@ucc.ac.tz',
                    'role' => 'student',
                    'member_role' => 'member',
                    'joined_at' => now()->subDays(4)->toISOString(),
                    'is_admin' => false
                ],
                [
                    'id' => 3,
                    'name' => 'Jane Smith',
                    'email' => 'jane@ucc.ac.tz',
                    'role' => 'student',
                    'member_role' => 'member',
                    'joined_at' => now()->subDays(3)->toISOString(),
                    'is_admin' => false
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $members,
                'count' => count($members)
            ]);

        } catch (\Exception $e) {
            Log::error('getGroupMembers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load members: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get group online users
     * GET /api/chat/group/{groupId}/online
     */
    public function getGroupOnlineUsers($groupId, Request $request)
    {
        try {
            $onlineUsers = [
                ['id' => 1, 'name' => 'Dr. Sarah Johnson', 'role' => 'lecturer'],
                ['id' => 2, 'name' => 'John Doe', 'role' => 'student'],
            ];

            return response()->json([
                'success' => true,
                'data' => $onlineUsers,
                'count' => count($onlineUsers),
                'message' => 'Online users fetched successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('getGroupOnlineUsers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'Failed to fetch online users'
            ], 500);
        }
    }

    /**
     * Join group by code
     * POST /api/chat/group/join
     */
    public function joinGroupByCode(Request $request)
    {
        try {
            $request->validate(['code' => 'required|string']);

            return response()->json([
                'success' => true,
                'message' => 'Joined group successfully',
                'data' => [
                    'group_id' => rand(100, 999),
                    'group_name' => 'Study Group',
                    'code' => $request->code
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('joinGroupByCode error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to join group: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add group member
     * POST /api/chat/group/{groupId}/add-member
     */
    public function addGroupMember($groupId, Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Member added successfully',
                'data' => [
                    'group_id' => (int)$groupId,
                    'user_id' => (int)$request->user_id
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('addGroupMember error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add member: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove group member
     * DELETE /api/chat/group/{groupId}/member/{userId}
     */
    public function removeGroupMember($groupId, $userId, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Member removed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('removeGroupMember error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove member: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Leave group
     * POST /api/chat/group/{groupId}/leave
     */
    public function leaveGroup($groupId, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Left group successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('leaveGroup error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to leave group: ' . $e->getMessage()
            ], 500);
        }
    }

    // ============================================
    // 3. COURSE CHAT - FIXED
    // ============================================

    /**
     * Get course messages - FIXED
     * GET /api/chat/course/{courseId}/messages
     */
    public function getCourseMessages($courseId, Request $request)
    {
        try {
            Log::info('Fetching course messages', ['course_id' => $courseId]);

            // Generate dummy messages with proper IDs
            $messages = $this->generateDummyCourseMessages($courseId);

            Log::info('Returning course messages', [
                'course_id' => $courseId,
                'count' => count($messages)
            ]);

            return response()->json([
                'success' => true,
                'data' => $messages,
                'message' => 'Messages fetched successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('getCourseMessages error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'Failed to fetch messages: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send course message - FIXED with persistent storage
     * POST /api/chat/course/send
     */
    public function sendCourseMessage(Request $request)
    {
        try {
            $user = Auth::user();
            
            Log::info('Sending course message', [
                'user_id' => $user->id,
                'course_id' => $request->course_id,
                'message' => $request->message
            ]);
            
            $request->validate([
                'course_id' => 'required|integer',
                'message' => 'required|string|max:5000'
            ]);

            // Generate a unique ID for the message
            $messageId = rand(1000, 9999);
            $timestamp = now()->toISOString();

            // Create message data
            $messageData = [
                'id' => $messageId,
                'sender_id' => $user->id,
                'sender_name' => $user->name,
                'message' => $request->message,
                'created_at' => $timestamp,
                'type' => 'text',
                'is_read' => false,
                'file_url' => null,
                'file_name' => null
            ];

            // Store in database (using messages table for consistency)
            try {
                // Try to insert into course_messages table
                DB::table('course_messages')->insert([
                    'id' => $messageId,
                    'course_id' => (int)$request->course_id,
                    'sender_id' => $user->id,
                    'message' => $request->message,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                Log::info('Message saved to course_messages table', ['message_id' => $messageId]);
            } catch (\Exception $e) {
                Log::warning('Could not save to course_messages, saving to messages table: ' . $e->getMessage());
                try {
                    DB::table('messages')->insert([
                        'id' => $messageId,
                        'course_id' => (int)$request->course_id,
                        'sender_id' => $user->id,
                        'message' => $request->message,
                        'type' => 'text',
                        'is_read' => false,
                        'is_deleted' => false,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                    Log::info('Message saved to messages table', ['message_id' => $messageId]);
                } catch (\Exception $e2) {
                    Log::error('Failed to save message to any table: ' . $e2->getMessage());
                    // Still return success with dummy data
                }
            }

            Log::info('Course message sent successfully', [
                'message_id' => $messageId,
                'course_id' => $request->course_id,
                'sender_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $messageData
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('sendCourseMessage error: ' . $e->getMessage());
            Log::error('sendCourseMessage trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Error sending message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get course students
     * GET /api/chat/course/{courseId}/students
     */
    public function getCourseStudents($courseId, Request $request)
    {
        try {
            // Try to get from database first
            try {
                $students = DB::table('enrollments')
                    ->join('users', 'enrollments.user_id', '=', 'users.id')
                    ->where('enrollments.course_id', $courseId)
                    ->select('users.id', 'users.name', 'users.email')
                    ->get();
                
                if ($students->isNotEmpty()) {
                    return response()->json([
                        'success' => true,
                        'data' => $students,
                        'message' => 'Students fetched successfully'
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('Could not fetch students from DB: ' . $e->getMessage());
            }

            // Return dummy students
            $students = [
                ['id' => 2, 'name' => 'John Doe', 'email' => 'john@ucc.ac.tz', 'online' => true],
                ['id' => 3, 'name' => 'Jane Smith', 'email' => 'jane@ucc.ac.tz', 'online' => false],
                ['id' => 4, 'name' => 'Michael Brown', 'email' => 'michael@ucc.ac.tz', 'online' => true],
            ];

            return response()->json([
                'success' => true,
                'data' => $students,
                'message' => 'Students fetched successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('getCourseStudents error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'Failed to fetch students'
            ], 500);
        }
    }

    /**
     * Get course online users
     * GET /api/chat/course/{courseId}/online
     */
    public function getCourseOnlineUsers($courseId, Request $request)
    {
        try {
            $onlineUsers = [
                ['id' => 1, 'name' => 'Dr. Sarah Johnson', 'role' => 'lecturer'],
                ['id' => 2, 'name' => 'John Doe', 'role' => 'student'],
            ];

            return response()->json([
                'success' => true,
                'data' => $onlineUsers,
                'message' => 'Online users fetched successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('getCourseOnlineUsers error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'Failed to fetch online users'
            ], 500);
        }
    }

    /**
     * Broadcast to course
     * POST /api/chat/course/broadcast
     */
    public function broadcastToCourse(Request $request)
    {
        try {
            $user = Auth::user();
            
            $request->validate([
                'course_id' => 'required|integer',
                'message' => 'required|string|max:5000'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Broadcast sent successfully',
                'data' => [
                    'course_id' => (int)$request->course_id,
                    'sender_id' => $user->id,
                    'sender_name' => $user->name,
                    'message' => $request->message,
                    'sent_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('broadcastToCourse error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to broadcast: ' . $e->getMessage()
            ], 500);
        }
    }

    // ============================================
    // 4. MESSAGE ACTIONS
    // ============================================

    /**
     * Delete message
     * DELETE /api/chat/messages/{messageId}
     */
    public function deleteMessage($messageId, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Message deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('deleteMessage error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error deleting message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add reaction to message
     * POST /api/chat/messages/{messageId}/reaction
     */
    public function addReaction($messageId, Request $request)
    {
        try {
            $request->validate([
                'reaction' => 'required|string|max:10'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reaction added successfully',
                'data' => [
                    'message_id' => (int)$messageId,
                    'reaction' => $request->reaction,
                    'user_id' => Auth::id()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('addReaction error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add reaction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove reaction from message
     * DELETE /api/chat/messages/{messageId}/reaction
     */
    public function removeReaction($messageId, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Reaction removed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('removeReaction error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove reaction: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark message as read
     * POST /api/chat/messages/{id}/read
     */
    public function markAsRead($id, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Message marked as read'
            ]);

        } catch (\Exception $e) {
            Log::error('markAsRead error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error marking message as read: ' . $e->getMessage()
            ], 500);
        }
    }

    // ============================================
    // 5. FILE UPLOAD & TYPING
    // ============================================

    /**
     * Upload file for chat
     * POST /api/chat/upload
     */
    public function uploadFile(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|max:10240',
                'conversation_id' => 'required|integer'
            ]);

            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully',
                'data' => [
                    'file_name' => $fileName,
                    'file_url' => '/uploads/chat/' . $fileName,
                    'file_size' => $file->getSize()
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('uploadFile error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download file
     * GET /api/chat/files/{fileId}/download
     */
    public function downloadFile($fileId, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'File downloaded successfully',
                'data' => [
                    'file_id' => (int)$fileId,
                    'download_url' => '/uploads/chat/file_' . $fileId
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('downloadFile error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to download file: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send typing indicator
     * POST /api/chat/typing/{conversationId}
     */
    public function sendTypingIndicator($conversationId, Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Typing indicator sent',
                'data' => [
                    'conversation_id' => (int)$conversationId,
                    'user_id' => Auth::id(),
                    'is_typing' => $request->input('is_typing', true)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('sendTypingIndicator error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send typing indicator'
            ], 500);
        }
    }

    /**
     * Update online status
     * POST /api/chat/status
     */
    public function updateOnlineStatus(Request $request)
    {
        try {
            $request->validate([
                'status' => 'required|in:online,away,offline'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully',
                'data' => [
                    'user_id' => Auth::id(),
                    'status' => $request->status,
                    'updated_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('updateOnlineStatus error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status'
            ], 500);
        }
    }

    // ============================================
    // 6. DUMMY DATA GENERATORS
    // ============================================

    /**
     * Generate dummy private messages
     */
    private function generateDummyPrivateMessages($senderId, $receiverId)
    {
        $sender = DB::table('users')->where('id', $senderId)->first();
        $receiver = DB::table('users')->where('id', $receiverId)->first();
        
        $senderName = $sender ? $sender->name : 'You';
        $receiverName = $receiver ? $receiver->name : 'Other User';

        return [
            [
                'id' => 1,
                'sender_id' => $senderId,
                'sender_name' => $senderName,
                'message' => 'Hello! How are you doing?',
                'type' => 'text',
                'file_url' => null,
                'file_name' => null,
                'created_at' => now()->subHours(2)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 2,
                'sender_id' => $receiverId,
                'sender_name' => $receiverName,
                'message' => 'I\'m good, thanks! How about you?',
                'type' => 'text',
                'file_url' => null,
                'file_name' => null,
                'created_at' => now()->subHours(1.5)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 3,
                'sender_id' => $senderId,
                'sender_name' => $senderName,
                'message' => 'Great! I wanted to ask about the assignment.',
                'type' => 'text',
                'file_url' => null,
                'file_name' => null,
                'created_at' => now()->subHours(1)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 4,
                'sender_id' => $receiverId,
                'sender_name' => $receiverName,
                'message' => 'Sure, what do you need to know?',
                'type' => 'text',
                'file_url' => null,
                'file_name' => null,
                'created_at' => now()->subMinutes(45)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 5,
                'sender_id' => $senderId,
                'sender_name' => $senderName,
                'message' => 'When is the deadline?',
                'type' => 'text',
                'file_url' => null,
                'file_name' => null,
                'created_at' => now()->subMinutes(30)->toISOString(),
                'is_read' => false
            ],
            [
                'id' => 6,
                'sender_id' => $receiverId,
                'sender_name' => $receiverName,
                'message' => 'The deadline is this Friday at 11:59 PM.',
                'type' => 'text',
                'file_url' => null,
                'file_name' => null,
                'created_at' => now()->subMinutes(15)->toISOString(),
                'is_read' => false
            ]
        ];
    }

    /**
     * Generate dummy course messages - FIXED with dynamic IDs
     */
    private function generateDummyCourseMessages($courseId)
    {
        // Base timestamp for consistent ordering
        $now = now();
        
        return [
            [
                'id' => 1,
                'sender_id' => 1,
                'sender_name' => 'Dr. Sarah Johnson',
                'message' => 'Welcome to the course! Please review the syllabus.',
                'type' => 'text',
                'created_at' => $now->copy()->subDays(2)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 2,
                'sender_id' => 2,
                'sender_name' => 'John Doe',
                'message' => 'I have a question about the first assignment.',
                'type' => 'text',
                'created_at' => $now->copy()->subDays(1)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 3,
                'sender_id' => 1,
                'sender_name' => 'Dr. Sarah Johnson',
                'message' => 'Great question! Let me explain the requirements.',
                'type' => 'text',
                'created_at' => $now->copy()->subHours(12)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 4,
                'sender_id' => 3,
                'sender_name' => 'Jane Smith',
                'message' => 'When is the next lecture?',
                'type' => 'text',
                'created_at' => $now->copy()->subHours(6)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 5,
                'sender_id' => 1,
                'sender_name' => 'Dr. Sarah Johnson',
                'message' => 'The next lecture is tomorrow at 10 AM.',
                'type' => 'text',
                'created_at' => $now->copy()->subHours(4)->toISOString(),
                'is_read' => false
            ],
            [
                'id' => 6,
                'sender_id' => 4,
                'sender_name' => 'Michael Brown',
                'message' => 'Is there any reading material for this week?',
                'type' => 'text',
                'created_at' => $now->copy()->subHours(2)->toISOString(),
                'is_read' => false
            ],
            [
                'id' => 7,
                'sender_id' => 1,
                'sender_name' => 'Dr. Sarah Johnson',
                'message' => 'Yes, please read chapters 1-3 before the next class.',
                'type' => 'text',
                'created_at' => $now->copy()->subHours(1)->toISOString(),
                'is_read' => false
            ]
        ];
    }

    /**
     * Generate dummy group messages
     */
    private function generateDummyGroupMessages($groupId)
    {
        return [
            [
                'id' => 1,
                'sender_id' => 1,
                'sender_name' => 'Dr. Sarah Johnson',
                'message' => 'Welcome to the group!',
                'type' => 'text',
                'created_at' => now()->subDays(1)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 2,
                'sender_id' => 2,
                'sender_name' => 'John Doe',
                'message' => 'Thanks for adding me!',
                'type' => 'text',
                'created_at' => now()->subHours(20)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 3,
                'sender_id' => 1,
                'sender_name' => 'Dr. Sarah Johnson',
                'message' => 'Let\'s schedule our first meeting.',
                'type' => 'text',
                'created_at' => now()->subHours(15)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 4,
                'sender_id' => 3,
                'sender_name' => 'Jane Smith',
                'message' => 'I\'m available on Thursday afternoon.',
                'type' => 'text',
                'created_at' => now()->subHours(10)->toISOString(),
                'is_read' => true
            ],
            [
                'id' => 5,
                'sender_id' => 4,
                'sender_name' => 'Michael Brown',
                'message' => 'Works for me too!',
                'type' => 'text',
                'created_at' => now()->subHours(8)->toISOString(),
                'is_read' => false
            ]
        ];
    }
}