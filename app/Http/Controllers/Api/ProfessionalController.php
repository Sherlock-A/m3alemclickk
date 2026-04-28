<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProfessionalController extends Controller
{
    // Remove diacritics + lowercase — normalizes both user input and DB values
    private static function norm(string $s): string
    {
        $from = ['é','è','ê','ë','à','â','ä','ô','ö','ù','û','ü','î','ï','ç',
                 'É','È','Ê','Ë','À','Â','Ä','Ô','Ö','Ù','Û','Ü','Î','Ï','Ç'];
        $to   = ['e','e','e','e','a','a','a','o','o','u','u','u','i','i','c',
                 'e','e','e','e','a','a','a','o','o','u','u','u','i','i','c'];
        return mb_strtolower(str_replace($from, $to, $s), 'UTF-8');
    }

    // Expand a normalized query into related root terms for fuzzy matching
    private static function synonyms(string $norm): array
    {
        $map = [
            'plomberie'     => ['plomb'],
            'electricite'   => ['electri'],
            'electricien'   => ['electri'],
            'menage'        => ['menage', 'femme de menage', 'nettoyage'],
            'nettoyage'     => ['menage', 'nettoyage'],
            'demenagement'  => ['demena'],
            'demenageur'    => ['demena'],
            'informatique'  => ['informati'],
            'maconnerie'    => ['macon'],
            'serrurerie'    => ['serrur'],
            'jardinage'     => ['jardin'],
            'menuiserie'    => ['menuisi'],
            'peinture'      => ['peintr'],
            'soudure'       => ['soud'],
            'climatisation' => ['climati', 'froid'],
            'carrelage'     => ['carrel'],
            'vitrerie'      => ['vitr'],
            'chauffage'     => ['chauff'],
            'coiffure'      => ['coiff'],
            'photographie'  => ['photo'],
            'decoration'    => ['decor'],
            'charpenterie'  => ['charpen'],
        ];

        if (isset($map[$norm])) {
            return array_unique(array_merge([$norm], $map[$norm]));
        }
        // prefix match (e.g. "electri" matches "electricite" key)
        foreach ($map as $key => $aliases) {
            if (str_starts_with($key, $norm) || str_starts_with($norm, $key)) {
                return array_unique(array_merge([$norm], $aliases));
            }
        }
        return [$norm];
    }

    public function index(Request $request)
    {
        // Join categories once so every filter can search in category name too
        $query = Professional::approved()
            ->with('category')
            ->leftJoin('categories', 'professionals.category_id', '=', 'categories.id')
            ->select('professionals.*');

        // ── City ──────────────────────────────────────────────────────────────
        if ($request->filled('city')) {
            $city = self::norm($request->string('city')->toString());
            $query->where(function ($q) use ($city) {
                $q->whereRaw('LOWER(professionals.main_city) LIKE ?',   ["%{$city}%"])
                  ->orWhereRaw('LOWER(professionals.travel_cities) LIKE ?', ["%{$city}%"]);
            });
        }

        // ── Profession (category chip click from homepage) ─────────────────
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

        // ── Status ────────────────────────────────────────────────────────────
        if ($request->filled('status')) {
            $status = mb_strtolower($request->string('status')->toString(), 'UTF-8');
            $query->whereRaw('LOWER(professionals.status) LIKE ?', ["%{$status}%"]);
        }

        // ── General search (search box: name / profession / desc / category) ─
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

        // ── Rating minimum ────────────────────────────────────────────────────
        if ($request->filled('rating_min')) {
            $query->where('professionals.rating', '>=', (float) $request->input('rating_min'));
        }

        // ── Language ──────────────────────────────────────────────────────────
        if ($request->filled('language')) {
            $lang = self::norm($request->string('language')->toString());
            $query->whereRaw('LOWER(professionals.languages) LIKE ?', ["%{$lang}%"]);
        }

        $sort = $request->string('sort')->toString() ?: 'latest';
        match ($sort) {
            'rating'  => $query->orderByDesc('professionals.rating'),
            'popular' => $query->orderByDesc('professionals.views'),
            default   => $query->orderByDesc('professionals.created_at'),
        };

        $hasFilters = $request->hasAny(['city', 'profession', 'status', 'search', 'language', 'rating_min', 'sort']);
        $perPage    = (int) $request->input('per_page', 12);
        $page       = (int) $request->input('page', 1);

        if ($hasFilters) {
            return response()->json($query->paginate($perPage));
        }

        $cacheKey = "pros_p{$page}_pp{$perPage}";
        return response()->json(
            Cache::remember($cacheKey, 60, fn () => $query->paginate($perPage))
        );
    }
}
