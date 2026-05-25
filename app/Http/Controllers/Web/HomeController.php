<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Professional;
use App\Models\Review;
use App\Models\Tracking;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        $categories = Cache::remember('categories_active', 3600, fn () =>
            Category::where('active', true)->orderBy('sort_order')->get()
        );

        $featured = Cache::remember('home_featured', 300, fn () =>
            Professional::approved()
                ->where('is_available', true)
                ->where('verified', true)
                ->with('category')
                ->orderByDesc('rating')
                ->orderByDesc('views')
                ->take(6)
                ->get()
        );

        $stats = Cache::remember('home_stats', 1800, fn () => [
            'professionals'   => Professional::approved()->count(),
            'verified'        => Professional::approved()->where('verified', true)->count(),
            'missions'        => Professional::approved()->sum('completed_missions'),
            'cities'          => Professional::approved()->distinct('main_city')->count('main_city'),
            'avg_rating'      => round((float) (Professional::approved()->where('verified', true)->avg('rating') ?? 4.8), 1),
            'weekly_contacts' => Tracking::whereIn('type', ['whatsapp', 'call'])->where('created_at', '>=', now()->subDays(7))->count(),
        ]);

        $testimonials = Cache::remember('home_testimonials', 3600, fn () =>
            Review::where('approved', true)
                ->whereNotNull('comment')
                ->where('rating', '>=', 4)
                ->with('professional:id,name,profession,main_city')
                ->orderByDesc('rating')
                ->orderByDesc('created_at')
                ->take(3)
                ->get(['id', 'client_name', 'rating', 'comment', 'professional_id', 'created_at'])
                ->toArray()
        );

        $geoData  = request()->attributes->get('geo');
        $detectedCity = request()->header('X-City')
            ?? (session()->has('geo.city') ? session('geo.city') : null);

        return Inertia::render('Frontend/HomePage', [
            'categories'   => $categories,
            'featured'     => $featured,
            'stats'        => $stats,
            'testimonials' => $testimonials,
            'geo'          => $detectedCity ? ['city' => $detectedCity, 'source' => $geoData['source'] ?? 'header'] : null,
            'seo' => [
                'title'       => 'Trouvez un professionnel en moins de 30 secondes',
                'description' => 'Plateforme marocaine de mise en relation clients et professionnels avec contact immédiat WhatsApp et appel.',
            ],
        ]);
    }
}
