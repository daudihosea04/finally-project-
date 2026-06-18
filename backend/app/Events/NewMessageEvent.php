<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewMessageEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $conversationId;
    public $recipientIds;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message, $conversationId = null, array $recipientIds = [])
    {
        $this->message = $message;
        $this->conversationId = $conversationId;
        $this->recipientIds = $recipientIds;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        $channels = [];

        // Broadcast to conversation channel if available
        if ($this->conversationId) {
            $channels[] = new Channel('conversation.' . $this->conversationId);
        }

        // Broadcast to group channel if group message
        if ($this->message->group_id) {
            $channels[] = new Channel('group.' . $this->message->group_id);
        }

        // Broadcast to course channel if course message
        if ($this->message->course_id) {
            $channels[] = new Channel('course.' . $this->message->course_id);
        }

        // Broadcast to individual users
        foreach ($this->recipientIds as $userId) {
            $channels[] = new Channel('user.' . $userId);
        }

        return $channels;
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs()
    {
        return 'new-message';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith()
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'message' => $this->message->message,
                'sender_id' => $this->message->sender_id,
                'sender_name' => $this->message->sender->name,
                'sender_avatar' => $this->message->sender->avatar,
                'created_at' => $this->message->created_at->toISOString(),
                'type' => $this->message->type,
                'file_url' => $this->message->file_url,
                'file_name' => $this->message->file_name,
                'is_read' => $this->message->is_read
            ],
            'conversation_id' => $this->conversationId,
            'group_id' => $this->message->group_id,
            'course_id' => $this->message->course_id
        ];
    }
}