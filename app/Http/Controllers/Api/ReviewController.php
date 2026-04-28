<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'professional_id' => ['required', 'integer', 'exists:professionals,id'],
            'client_name'     => ['required', 'string', 'min:2', 'max:100'],
            'rating'          => ['required', 'integer', 'min:1', 'max:5'],
            'comment'         => ['nullable', 'string', 'max:1000'],
        ]);

        // IP-based daily limit: max 3 reviews per IP per professional per day
        $ip      = $request->ip();
        $proId   = $data['professional_id'];
        $ipKey   = "review_ip_{$ip}_{$proId}_" . now()->format('Ymd');
        $ipCount = Cache::get($ipKey, 0);

        if ($ipCount >= 3) {
            return response()->json([
                'message' => 'Vous avez déjà soumis plusieurs avis pour ce professionnel aujourd\'hui.',
            ], 429);
        }

        Cache::put($ipKey, $ipCount + 1, now()->endOfDay());

        // Default approved = false (pending admin validation)
        $data['approved'] = false;

        Review::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Votre avis a été soumis et sera visible après validation.',
        ], 201);
    }

    // PUT /api/pro/reviews/{review}/respond — jwt:professional
    public function respond(Request $request, Review $review)
    {
        $data = $request->validate([
            'pro_response' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        // Verify the review belongs to the authenticated pro
        $user = auth('professional')->user();
        if (! $user || $review->professional_id !== $user->professional_id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $review->update([
            'pro_response'     => $data['pro_response'],
            'pro_responded_at' => now(),
        ]);

        return response()->json(['success' => true, 'review' => $review->fresh()]);
    }
}
