<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TypingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $conversationId;
    public $userId;
    public $isTyping;

    /**
     * Create a new event instance.
     */
    public function __construct($conversationId, $userId, $isTyping)
    {
        $this->conversationId = $conversationId;
        $this->userId = $userId;
        $this->isTyping = $isTyping;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new Channel('conversation.' . $this->conversationId);
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs()
    {
        return 'typing';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith()
    {
        return [
            'conversation_id' => $this->conversationId,
            'user_id' => $this->userId,
            'is_typing' => $this->isTyping
        ];
    }
}