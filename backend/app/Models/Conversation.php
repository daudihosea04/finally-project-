<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Conversation extends Model
{
    protected $fillable = [
        'type',
        'user1_id',
        'user2_id',
        'name',
        'course_id',
        'group_id',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
                    ->withPivot('role', 'joined_at', 'last_read_at')
                    ->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(PrivateMessage::class);
    }

    public function lastMessage()
    {
        return $this->hasOne(PrivateMessage::class)->latest();
    }

    public function isPrivate(): bool
    {
        return $this->type === 'private';
    }

    public function isGroup(): bool
    {
        return $this->type === 'group';
    }

    public function otherUser($userId)
    {
        if ($this->type === 'private') {
            return $this->user1_id === $userId ? $this->user2_id : $this->user1_id;
        }
        return null;
    }
}