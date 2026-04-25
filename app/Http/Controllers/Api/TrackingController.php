<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\Tracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class TrackingController extends Controller
{
    public function store(Request $request)
    {
        if (RateLimiter::tooManyAttempts('tracking:'.$request->ip(), 10)) {
            throw ValidationException::withMessages([
                'message' => 'Too many tracking requests.',
            ]);
        }

        RateLimiter::hit('tracking:'.$request->ip(), 60);

        $data = $request->validate([
            'professional_id' => ['required', 'exists:professionals,id'],
            'type' => ['required', 'in:view,whatsapp_click,call'],
            'meta' => ['nullable', 'array'],
        ]);

        $professional = Professional::findOrFail($data['professional_id']);

        match ($data['type']) {
            'view'          => $professional->increment('views'),
            'whatsapp_click'=> $professional->increment('whatsapp_clicks'),
            'call'          => $professional->increment('calls'),
        };

        $tracking = Tracking::create([
            'professional_id' => $professional->id,
            'type' => $data['type'],
            'ip' => $request->ip(),
            'city' => $request->attributes->get('geo.city', 'Casablanca'),
            'meta' => $data['meta'] ?? [],
        ]);

        return response()->json(['success' => true, 'tracking' => $tracking]);
    }
}
