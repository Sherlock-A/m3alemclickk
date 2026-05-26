<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Professional;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function show(string $city, string $category): \Inertia\Response
    {
        $cityTitle = ucfirst(mb_strtolower($city, 'UTF-8'));

        $cat = Category::where('slug', $category)
            ->orWhereRaw("LOWER(name) = ?", [mb_strtolower($category, 'UTF-8')])
            ->first();

        $catTitle = $cat ? $cat->name : ucfirst($category);

        $cacheKey = "leaderboard_{$city}_{$category}";

        $pros = Cache::remember($cacheKey, 3600, function () use ($city, $cat) {
            $q = Professional::with(['user', 'categories'])
                ->approved()
                ->whereRaw('LOWER(main_city) LIKE ?', [mb_strtolower($city, 'UTF-8')])
                ->where('rating', '>=', 3.5);

            if ($cat) {
                $q->where('category_id', $cat->id);
            }

            return $q->orderByDesc('rating')
                ->orderByDesc('completed_missions')
                ->orderByDesc('verified')
                ->limit(10)
                ->get(['id', 'name', 'slug', 'profession', 'photo', 'rating', 'main_city',
                    'verified', 'is_available', 'completed_missions', 'views', 'category_id']);
        });

        $seoTitle       = "Top 10 {$catTitle}s à {$cityTitle} — Jobly";
        $seoDescription = "Découvrez les meilleurs {$catTitle}s vérifiés à {$cityTitle} classés par note. Contactez-les directement sur WhatsApp.";

        // FAQ schema
        $topProName = $pros->first()?->name ?? 'disponible sur Jobly';
        $faqs = [
            ['q' => "Quel est le meilleur {$catTitle} à {$cityTitle} ?",
             'a' => "Selon les avis clients Jobly, le meilleur {$catTitle} à {$cityTitle} est {$topProName}. Consultez le classement complet ci-dessous."],
            ['q' => "Comment trouver un {$catTitle} fiable à {$cityTitle} ?",
             'a' => "Sur Jobly, tous les {$catTitle}s sont vérifiés (identité + appel). Consultez les avis clients et contactez-les directement sur WhatsApp."],
            ['q' => "Combien coûte un {$catTitle} à {$cityTitle} ?",
             'a' => "Le prix d'un {$catTitle} à {$cityTitle} varie selon la prestation. Demandez un devis gratuit en contactant directement le professionnel sur Jobly."],
        ];

        $faqSchema = [
            '@context'   => 'https://schema.org',
            '@type'      => 'FAQPage',
            'mainEntity' => array_map(fn($item) => [
                '@type'          => 'Question',
                'name'           => $item['q'],
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a']],
            ], $faqs),
        ];

        return Inertia::render('Frontend/LeaderboardPage', [
            'city'        => $cityTitle,
            'category'    => $catTitle,
            'catSlug'     => $category,
            'pros'        => $pros,
            'faqs'        => $faqs,
            'seoTitle'    => $seoTitle,
            'seoDesc'     => $seoDescription,
            'faqSchema'   => json_encode($faqSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'canonical'   => config('app.url') . "/top-artisans/{$city}/{$category}",
        ]);
    }
}
