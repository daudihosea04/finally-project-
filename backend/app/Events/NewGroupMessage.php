<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewGroupMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $groupId;

    public function __construct($message, $groupId)
    {
        $this->message = $message;
        $this->groupId = $groupId;
    }

    public function broadcastOn()
    {
        return new Channel('group.' . $this->groupId);
    }

    public function broadcastAs()
    {
        return 'NewGroupMessage';
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->message['id'] ?? rand(100, 999),
            'message' => $this->message['message'],
            'user_id' => $this->message['sender_id'],
            'user_name' => $this->message['sender_name'],
            'sender_name' => $this->message['sender_name'],
            'created_at' => $this->message['created_at'] ?? now()->toISOString(),
            'type' => $this->message['type'] ?? 'text',
        ];
    }
}