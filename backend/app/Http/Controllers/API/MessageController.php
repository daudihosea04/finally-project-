<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Send message to a user
    public function sendToUser(Request $request, $userId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:5000'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $sender = $request->user();
            $receiver = User::findOrFail($userId);
            
            // Check if users can message each other
            $canMessage = false;
            if ($sender->isStudent() && $receiver->isLecturer()) {
                $canMessage = $sender->courses()->where('lecturer_id', $userId)->exists();
            } elseif ($sender->isLecturer() && $receiver->isStudent()) {
                $canMessage = $receiver->courses()->where('lecturer_id', $sender->id)->exists();
            } elseif ($sender->isAdmin() || $receiver->isAdmin()) {
                $canMessage = true;
            }
            
            if (!$canMessage && $sender->id != $userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to message this user'
                ], 403);
            }

            $message = Message::create([
                'sender_id' => $sender->id,
                'receiver_id' => $userId,
                'message' => $request->message,
                'is_read' => false
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $message->load('sender')
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get messages between two users
    public function getMessagesWithUser(Request $request, $userId)
    {
        try {
            $user = $request->user();
            $otherUser = User::findOrFail($userId);
            
            // Check if users can message each other
            $canView = false;
            if ($user->isStudent() && $otherUser->isLecturer()) {
                $canView = $user->courses()->where('lecturer_id', $userId)->exists();
            } elseif ($user->isLecturer() && $otherUser->isStudent()) {
                $canView = $otherUser->courses()->where('lecturer_id', $user->id)->exists();
            } elseif ($user->isAdmin() || $otherUser->isAdmin()) {
                $canView = true;
            } elseif ($user->id == $userId) {
                $canView = true;
            }
            
            if (!$canView) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view these messages'
                ], 403);
            }
            
            $messages = Message::where(function($query) use ($user, $userId) {
                $query->where('sender_id', $user->id)
                      ->where('receiver_id', $userId);
            })->orWhere(function($query) use ($user, $userId) {
                $query->where('sender_id', $userId)
                      ->where('receiver_id', $user->id);
            })->with('sender')->orderBy('created_at', 'asc')->get();
            
            // Mark messages as read
            Message::where('receiver_id', $user->id)
                ->where('sender_id', $userId)
                ->where('is_read', false)
                ->update(['is_read' => true, 'read_at' => now()]);

            return response()->json([
                'success' => true,
                'data' => $messages
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get messages: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // Get unread message count
    public function getUnreadCount(Request $request)
    {
        try {
            $count = Message::where('receiver_id', $request->user()->id)
                ->where('is_read', false)
                ->count();
            
            return response()->json([
                'success' => true,
                'data' => ['count' => $count]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count: ' . $e->getMessage()
            ], 500);
        }
    }
}