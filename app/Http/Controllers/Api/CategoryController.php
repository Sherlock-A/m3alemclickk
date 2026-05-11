<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::withCount('professionals')->orderBy('sort_order')->orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:100', 'unique:categories,name'],
            'icon'         => ['nullable', 'string', 'max:20'],
            'description'  => ['nullable', 'string', 'max:500'],
            'sort_order'   => ['integer', 'min:0'],
            'active'       => ['boolean'],
            'translations' => ['nullable', 'array'],
            'translations.fr' => ['nullable', 'string', 'max:100'],
            'translations.ar' => ['nullable', 'string', 'max:100'],
            'translations.en' => ['nullable', 'string', 'max:100'],
            'translations.dz' => ['nullable', 'string', 'max:100'],
        ]);

        $data['slug'] = Str::slug($data['name']);

        // Auto-fill missing translations with name
        if (!isset($data['translations']['fr']) || empty($data['translations']['fr'])) {
            $data['translations']['fr'] = $data['name'];
        }

        $category = Category::create($data);
        Cache::forget('categories_active');

        return response()->json(['success' => true, 'category' => $category], 201);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name'         => ['sometimes', 'string', 'max:100', 'unique:categories,name,' . $category->id],
            'icon'         => ['nullable', 'string', 'max:20'],
            'description'  => ['nullable', 'string', 'max:500'],
            'sort_order'   => ['integer', 'min:0'],
            'active'       => ['boolean'],
            'translations' => ['nullable', 'array'],
            'translations.fr' => ['nullable', 'string', 'max:100'],
            'translations.ar' => ['nullable', 'string', 'max:100'],
            'translations.en' => ['nullable', 'string', 'max:100'],
            'translations.dz' => ['nullable', 'string', 'max:100'],
        ]);

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Merge translations with existing ones (partial update)
        if (isset($data['translations'])) {
            $existing = $category->translations ?? [];
            $data['translations'] = array_merge($existing, array_filter($data['translations'], fn($v) => $v !== null && $v !== ''));
        }

        $category->update($data);
        Cache::forget('categories_active');

        return response()->json(['success' => true, 'category' => $category->fresh()]);
    }

    public function destroy(Category $category)
    {
        if ($category->professionals()->count() > 0) {
            return response()->json(['message' => 'Impossible de supprimer une catégorie avec des professionnels.'], 422);
        }
        $category->delete();
        Cache::forget('categories_active');
        return response()->json(['success' => true]);
    }
}
