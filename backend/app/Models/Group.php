<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Group extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'code',
        'group_code',
        'course_id',
        'created_by',
        'max_members',
        'status',
        'type'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'max_members' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the course that this group belongs to.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Get the user who created this group.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all members of this group.
     */
    public function members(): HasMany
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }

    /**
     * Get all users in this group.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_users', 'group_id', 'user_id')
                    ->withPivot('role', 'joined_at')
                    ->withTimestamps();
    }

    /**
     * Get all messages in this group.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'group_id');
    }

    /**
     * Check if a user is a member of this group.
     */
    public function isMember(int $userId): bool
    {
        return $this->members()->where('user_id', $userId)->exists();
    }

    /**
     * Check if a user is an admin of this group.
     */
    public function isAdmin(int $userId): bool
    {
        return $this->members()
            ->where('user_id', $userId)
            ->where('role', 'admin')
            ->exists();
    }

    /**
     * Get the number of members in this group.
     */
    public function getMemberCountAttribute(): int
    {
        return $this->members()->count();
    }

    /**
     * Scope a query to only include active groups.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include groups for a specific course.
     */
    public function scopeForCourse($query, int $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    /**
     * Scope a query to only include groups created by a specific user.
     */
    public function scopeCreatedBy($query, int $userId)
    {
        return $query->where('created_by', $userId);
    }
}