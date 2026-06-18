<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Illuminate\Support\Facades\Log;

class PushNotificationService
{
    protected $messaging;

    public function __construct()
    {
        try {
            $factory = (new Factory)
                ->withServiceAccount(storage_path('app/firebase-credentials.json'));
            $this->messaging = $factory->createMessaging();
        } catch (\Exception $e) {
            Log::error('Firebase initialization failed: ' . $e->getMessage());
        }
    }

    /**
     * Send push notification to a single device
     */
    public function sendPush($deviceToken, $title, $body, $data = [])
    {
        try {
            $notification = Notification::create($title, $body);
            
            $message = CloudMessage::withTarget('token', $deviceToken)
                ->withNotification($notification)
                ->withData($data);

            $response = $this->messaging->send($message);
            
            Log::info('Push notification sent', [
                'token' => substr($deviceToken, 0, 10),
                'title' => $title
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('Push notification failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Send push notification to multiple devices
     */
    public function sendBulkPush($tokens, $title, $body, $data = [])
    {
        try {
            $notification = Notification::create($title, $body);
            
            $message = CloudMessage::new()
                ->withNotification($notification)
                ->withData($data);

            $response = $this->messaging->sendMulticast($message, $tokens);
            
            Log::info('Bulk push notification sent', [
                'sent_count' => count($tokens),
                'success_count' => $response->successes()->count()
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('Bulk push notification failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Save FCM token for user
     */
    public function saveToken($userId, $token)
    {
        try {
            $user = \App\Models\User::find($userId);
            if ($user) {
                $tokens = json_decode($user->fcm_tokens ?? '[]', true);
                if (!in_array($token, $tokens)) {
                    $tokens[] = $token;
                    $user->fcm_tokens = json_encode($tokens);
                    $user->save();
                }
                return true;
            }
            return false;
        } catch (\Exception $e) {
            Log::error('Save FCM token failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Remove FCM token for user
     */
    public function removeToken($userId, $token)
    {
        try {
            $user = \App\Models\User::find($userId);
            if ($user) {
                $tokens = json_decode($user->fcm_tokens ?? '[]', true);
                $tokens = array_filter($tokens, function($t) use ($token) {
                    return $t !== $token;
                });
                $user->fcm_tokens = json_encode(array_values($tokens));
                $user->save();
                return true;
            }
            return false;
        } catch (\Exception $e) {
            Log::error('Remove FCM token failed: ' . $e->getMessage());
            return false;
        }
    }
}