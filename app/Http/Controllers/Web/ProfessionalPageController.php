<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Professional;
use App\Models\Tracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProfessionalPageController extends Controller
{
    public function index(Request $request)
    {
        $query = Professional::approved()->with('category');

        if ($city = $request->string('city')->toString()) {
            $cityLower = mb_strtolower($city, 'UTF-8');
            $query->where(function ($q) use ($cityLower) {
                $q->whereRaw('LOWER(main_city) LIKE ?', ["%{$cityLower}%"])
                  ->orWhereRaw('LOWER(travel_cities) LIKE ?', ["%{$cityLower}%"]);
            });
        }

        if ($profession = $request->string('profession')->toString()) {
            $professionLower = mb_strtolower($profession, 'UTF-8');
            $query->whereRaw('LOWER(profession) LIKE ?', ["%{$professionLower}%"]);
        }

        if ($search = $request->string('search')->toString()) {
            $searchLower = mb_strtolower($search, 'UTF-8');
            $query->where(function ($q) use ($searchLower) {
                $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(profession) LIKE ?', ["%{$searchLower}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$searchLower}%"]);
            });
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($request->filled('rating_min')) {
            $query->where('rating', '>=', (float) $request->input('rating_min'));
        }

        if ($request->filled('language')) {
            $lang = $request->string('language')->toString();
            $query->whereRaw('JSON_CONTAINS(languages, JSON_QUOTE(?))', [$lang]);
        }

        $sort = $request->string('sort')->toString() ?: 'latest';
        match ($sort) {
            'rating'  => $query->orderByDesc('rating'),
            'popular' => $query->orderByDesc('views'),
            default   => $query->latest(),
        };

        return Inertia::render('Frontend/ProfessionalsPage', [
            'professionals' => $query->paginate(12)->withQueryString(),
            'filters'       => $request->only(['city', 'profession', 'search', 'sort', 'status', 'rating_min', 'language']),
            'categories'    => Cache::remember('categories_active', 3600, fn () =>
                Category::where('active', true)->orderBy('sort_order')->get()
            ),
            'seo'           => [
                'title'       => 'Professionnels',
                'description' => 'Explorez les meilleurs professionnels du Maroc par ville, métier et disponibilité.',
            ],
        ]);
    }

    public function show(string $slug)
    {
        $professional = Professional::approved()
            ->with(['reviews' => fn ($q) => $q->where('approved', true)->latest(), 'category'])
            ->where('slug', $slug)
            ->firstOrFail();

        $professional->increment('views');

        Tracking::create([
            'professional_id' => $professional->id,
            'type'            => 'view',
            'ip'              => request()->ip(),
            'city'            => request()->attributes->get('geo.city', 'Casablanca'),
            'meta'            => ['ua' => request()->userAgent()],
        ]);

        return Inertia::render('Frontend/ProfessionalShowPage', [
            'professional' => $professional,
            'seo'          => [
                'title'       => "{$professional->name} - {$professional->profession}",
                'description' => str($professional->description)->limit(150)->toString(),
            ],
        ]);
    }
}
