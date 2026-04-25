<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProfessionalController extends Controller
{
    public function index(Request $request)
    {
        $query = Professional::approved()->with('category');

        foreach (['city', 'profession', 'status', 'search'] as $filter) {
            if (! $request->filled($filter)) {
                continue;
            }

            $value = $request->string($filter)->toString();

            $valueLower = mb_strtolower($value, 'UTF-8');

            if ($filter === 'city') {
                $query->where(function ($q) use ($valueLower) {
                    $q->whereRaw('LOWER(main_city) LIKE ?', ["%{$valueLower}%"])
                      ->orWhereRaw('LOWER(travel_cities) LIKE ?', ["%{$valueLower}%"]);
                });
            } elseif ($filter === 'search') {
                $query->where(function ($q) use ($valueLower) {
                    $q->whereRaw('LOWER(name) LIKE ?', ["%{$valueLower}%"])
                      ->orWhereRaw('LOWER(profession) LIKE ?', ["%{$valueLower}%"])
                      ->orWhereRaw('LOWER(description) LIKE ?', ["%{$valueLower}%"]);
                });
            } else {
                $query->whereRaw("LOWER({$filter}) LIKE ?", ["%{$valueLower}%"]);
            }
        }

        // Rating minimum filter
        if ($request->filled('rating_min')) {
            $query->where('rating', '>=', (float) $request->input('rating_min'));
        }

        // Language filter — LIKE used for SQLite/MySQL compatibility
        if ($request->filled('language')) {
            $lang = mb_strtolower($request->string('language')->toString(), 'UTF-8');
            $query->whereRaw('LOWER(languages) LIKE ?', ['%'.$lang.'%']);
        }

        $sort = $request->string('sort')->toString() ?: 'latest';
        match ($sort) {
            'rating'  => $query->orderByDesc('rating'),
            'popular' => $query->orderByDesc('views'),
            default   => $query->latest(),
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
