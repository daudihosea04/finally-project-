<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatMessage extends Model
{
    protected $table = 'chat_messages';
    
    protected $fillable = [
        'course_id', 
        'group_id', 
        'sender_id', 
        'recipient_id',
        'message', 
        'user_id', 
        'user_name', 
        'sender_name',
        'sender_role', 
        'is_read', 
        'type', 
        'file_url', 
        'file_name', 
        'file_type'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the user who sent the message
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the sender of the message
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the recipient of the message (for private chats)
     */
    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    /**
     * Get the course associated with the message
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Get the group associated with the message
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    /**
     * Get all attachments for this message
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(ChatAttachment::class, 'message_id');
    }

    /**
     * Check if message is from a specific user
     */
    public function isFromUser($userId): bool
    {
        return $this->sender_id === $userId || $this->user_id === $userId;
    }

    /**
     * Check if message is for a specific user (private chat)
     */
    public function isForUser($userId): bool
    {
        return $this->recipient_id === $userId;
    }

    /**
     * Scope for course messages
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    /**
     * Scope for group messages
     */
    public function scopeForGroup($query, $groupId)
    {
        return $query->where('group_id', $groupId);
    }

    /**
     * Scope for private messages between two users
     */
    public function scopeBetweenUsers($query, $userId1, $userId2)
    {
        return $query->where(function($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId1)->where('recipient_id', $userId2);
        })->orWhere(function($q) use ($userId1, $userId2) {
            $q->where('sender_id', $userId2)->where('recipient_id', $userId1);
        });
    }

    /**
     * Scope for unread messages
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
}