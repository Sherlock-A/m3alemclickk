<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CityController extends Controller
{
    // GET /api/cities — public, no auth
    public function publicIndex()
    {
        $cities = Cache::remember('public_cities', 3600, fn () =>
            City::active()->orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'name_ar', 'region'])
        );
        return response()->json($cities);
    }

    // GET /api/cities/autocomplete?q=casa
    public function autocomplete(Request $request)
    {
        $q = strtolower($request->string('q')->toString());
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $cities = City::active()
            ->whereRaw('LOWER(name) LIKE ?', ["{$q}%"])
            ->orWhereRaw('LOWER(name) LIKE ?', ["%{$q}%"])
            ->orderByRaw("CASE WHEN LOWER(name) LIKE ? THEN 0 ELSE 1 END", ["{$q}%"])
            ->orderBy('sort_order')
            ->limit(8)
            ->pluck('name');

        return response()->json($cities);
    }

    // GET /api/admin/cities
    public function index()
    {
        $cities = City::orderBy('sort_order')->orderBy('name')->get();
        return response()->json($cities);
    }

    // POST /api/admin/cities
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'max:100', 'unique:cities,name'],
            'name_ar'    => ['nullable', 'string', 'max:100'],
            'name_en'    => ['nullable', 'string', 'max:100'],
            'region'     => ['nullable', 'string', 'max:100'],
            'latitude'   => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'  => ['nullable', 'numeric', 'between:-180,180'],
            'active'     => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $city = City::create($data);
        Cache::forget('public_cities');

        return response()->json(['message' => 'Ville créée avec succès.', 'city' => $city], 201);
    }

    // GET /api/admin/cities/{id}
    public function show(City $city)
    {
        return response()->json(['city' => $city]);
    }

    // PUT /api/admin/cities/{id}
    public function update(Request $request, City $city)
    {
        $data = $request->validate([
            'name'       => ['sometimes', 'string', 'max:100', 'unique:cities,name,' . $city->id],
            'name_ar'    => ['nullable', 'string', 'max:100'],
            'name_en'    => ['nullable', 'string', 'max:100'],
            'region'     => ['nullable', 'string', 'max:100'],
            'latitude'   => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'  => ['nullable', 'numeric', 'between:-180,180'],
            'active'     => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $city->update($data);
        Cache::forget('public_cities');

        return response()->json(['message' => 'Ville mise à jour.', 'city' => $city]);
    }

    // DELETE /api/admin/cities/{id}
    public function destroy(City $city)
    {
        $city->delete();
        Cache::forget('public_cities');

        return response()->json(['message' => 'Ville supprimée.']);
    }
}
