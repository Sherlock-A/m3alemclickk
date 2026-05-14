<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class CategoryPageController extends Controller
{
    public function __invoke()
    {
        $categories = Cache::remember('categories_page_all', 3600, fn () =>
            Category::where('active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'icon', 'translations', 'sort_order'])
        );

        return Inertia::render('Frontend/CategoriesPage', [
            'categories' => $categories,
            'seo' => [
                'title'       => 'Toutes les catégories — jobly.ma',
                'description' => 'Trouvez le bon professionnel par catégorie : plomberie, électricité, peinture, décoration et 60+ métiers au Maroc.',
            ],
        ]);
    }
}
