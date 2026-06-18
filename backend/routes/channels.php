<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

// ========== COURSE CHAT ==========
Broadcast::channel('course.{courseId}', function ($user, $courseId) {
    // Allow any authenticated user to listen to course chat
    // In production, check if user is enrolled in the course
    return true;
});

// ========== GROUP CHAT ==========
Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    // Check if user is a member of the group
    // return $user->groups()->where('group_id', $groupId)->exists();
    return true; // Allow for now
});

// ========== PRIVATE CHAT ==========
Broadcast::channel('private.{userId}', function ($user, $userId) {
    // Only allow if user is the recipient
    return (int) $user->id === (int) $userId;
});

// ========== PRESENCE CHANNEL (for online status) ==========
Broadcast::channel('presence.online', function ($user) {
    return [
        'id' => $user->id,
        'name' => $user->name,
        'role' => $user->role,
    ];
});