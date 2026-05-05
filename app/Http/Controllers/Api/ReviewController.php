<?php

namespace App\Http\Controllers\Api;

use App\Events\ProNotification;
use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use App\Models\Professional;
use App\Models\Review;
use Illuminate\Http\Request;

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

        // DB-based daily limit: max 3 reviews per IP per professional per day
        $ip    = $request->ip();
        $proId = $data['professional_id'];

        $todayCount = Review::where('professional_id', $proId)
            ->where('ip', $ip)
            ->whereDate('created_at', now()->toDateString())
            ->count();

        if ($todayCount >= 3) {
            return response()->json([
                'message' => 'Vous avez déjà soumis plusieurs avis pour ce professionnel aujourd\'hui.',
            ], 429);
        }

        // Default approved = false (pending admin validation)
        $data['approved'] = false;
        $data['ip']       = $ip;

        Review::create($data);

        // Broadcast real-time badge update to the professional
        $newQuotes  = ContactRequest::where('professional_id', $proId)->where('status', 'new')->count();
        $newReviews = Review::where('professional_id', $proId)->where('approved', false)->count();
        broadcast(new ProNotification($proId, $newQuotes + $newReviews))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Votre avis a été soumis et sera visible après validation.',
        ], 201);
    }

    // POST /api/reviews/{review}/report — public, throttled
    public function report(Request $request, Review $review)
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'min:5', 'max:500'],
        ]);

        if ($review->reported_at) {
            return response()->json(['message' => 'Cet avis a déjà été signalé.'], 409);
        }

        $review->update([
            'reported_at'   => now(),
            'report_reason' => $data['reason'],
        ]);

        return response()->json(['success' => true, 'message' => 'Avis signalé, nous allons l\'examiner.']);
    }

    // PUT /api/pro/reviews/{review}/respond — jwt:professional
    public function respond(Request $request, Review $review)
    {
        $data = $request->validate([
            'pro_response' => ['required', 'string', 'min:5', 'max:1000'],
        ]);

        // Verify the review belongs to the authenticated pro
        $user = $request->user();
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
