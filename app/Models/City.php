<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'name_ar',
        'name_en',
        'region',
        'latitude',
        'longitude',
        'active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'active'    => 'boolean',
            'latitude'  => 'float',
            'longitude' => 'float',
            'sort_order'=> 'integer',
        ];
    }

    // Scope pour les villes actives
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
