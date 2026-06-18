<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewNotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;
    public $userId;

    /**
     * Create a new event instance.
     */
    public function __construct(Notification $notification, $userId)
    {
        $this->notification = $notification;
        $this->userId = $userId;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn()
    {
        return new Channel('user.' . $this->userId);
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs()
    {
        return 'new-notification';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith()
    {
        return [
            'notification' => [
                'id' => $this->notification->id,
                'type' => $this->notification->type,
                'title' => $this->notification->title,
                'message' => $this->notification->message,
                'action_url' => $this->notification->action_url,
                'created_at' => $this->notification->created_at->toISOString(),
                'icon' => $this->notification->icon,
                'color' => $this->notification->color
            ]
        ];
    }
}