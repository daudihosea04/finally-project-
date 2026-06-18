<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GroupMessage extends Model
{
    protected $table = 'group_messages';

    protected $fillable = [
        'group_id',
        'sender_id',
        'message',
        'type',
        'file_url',
        'file_name',
        'is_read',
        'is_deleted'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_deleted' => 'boolean',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function markAsRead(): void
    {
        $this->update(['is_read' => true]);
    }
}