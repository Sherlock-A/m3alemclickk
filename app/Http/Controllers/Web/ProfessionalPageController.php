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

        $paginated = $query->paginate(12)->withQueryString();

        // When filters return 0 results, suggest popular professionals nationally
        $suggestions = null;
        if ($paginated->total() === 0 && $request->hasAny(['city', 'profession', 'search', 'status', 'rating_min', 'language', 'lat'])) {
            $suggestions = Professional::approved()
                ->with(['category', 'categories'])
                ->orderByDesc('rating')
                ->take(6)
                ->get();
        }

        $availableCount = Cache::remember('available_pros_count', 300, fn () =>
            Professional::approved()->where('is_available', true)->count()
        );

        return Inertia::render('Frontend/ProfessionalsPage', [
            'professionals'  => $paginated,
            'suggestions'    => $suggestions,
            'available_count' => $availableCount,
            'filters'        => $request->only(['city', 'profession', 'search', 'sort', 'status', 'rating_min', 'language', 'lat', 'lon', 'radius_km']),
            'categories'     => Cache::remember('categories_active', 3600, fn () =>
                Category::where('active', true)->orderBy('sort_order')->get()
            ),
            'seo'            => [
                'title'       => 'Artisans & Professionnels au Maroc | Jobly',
                'description' => 'Trouvez le meilleur artisan au Maroc : plombier, électricien, menuisier, peintre et plus. Contact WhatsApp direct. Avis vérifiés. Devis gratuit.',
                'canonical'   => config('app.url') . '/professionals',
            ],
        ]);
    }

    // ── SEO Landing page helpers ──────────────────────────────────────────────

    private static function priceEstimate(string $catNorm): ?array
    {
        $prices = [
            'plomb'    => ['min' => 150,  'max' => 600,  'unit' => 'par intervention',    'label' => 'Plomberie'],
            'electri'  => ['min' => 200,  'max' => 800,  'unit' => 'par intervention',    'label' => 'Électricité'],
            'peintr'   => ['min' => 25,   'max' => 60,   'unit' => 'par m²',              'label' => 'Peinture'],
            'climati'  => ['min' => 800,  'max' => 3000, 'unit' => 'installation complète','label' => 'Climatisation'],
            'menuisi'  => ['min' => 300,  'max' => 2000, 'unit' => 'par projet',           'label' => 'Menuiserie'],
            'menage'   => ['min' => 100,  'max' => 250,  'unit' => 'par session',          'label' => 'Ménage'],
            'macon'    => ['min' => 300,  'max' => 1500, 'unit' => 'par m²',              'label' => 'Maçonnerie'],
            'carrel'   => ['min' => 150,  'max' => 400,  'unit' => 'par m²',              'label' => 'Carrelage'],
            'jardin'   => ['min' => 150,  'max' => 500,  'unit' => 'par session',          'label' => 'Jardinage'],
            'informati'=> ['min' => 150,  'max' => 500,  'unit' => 'par intervention',    'label' => 'Informatique'],
            'demena'   => ['min' => 500,  'max' => 3000, 'unit' => 'selon volume',         'label' => 'Déménagement'],
            'chauff'   => ['min' => 300,  'max' => 2000, 'unit' => 'selon travaux',        'label' => 'Chauffage'],
            'serrur'   => ['min' => 100,  'max' => 400,  'unit' => 'par intervention',    'label' => 'Serrurerie'],
            'nettoy'   => ['min' => 200,  'max' => 600,  'unit' => 'par session',          'label' => 'Nettoyage'],
        ];
        foreach ($prices as $key => $data) {
            if (str_contains($catNorm, $key) || str_starts_with($key, substr($catNorm, 0, 5))) {
                return $data;
            }
        }
        return null;
    }

    private static function faqData(string $catNorm, string $catTitle, string $cityTitle): array
    {
        $generic = [
            [
                'q' => "Comment trouver un {$catTitle} fiable à {$cityTitle} ?",
                'a' => "Sur Jobly, tous les {$catTitle}s à {$cityTitle} sont vérifiés par notre équipe. Consultez leurs avis clients et contactez-les directement sur WhatsApp ou par téléphone — sans intermédiaire, sans commission.",
            ],
            [
                'q' => "Est-ce gratuit de contacter un {$catTitle} sur Jobly ?",
                'a' => "Oui, Jobly est 100% gratuit pour les clients. Aucun frais d'inscription, aucune commission sur les travaux. Vous contactez l'artisan directement et négociez les tarifs avec lui.",
            ],
        ];

        $specific = match(true) {
            str_contains($catNorm, 'plomb') => [
                ['q' => "Quel est le tarif d'un plombier à {$cityTitle} ?",
                 'a' => "Le tarif d'un plombier à {$cityTitle} varie entre 150 et 600 MAD selon l'intervention. Un dépannage simple (fuite, robinet) coûte généralement 200–350 MAD. Une installation complète peut aller de 500 à 2 000 MAD. Demandez un devis avant toute intervention."],
                ['q' => "Un plombier intervient-il en urgence à {$cityTitle} ?",
                 'a' => "Plusieurs plombiers sur Jobly à {$cityTitle} proposent des interventions d'urgence, y compris le week-end. Filtrez par « Disponible maintenant » pour trouver un plombier immédiatement disponible."],
            ],
            str_contains($catNorm, 'electri') => [
                ['q' => "Combien coûte un électricien à {$cityTitle} ?",
                 'a' => "Le tarif d'un électricien à {$cityTitle} est généralement entre 200 et 800 MAD pour une intervention standard. Une mise aux normes complète peut dépasser 1 500 MAD. Comparez plusieurs devis via Jobly."],
                ['q' => "Faut-il un électricien certifié pour des travaux à {$cityTitle} ?",
                 'a' => "Pour des travaux d'installation ou de mise aux normes, faites appel à un électricien qualifié. Les professionnels Jobly à {$cityTitle} sont tous vérifiés et peuvent vous fournir les justificatifs nécessaires."],
            ],
            str_contains($catNorm, 'peintr') => [
                ['q' => "Quel est le prix de la peinture au m² à {$cityTitle} ?",
                 'a' => "Le prix d'un peintre à {$cityTitle} varie entre 25 et 60 MAD par m² (peinture intérieure, 2 couches). Comptez 40–80 MAD/m² pour des finitions spéciales (stucco, tableau noir, effet béton). Demandez un devis sur Jobly."],
                ['q' => "Combien de temps dure un chantier de peinture à {$cityTitle} ?",
                 'a' => "Un appartement de 70 m² prend généralement 2 à 4 jours pour un peintre expérimenté. Les professionnels Jobly à {$cityTitle} peuvent vous fournir un planning précis lors du devis."],
            ],
            str_contains($catNorm, 'menage') || str_contains($catNorm, 'nettoy') => [
                ['q' => "Combien coûte une femme de ménage à {$cityTitle} ?",
                 'a' => "Le tarif d'une aide ménagère à {$cityTitle} est généralement entre 100 et 250 MAD par session de 3-4h. Pour un ménage complet d'appartement, comptez 200–400 MAD. Certaines professionnelles proposent des forfaits mensuels."],
                ['q' => "Comment vérifier la fiabilité d'une aide ménagère à {$cityTitle} ?",
                 'a' => "Sur Jobly, chaque aide ménagère est vérifiée par notre équipe. Consultez les avis clients laissés par de vrais utilisateurs avant de prendre contact. La transparence est notre priorité."],
            ],
            str_contains($catNorm, 'climati') => [
                ['q' => "Quel est le prix d'installation d'un climatiseur à {$cityTitle} ?",
                 'a' => "L'installation d'un climatiseur à {$cityTitle} coûte entre 800 et 1 500 MAD pour un split system standard. Pour un système multi-split ou cassette de plafond, comptez 2 000–4 000 MAD. La maintenance annuelle est entre 200 et 400 MAD."],
                ['q' => "Quelle marque de climatiseur recommander pour {$cityTitle} ?",
                 'a' => "Les installateurs Jobly à {$cityTitle} travaillent avec les grandes marques (Daikin, Mitsubishi, LG, Samsung). Ils peuvent vous conseiller sur la puissance adaptée selon la superficie de votre pièce."],
            ],
            default => [
                ['q' => "Quels sont les tarifs pour {$catTitle} à {$cityTitle} ?",
                 'a' => "Les tarifs des {$catTitle}s à {$cityTitle} varient selon la complexité des travaux et l'expérience du professionnel. Utilisez Jobly pour comparer plusieurs devis gratuits et choisir l'offre qui correspond à votre budget."],
                ['q' => "Faut-il demander un devis avant de faire appel à un {$catTitle} à {$cityTitle} ?",
                 'a' => "Oui, nous recommandons toujours de demander un devis détaillé avant toute intervention. Sur Jobly, vous pouvez envoyer une demande de devis directement depuis le profil de chaque {$catTitle} à {$cityTitle}."],
            ],
        };

        return array_merge($specific, $generic);
    }

    private static function relatedCities(string $currentCity, string $category): array
    {
        $topCities = ['casablanca', 'rabat', 'marrakech', 'fes', 'tanger', 'agadir', 'meknes', 'oujda', 'kenitra', 'tetouan'];
        $base      = config('app.url');
        $catEnc    = rawurlencode($category);
        $result    = [];
        foreach ($topCities as $c) {
            if (self::norm($c) !== self::norm($currentCity)) {
                $result[] = [
                    'city'  => ucfirst($c),
                    'url'   => "{$base}/professionnels/{$c}/{$catEnc}",
                ];
            }
        }
        return array_slice($result, 0, 8);
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

        $landing = null;
        if ($category) {
            $catNorm  = self::norm($category);
            $faqs     = self::faqData($catNorm, $category, $cityTitle);
            $price    = self::priceEstimate($catNorm);
            $related  = self::relatedCities($city, $category);
            $faqSchema = [
                '@context'   => 'https://schema.org',
                '@type'      => 'FAQPage',
                'mainEntity' => array_map(fn($item) => [
                    '@type'          => 'Question',
                    'name'           => $item['q'],
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['a']],
                ], $faqs),
            ];
            $landing = [
                'faqs'      => $faqs,
                'price'     => $price,
                'related'   => $related,
                'faqSchema' => json_encode($faqSchema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ];
        }

        return Inertia::render('Frontend/ProfessionalsPage', [
            'professionals' => $professionals,
            'filters'       => array_filter(['city' => $city, 'profession' => $category]),
            'categories'    => Cache::remember('categories_active', 3600, fn () =>
                Category::where('active', true)->orderBy('sort_order')->get()
            ),
            'landing' => $landing,
            'seo' => [
                'title'       => $seoTitle,
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

        $reviewCount  = $professional->reviews->count();
        $ratingValue  = $professional->rating > 0 ? $professional->rating : null;
        $seoTitle     = "{$professional->name} — {$professional->profession} à {$professional->main_city}";
        $seoDesc      = $professional->description
            ? str($professional->description)->limit(155)->toString()
            : "{$professional->name}, {$professional->profession} professionnel à {$professional->main_city}. Contact WhatsApp direct, avis vérifiés. Trouvez votre artisan sur Jobly.";

        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type'    => 'LocalBusiness',
            'name'     => "{$professional->name} — {$professional->profession}",
            'description' => $seoDesc,
            'url'      => config('app.url') . "/professionals/{$professional->slug}",
            'image'    => $professional->photo ?: null,
            'telephone' => $professional->phone ?: null,
            'address'  => [
                '@type'           => 'PostalAddress',
                'addressLocality' => $professional->main_city,
                'addressRegion'   => $professional->main_city,
                'addressCountry'  => 'MA',
            ],
            'areaServed' => array_filter(array_merge(
                [$professional->main_city],
                is_array($professional->travel_cities) ? $professional->travel_cities : []
            )),
            'priceRange' => '$$',
        ];

        if ($ratingValue && $reviewCount > 0) {
            $jsonLd['aggregateRating'] = [
                '@type'       => 'AggregateRating',
                'ratingValue' => round($ratingValue, 1),
                'reviewCount' => $reviewCount,
                'bestRating'  => 5,
                'worstRating' => 1,
            ];

            $jsonLd['review'] = $professional->reviews->take(3)->map(fn ($r) => [
                '@type'       => 'Review',
                'author'      => ['@type' => 'Person', 'name' => $r->client_name],
                'reviewRating' => ['@type' => 'Rating', 'ratingValue' => $r->rating, 'bestRating' => 5],
                'reviewBody'  => $r->comment,
            ])->toArray();
        }

        return Inertia::render('Frontend/ProfessionalShowPage', [
            'professional' => $professional,
            'similar'      => $similar,
            'seo'          => [
                'title'     => $seoTitle,
                'description' => $seoDesc,
                'canonical' => config('app.url') . "/professionals/{$professional->slug}",
                'image'     => $professional->photo ?: null,
                'jsonLd'    => json_encode($jsonLd, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ],
        ]);
    }
}
