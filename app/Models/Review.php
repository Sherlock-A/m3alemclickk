<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'professional_id',
        'user_id',
        'client_name',
        'rating',
        'comment',
        'approved',
        'verified_client',
        'ip',
        'pro_response',
        'pro_responded_at',
    ];

    protected function casts(): array
    {
        return [
            'approved'        => 'boolean',
            'verified_client' => 'boolean',
            'rating'          => 'integer',
        ];
    }

    public function professional(): BelongsTo
    {
        return $this->belongsTo(Professional::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
