<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $professionalId,
        public readonly int $count,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("pro.{$this->professionalId}")];
    }

    public function broadcastAs(): string
    {
        return 'notification.count';
    }

    public function broadcastWith(): array
    {
        return ['count' => $this->count];
    }
}
