<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_id',
        'conversation_id',
        'course_id',
        'group_id',
        'recipient_id',
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

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }
}