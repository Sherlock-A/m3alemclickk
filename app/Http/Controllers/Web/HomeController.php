<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Professional;
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
            'professionals' => Professional::approved()->count(),
            'verified'      => Professional::approved()->where('verified', true)->count(),
            'missions'      => Professional::approved()->sum('completed_missions'),
            'cities'        => Professional::approved()->distinct('main_city')->count('main_city'),
        ]);

        $geoData  = request()->attributes->get('geo');
        $detectedCity = request()->header('X-City')
            ?? (session()->has('geo.city') ? session('geo.city') : null);

        return Inertia::render('Frontend/HomePage', [
            'categories' => $categories,
            'featured'   => $featured,
            'stats'      => $stats,
            'geo'        => $detectedCity ? ['city' => $detectedCity, 'source' => $geoData['source'] ?? 'header'] : null,
            'seo' => [
                'title'       => 'Trouvez un professionnel en moins de 30 secondes',
                'description' => 'Plateforme marocaine de mise en relation clients et professionnels avec contact immédiat WhatsApp et appel.',
            ],
        ]);
    }
}
