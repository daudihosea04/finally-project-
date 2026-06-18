<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get user notifications
    public function getNotifications(Request $request)
    {
        try {
            $user = $request->user();
            $limit = $request->get('limit', 50);
            
            $notifications = Notification::where('user_id', $user->id)
                ->orWhere('is_global', true)
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();
            
            return response()->json([
                'success' => true,
                'data' => $notifications,
                'unread_count' => $notifications->where('is_read', false)->count()
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get notifications: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get unread count
    public function getUnreadCount(Request $request)
    {
        try {
            $user = $request->user();
            
            $count = Notification::where('user_id', $user->id)
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

    // Mark notification as read
    public function markAsRead(Request $request, $notificationId)
    {
        try {
            $user = $request->user();
            $notification = Notification::findOrFail($notificationId);
            
            // Check ownership
            if ($notification->user_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $notification->update([
                'is_read' => true,
                'read_at' => now()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark as read: ' . $e->getMessage()
            ], 500);
        }
    }

    // Mark all notifications as read
    public function markAllAsRead(Request $request)
    {
        try {
            $user = $request->user();
            
            Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now()
                ]);
            
            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all as read: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete notification
    public function deleteNotification(Request $request, $notificationId)
    {
        try {
            $user = $request->user();
            $notification = Notification::findOrFail($notificationId);
            
            // Check ownership
            if ($notification->user_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            $notification->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Notification deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update notification settings
    public function updateSettings(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = Validator::make($request->all(), [
                'email_notifications' => 'boolean',
                'push_notifications' => 'boolean',
                'sms_notifications' => 'boolean',
                'assignment_reminders' => 'boolean',
                'grade_alerts' => 'boolean',
                'announcement_alerts' => 'boolean'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $settings = $user->notification_settings ?? [];
            foreach ($request->all() as $key => $value) {
                $settings[$key] = $value;
            }
            
            $user->notification_settings = $settings;
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Notification settings updated successfully',
                'data' => $settings
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage()
            ], 500);
        }
    }

    // Send notification to all users (admin only)
    public function sendToAll(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'type' => 'sometimes|string|in:info,success,warning,error'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            
            // Create notifications for all users
            $users = User::all();
            $notifications = [];
            
            foreach ($users as $targetUser) {
                $notifications[] = [
                    'user_id' => $targetUser->id,
                    'title' => $request->title,
                    'message' => $request->message,
                    'type' => $request->type ?? 'info',
                    'created_by' => $user->id,
                    'is_global' => true,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
            
            // Batch insert (chunk to avoid memory issues)
            foreach (array_chunk($notifications, 100) as $chunk) {
                Notification::insert($chunk);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Notification sent to all users',
                'data' => ['recipients' => $users->count()]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send notification: ' . $e->getMessage()
            ], 500);
        }
    }

    // Send notification to specific role (admin only)
    public function sendToRole(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'role' => 'required|string|in:student,lecturer,admin',
                'type' => 'sometimes|string|in:info,success,warning,error'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            
            // Get users with specific role
            $users = User::where('role', $request->role)->get();
            $notifications = [];
            
            foreach ($users as $targetUser) {
                $notifications[] = [
                    'user_id' => $targetUser->id,
                    'title' => $request->title,
                    'message' => $request->message,
                    'type' => $request->type ?? 'info',
                    'created_by' => $user->id,
                    'is_global' => false,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
            
            // Batch insert
            foreach (array_chunk($notifications, 100) as $chunk) {
                Notification::insert($chunk);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Notification sent to ' . $request->role . 's',
                'data' => ['recipients' => $users->count()]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send notification: ' . $e->getMessage()
            ], 500);
        }
    }
}