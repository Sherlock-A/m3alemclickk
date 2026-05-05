<?php

use Illuminate\Support\Facades\Broadcast;

// Private channel for a professional's real-time notifications
// Only the pro whose professional.id matches can subscribe
Broadcast::channel('pro.{proId}', function ($user, int $proId) {
    return (int) ($user->professional?->id ?? 0) === $proId;
});
