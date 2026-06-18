<?php

use App\Models\User;

// Channel for private chat between two users
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Channel for group chat
Broadcast::channel('group.{groupId}', function ($user, $groupId) {
    return $user->groups()->where('group_id', $groupId)->exists();
});