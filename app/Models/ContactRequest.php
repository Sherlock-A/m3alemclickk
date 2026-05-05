<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactRequest extends Model
{
    protected $fillable = [
        'professional_id',
        'client_name',
        'client_email',
        'client_phone',
        'subject',
        'message',
        'status',
    ];

    public function professional(): BelongsTo
    {
        return $this->belongsTo(Professional::class);
    }
}
