<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewPrivateMessage implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $recipientId;

    public function __construct($message, $recipientId)
    {
        $this->message = $message;
        $this->recipientId = $recipientId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('private.' . $this->recipientId);
    }

    public function broadcastAs()
    {
        return 'NewPrivateMessage';
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