<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'professional_id',
        'client_name',
        'rating',
        'comment',
        'approved',
        'ip',
        'pro_response',
        'pro_responded_at',
    ];

    protected function casts(): array
    {
        return [
            'approved' => 'boolean',
            'rating' => 'integer',
        ];
    }

    public function professional(): BelongsTo
    {
        return $this->belongsTo(Professional::class);
    }
}
