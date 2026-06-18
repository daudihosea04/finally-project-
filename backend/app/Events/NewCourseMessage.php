<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewCourseMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $courseId;

    public function __construct($message, $courseId)
    {
        $this->message = $message;
        $this->courseId = $courseId;
    }

    public function broadcastOn()
    {
        return new Channel('course.' . $this->courseId);
    }

    public function broadcastAs()
    {
        return 'NewCourseMessage';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->message['id'],
            'message' => $this->message['message'],
            'sender_id' => $this->message['sender_id'],
            'sender_name' => $this->message['sender_name'],
            'created_at' => $this->message['created_at'],
            'type' => $this->message['type'],
            'file_url' => $this->message['file_url'] ?? null,
            'file_name' => $this->message['file_name'] ?? null,
        ];
    }
}