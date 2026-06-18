<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseMessage extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'course_messages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'course_id',
        'sender_id',
        'message',
        'type',
        'file_url',
        'file_name',
        'is_read',
        'read_at',
        'is_deleted'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_read' => 'boolean',
        'is_deleted' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the course that owns the message.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the sender of the message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Mark message as read.
     */
    public function markAsRead(): void
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    /**
     * Scope a query to only include messages for a specific course.
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    /**
     * Scope a query to only include unread messages.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope a query to only include messages from a specific sender.
     */
    public function scopeFromSender($query, $senderId)
    {
        return $query->where('sender_id', $senderId);
    }
}