<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use Illuminate\Http\Request;

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

        // Language filter — JSON_CONTAINS handles Unicode-escaped JSON correctly
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

        return response()->json($query->paginate((int) $request->input('per_page', 12)));
    }
}
