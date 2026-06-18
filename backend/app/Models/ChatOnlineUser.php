<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatOnlineUser extends Model
{
    protected $table = 'chat_online_users';

    protected $fillable = [
        'user_id', 
        'user_name', 
        'user_role', 
        'course_id', 
        'group_id', 
        'last_activity_at'
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user associated with this online record
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the course associated with this online record
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Get the group associated with this online record
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    /**
     * Scope for users online in a specific course
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId)
                     ->where('last_activity_at', '>', now()->subMinutes(2));
    }

    /**
     * Scope for users online in a specific group
     */
    public function scopeForGroup($query, $groupId)
    {
        return $query->where('group_id', $groupId)
                     ->where('last_activity_at', '>', now()->subMinutes(2));
    }

    /**
     * Scope for active users (last 2 minutes)
     */
    public function scopeActive($query)
    {
        return $query->where('last_activity_at', '>', now()->subMinutes(2));
    }

    /**
     * Update last activity timestamp
     */
    public function updateActivity(): void
    {
        $this->update(['last_activity_at' => now()]);
    }

    /**
     * Check if user is still online
     */
    public function isOnline(): bool
    {
        return $this->last_activity_at > now()->subMinutes(2);
    }

    /**
     * Clean old online records (older than 5 minutes)
     */
    public static function cleanOldRecords(): void
    {
        self::where('last_activity_at', '<', now()->subMinutes(5))->delete();
    }
}