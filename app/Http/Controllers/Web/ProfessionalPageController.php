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
            ->with('category')
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
