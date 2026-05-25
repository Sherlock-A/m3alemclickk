<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\Review;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ReviewSummaryController extends Controller
{
    public function summary(int $id): \Illuminate\Http\JsonResponse
    {
        $cacheKey = "review_summary_{$id}";

        $summary = Cache::remember($cacheKey, now()->addDay(), function () use ($id) {
            return $this->generate($id);
        });

        if (! $summary) {
            return response()->json(['summary' => null]);
        }

        return response()->json(['summary' => $summary]);
    }

    private function generate(int $id): ?string
    {
        $reviews = Review::where('professional_id', $id)
            ->where('approved', true)
            ->whereNotNull('comment')
            ->where('comment', '!=', '')
            ->latest()
            ->limit(20)
            ->pluck('comment')
            ->toArray();

        if (count($reviews) < 3) {
            return null;
        }

        $geminiKey = config('services.gemini.key');
        if (! $geminiKey) {
            return null;
        }

        $joined = implode("\n- ", $reviews);
        $prompt = <<<PROMPT
Voici des avis clients laissés sur un artisan marocain sur la plateforme Jobly :

- {$joined}

En 2 phrases maximum, résume ce que les clients pensent de cet artisan (points forts, qualités récurrentes).
Réponds uniquement en français. Style : positif, factuel, concis. Ne commence pas par "Les clients" mais par un verbe ou un adjectif.
Exemple : "Très ponctuel et professionnel, il réalise un travail soigné à un prix compétitif."
PROMPT;

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={$geminiKey}";

            $res = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(10)
                ->post($url, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => $prompt]]],
                    ],
                    'generationConfig' => [
                        'maxOutputTokens' => 120,
                        'temperature'     => 0.4,
                    ],
                ]);

            if ($res->successful()) {
                $text = $res->json('candidates.0.content.parts.0.text');
                if ($text) {
                    return trim($text);
                }
            }
        } catch (\Throwable) {}

        return null;
    }
}
