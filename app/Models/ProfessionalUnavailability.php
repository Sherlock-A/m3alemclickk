<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfessionalUnavailability extends Model
{
    protected $fillable = ['professional_id', 'from_date', 'to_date', 'reason'];

    protected $casts = [
        'from_date' => 'date',
        'to_date'   => 'date',
    ];

    public function professional(): BelongsTo
    {
        return $this->belongsTo(Professional::class);
    }
}
