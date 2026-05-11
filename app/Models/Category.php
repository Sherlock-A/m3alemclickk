<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Category extends Model
{
    use HasSlug;

    protected $fillable = ['name', 'slug', 'icon', 'description', 'sort_order', 'active', 'translations'];

    protected function casts(): array
    {
        return [
            'active'       => 'boolean',
            'translations' => 'array',
        ];
    }

    public function getTranslation(string $lang = 'fr'): string
    {
        $translations = $this->translations ?? [];
        return $translations[$lang] ?? $this->name;
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()->generateSlugsFrom('name')->saveSlugsTo('slug');
    }

    public function professionals(): HasMany
    {
        return $this->hasMany(Professional::class);
    }
}
