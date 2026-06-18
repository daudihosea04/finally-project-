<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrivateMessage extends Model
{
    protected $table = 'private_messages';

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'receiver_id',
        'message',
        'type',
        'file_url',
        'file_name',
        'is_read',
        'read_at',
        'is_deleted'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_deleted' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function markAsRead(): void
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }
}