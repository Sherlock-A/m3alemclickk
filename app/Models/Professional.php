<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Professional extends Model
{
    use HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'phone',
        'profession',
        'category_id',
        'main_city',
        'travel_cities',
        'languages',
        'description',
        'photo',
        'portfolio',
        'status',
        'views',
        'whatsapp_clicks',
        'calls',
        'rating',
        'verified',
        'completed_missions',
        'is_available',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'travel_cities' => 'array',
            'portfolio'     => 'array',
            'verified'      => 'boolean',
            'is_available'  => 'boolean',
            'rating'        => 'float',
            'latitude'      => 'float',
            'longitude'     => 'float',
        ];
    }

    // Store languages/travel_cities with unescaped unicode so JSON_CONTAINS works
    protected function languages(): Attribute
    {
        return Attribute::make(
            get: fn ($v) => json_decode($v, true) ?? [],
            set: fn ($v) => json_encode($v, JSON_UNESCAPED_UNICODE),
        );
    }

    protected function travelCities(): Attribute
    {
        return Attribute::make(
            get: fn ($v) => json_decode($v, true) ?? [],
            set: fn ($v) => json_encode($v, JSON_UNESCAPED_UNICODE),
        );
    }

    protected function portfolio(): Attribute
    {
        return Attribute::make(
            get: fn ($v) => $v ? (json_decode($v, true) ?? []) : [],
            set: fn ($v) => json_encode($v, JSON_UNESCAPED_UNICODE),
        );
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()->generateSlugsFrom(['name', 'profession'])->saveSlugsTo('slug');
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(User::class, 'professional_id');
    }

    public function scopeApproved($query)
    {
        return $query->whereHas('user', fn($q) => $q->where('status', 'active'));
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function trackings(): HasMany
    {
        return $this->hasMany(Tracking::class);
    }
}
