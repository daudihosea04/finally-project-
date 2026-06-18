<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'type',          // message, assignment, grade, announcement, system
        'title',
        'message',
        'data',
        'action_url',
        'read_at',
        'is_sent'
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'is_sent' => 'boolean',
        'created_at' => 'datetime'
    ];

    /**
     * Get the user who owns this notification
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if notification has been read
     */
    public function isRead(): bool
    {
        return !is_null($this->read_at);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead()
    {
        if (!$this->isRead()) {
            $this->update(['read_at' => now()]);
        }
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread()
    {
        $this->update(['read_at' => null]);
    }

    /**
     * Scope for unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    /**
     * Scope for read notifications
     */
    public function scopeRead($query)
    {
        return $query->whereNotNull('read_at');
    }

    /**
     * Scope for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for a specific type
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Get notification icon based on type
     */
    public function getIconAttribute()
    {
        return match ($this->type) {
            'message' => '💬',
            'assignment' => '📝',
            'grade' => '⭐',
            'announcement' => '📢',
            'system' => '🔔',
            default => '📌',
        };
    }

    /**
     * Get notification color based on type
     */
    public function getColorAttribute()
    {
        return match ($this->type) {
            'message' => 'blue',
            'assignment' => 'orange',
            'grade' => 'green',
            'announcement' => 'purple',
            'system' => 'gray',
            default => 'gray',
        };
    }
}