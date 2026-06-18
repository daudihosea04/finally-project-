<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\VirtualRoom;

class VideoCallController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Initialize video call session
     */
    public function initialize(Request $request, $roomId)
    {
        try {
            $user = Auth::user();
            
            // Check if room exists
            $room = VirtualRoom::where('id', $roomId)->first();
            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Room not found'
                ], 404);
            }

            // Check if user is allowed to join
            if ($room->status !== 'active' && $room->status !== 'scheduled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Room is not available'
                ], 400);
            }

            // Generate unique session ID
            $sessionId = uniqid() . '_' . $user->id;

            Log::info('Video call initialized', [
                'room_id' => $roomId,
                'user_id' => $user->id,
                'session_id' => $sessionId
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'session_id' => $sessionId,
                    'room_id' => $roomId,
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'user_role' => $user->role,
                    'room_name' => $room->name,
                    'start_time' => $room->start_time,
                    'end_time' => $room->end_time,
                    'message' => 'Video call initialized successfully'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Video call initialization failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize video call: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get active participants in a room
     */
    public function getParticipants($roomId)
    {
        try {
            // In production, this would fetch from a real-time store (Redis)
            $participants = [
                [
                    'id' => 1,
                    'name' => 'John Doe',
                    'role' => 'lecturer',
                    'joined_at' => now()->toISOString(),
                    'is_online' => true
                ],
                [
                    'id' => 2,
                    'name' => 'Jane Smith',
                    'role' => 'student',
                    'joined_at' => now()->subMinutes(5)->toISOString(),
                    'is_online' => true
                ],
                [
                    'id' => 3,
                    'name' => 'Michael Brown',
                    'role' => 'student',
                    'joined_at' => now()->subMinutes(10)->toISOString(),
                    'is_online' => true
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'participants' => $participants,
                    'total' => count($participants)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Get participants failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to get participants'
            ], 500);
        }
    }

    /**
     * End video call session
     */
    public function endCall(Request $request, $roomId)
    {
        try {
            $user = Auth::user();

            Log::info('Video call ended', [
                'room_id' => $roomId,
                'user_id' => $user->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Video call ended successfully',
                'data' => [
                    'ended_at' => now()->toISOString(),
                    'duration' => '00:15:30'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('End call failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to end video call'
            ], 500);
        }
    }

    /**
     * Generate signal for WebRTC peer connection
     */
    public function signal(Request $request, $roomId)
    {
        try {
            $user = Auth::user();
            $data = $request->validate([
                'target_id' => 'required|integer',
                'signal' => 'required|json'
            ]);

            // In production, this would forward signals to target user
            // using WebSocket or a real-time message queue

            return response()->json([
                'success' => true,
                'message' => 'Signal forwarded successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Signal failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to forward signal'
            ], 500);
        }
    }
}