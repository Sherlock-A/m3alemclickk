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
    // Normalise : supprime accents + minuscules
    private static function norm(string $s): string
    {
        $from = ['é','è','ê','ë','à','â','ä','ô','ö','ù','û','ü','î','ï','ç',
                 'É','È','Ê','Ë','À','Â','Ä','Ô','Ö','Ù','Û','Ü','Î','Ï','Ç'];
        $to   = ['e','e','e','e','a','a','a','o','o','u','u','u','i','i','c',
                 'e','e','e','e','a','a','a','o','o','u','u','u','i','i','c'];
        return mb_strtolower(str_replace($from, $to, $s), 'UTF-8');
    }

    // Catégorie → racines métier ET métier → catégorie (bidirectionnel)
    private static function synonyms(string $norm): array
    {
        $map = [
            // catégories → termes métier
            'plomberie'     => ['plomb'],
            'electricite'   => ['electri'],
            'peinture'      => ['peintr'],
            'climatisation' => ['climati', 'froid', 'hvac'],
            'menuiserie'    => ['menuisi', 'charpen'],
            'menage'        => ['menage', 'femme de menage'],
            'maconnerie'    => ['macon'],
            'serrurerie'    => ['serrur'],
            'jardinage'     => ['jardin', 'paysag'],
            'informatique'  => ['informati', 'tech info', 'reseau'],
            'demenagement'  => ['demena'],
            'soudure'       => ['soud', 'metal'],
            'carrelage'     => ['carrel', 'faien'],
            'vitrerie'      => ['vitr', 'miroir'],
            'chauffage'     => ['chauff', 'chaudiere'],
            'decoration'    => ['decor', 'design'],
            'nettoyage'     => ['nettoy', 'menage'],
            'charpenterie'  => ['charpen', 'couvreur'],
            'coiffure'      => ['coiff'],
            'photographie'  => ['photo'],
            // métiers → racine (pour saisie inversée)
            'plombier'      => ['plomb'],
            'electricien'   => ['electri'],
            'peintre'       => ['peintr'],
            'macon'         => ['macon'],
            'serrurier'     => ['serrur'],
            'jardinier'     => ['jardin'],
            'demenageur'    => ['demena'],
            'soudeur'       => ['soud'],
            'carreleur'     => ['carrel'],
            'vitrier'       => ['vitr'],
            'chauffagiste'  => ['chauff'],
            'decorateur'    => ['decor'],
            'coiffeur'      => ['coiff'],
            'photographe'   => ['photo'],
            'menuisier'     => ['menuisi'],
            'charpentier'   => ['charpen'],
        ];

        if (isset($map[$norm])) {
            return array_unique(array_merge([$norm], $map[$norm]));
        }
        foreach ($map as $key => $aliases) {
            if (str_starts_with($key, $norm) || str_starts_with($norm, $key)) {
                return array_unique(array_merge([$norm], $aliases));
            }
        }
        return [$norm];
    }

    public function index(Request $request)
    {
        $query = Professional::approved()
            ->with(['category', 'categories'])
            ->leftJoin('categories', 'professionals.category_id', '=', 'categories.id')
            ->select('professionals.*');

        if ($request->filled('city')) {
            $city = self::norm($request->string('city')->toString());
            $query->where(function ($q) use ($city) {
                $q->whereRaw('LOWER(professionals.main_city) LIKE ?',     ["%{$city}%"])
                  ->orWhereRaw('LOWER(professionals.travel_cities) LIKE ?', ["%{$city}%"]);
            });
        }

        if ($request->filled('profession')) {
            $prof  = self::norm($request->string('profession')->toString());
            $terms = self::synonyms($prof);
            $query->where(function ($q) use ($prof, $terms) {
                $q->whereRaw('LOWER(professionals.profession) LIKE ?', ["%{$prof}%"])
                  ->orWhereRaw('LOWER(categories.name) LIKE ?',        ["%{$prof}%"]);
                foreach ($terms as $t) {
                    if ($t !== $prof) {
                        $q->orWhereRaw('LOWER(professionals.profession) LIKE ?', ["%{$t}%"])
                          ->orWhereRaw('LOWER(categories.name) LIKE ?',          ["%{$t}%"]);
                    }
                }
            });
        }

        if ($request->filled('search')) {
            $norm  = self::norm($request->string('search')->toString());
            $terms = self::synonyms($norm);
            $query->where(function ($q) use ($norm, $terms) {
                $q->whereRaw('LOWER(professionals.name) LIKE ?',         ["%{$norm}%"])
                  ->orWhereRaw('LOWER(professionals.profession) LIKE ?', ["%{$norm}%"])
                  ->orWhereRaw('LOWER(professionals.description) LIKE ?',["%{$norm}%"])
                  ->orWhereRaw('LOWER(categories.name) LIKE ?',          ["%{$norm}%"]);
                foreach ($terms as $t) {
                    if ($t !== $norm) {
                        $q->orWhereRaw('LOWER(professionals.profession) LIKE ?', ["%{$t}%"])
                          ->orWhereRaw('LOWER(categories.name) LIKE ?',          ["%{$t}%"]);
                    }
                }
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

        // ── Geo radius "près de moi" ──────────────────────────────────────────
        $geoApplied = false;
        if ($request->filled('lat') && $request->filled('lon')) {
            $lat    = (float) $request->input('lat');
            $lon    = (float) $request->input('lon');
            $radius = max(1, min(500, (int) $request->input('radius_km', 50)));

            $haversine = '( 6371 * acos( cos(radians(?)) * cos(radians(professionals.latitude))
                          * cos(radians(professionals.longitude) - radians(?))
                          + sin(radians(?)) * sin(radians(professionals.latitude)) ) )';

            $query
                ->whereNotNull('professionals.latitude')
                ->whereNotNull('professionals.longitude')
                ->selectRaw("{$haversine} AS distance", [$lat, $lon, $lat])
                ->havingRaw("{$haversine} <= ?", [$lat, $lon, $lat, $radius])
                ->orderByRaw("{$haversine} ASC", [$lat, $lon, $lat]);

            $geoApplied = true;
        }

        if (! $geoApplied) {
            $sort = $request->string('sort')->toString() ?: 'latest';
            match ($sort) {
                'rating'  => $query->orderByDesc('rating'),
                'popular' => $query->orderByDesc('views'),
                default   => $query->latest(),
            };
        }

        return Inertia::render('Frontend/ProfessionalsPage', [
            'professionals' => $query->paginate(12)->withQueryString(),
            'filters'       => $request->only(['city', 'profession', 'search', 'sort', 'status', 'rating_min', 'language', 'lat', 'lon', 'radius_km']),
            'categories'    => Cache::remember('categories_active', 3600, fn () =>
                Category::where('active', true)->orderBy('sort_order')->get()
            ),
            'seo'           => [
                'title'       => 'Professionnels',
                'description' => 'Explorez les meilleurs professionnels du Maroc par ville, métier et disponibilité.',
            ],
        ]);
    }

    public function byCity(Request $request, string $city, ?string $category = null)
    {
        // Merge URL segments into request so the shared index() logic applies
        $request->merge(array_filter([
            'city'       => $city,
            'profession' => $category,
        ]));

        $query = Professional::approved()
            ->with(['category', 'categories'])
            ->leftJoin('categories', 'professionals.category_id', '=', 'categories.id')
            ->select('professionals.*');

        $cityNorm = self::norm($city);
        $query->where(function ($q) use ($cityNorm) {
            $q->whereRaw('LOWER(professionals.main_city) LIKE ?',       ["%{$cityNorm}%"])
              ->orWhereRaw('LOWER(professionals.travel_cities) LIKE ?', ["%{$cityNorm}%"]);
        });

        if ($category) {
            $prof  = self::norm($category);
            $terms = self::synonyms($prof);
            $query->where(function ($q) use ($prof, $terms) {
                $q->whereRaw('LOWER(professionals.profession) LIKE ?', ["%{$prof}%"])
                  ->orWhereRaw('LOWER(categories.name) LIKE ?',        ["%{$prof}%"]);
                foreach ($terms as $t) {
                    if ($t !== $prof) {
                        $q->orWhereRaw('LOWER(professionals.profession) LIKE ?', ["%{$t}%"])
                          ->orWhereRaw('LOWER(categories.name) LIKE ?',          ["%{$t}%"]);
                    }
                }
            });
        }

        $query->orderByDesc('professionals.rating');

        $professionals = $query->paginate(12)->withQueryString();
        $total         = $professionals->total();

        $cityTitle = ucfirst($city);
        $catTitle  = $category ? ucfirst($category) . 's' : 'Professionnels';
        $seoTitle  = "{$catTitle} à {$cityTitle}";
        $seoDesc   = "Trouvez les meilleurs {$catTitle} à {$cityTitle} au Maroc. {$total} professionnel" . ($total > 1 ? 's' : '') . " disponible" . ($total > 1 ? 's' : '') . ". Contact WhatsApp direct, avis vérifiés.";

        $canonicalPath = '/professionnels/' . rawurlencode($city) . ($category ? '/' . rawurlencode($category) : '');

        return Inertia::render('Frontend/ProfessionalsPage', [
            'professionals' => $professionals,
            'filters'       => array_filter(['city' => $city, 'profession' => $category]),
            'categories'    => Cache::remember('categories_active', 3600, fn () =>
                Category::where('active', true)->orderBy('sort_order')->get()
            ),
            'seo' => [
                'title'     => $seoTitle,
                'description' => $seoDesc,
                'canonical'   => config('app.url') . $canonicalPath,
                'h1'          => $seoTitle,
            ],
        ]);
    }

    public function show(string $slug)
    {
        $professional = Professional::approved()
            ->with([
                'reviews'          => fn ($q) => $q->where('approved', true)->latest(),
                'category',
                'categories',
                'unavailabilities' => fn ($q) => $q->where('to_date', '>=', now()->toDateString())->orderBy('from_date'),
            ])
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

        // Similar professionals (same category or same city, excluding current)
        $similar = Professional::approved()
            ->with('category')
            ->where('id', '!=', $professional->id)
            ->where(function ($q) use ($professional) {
                $q->where('category_id', $professional->category_id)
                  ->orWhereRaw('LOWER(main_city) = LOWER(?)', [$professional->main_city]);
            })
            ->orderByDesc('rating')
            ->take(3)
            ->get(['id', 'name', 'slug', 'profession', 'photo', 'main_city', 'rating', 'is_available', 'verified', 'category_id']);

        return Inertia::render('Frontend/ProfessionalShowPage', [
            'professional' => $professional,
            'similar'      => $similar,
            'seo'          => [
                'title'       => "{$professional->name} - {$professional->profession}",
                'description' => str($professional->description)->limit(150)->toString(),
            ],
        ]);
    }
}
