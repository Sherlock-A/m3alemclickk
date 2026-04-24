<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'professional_id',
        'status', 'rejection_reason', 'google_id',
        'phone_otp', 'phone_otp_expires_at', 'phone_verified_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at'    => 'datetime',
            'phone_otp_expires_at' => 'datetime',
            'phone_verified_at'    => 'datetime',
            'password'             => 'hashed',
        ];
    }

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }

    // ─── Role helpers ─────────────────────────────────────────────────────────
    public function isAdmin(): bool        { return $this->role === 'admin'; }
    public function isProfessional(): bool { return $this->role === 'professional'; }
    public function isClient(): bool       { return $this->role === 'client'; }

    // ─── Status helpers ───────────────────────────────────────────────────────
    public function isActive(): bool    { return $this->status === 'active'; }
    public function isPending(): bool   { return $this->status === 'pending'; }
    public function isRefused(): bool   { return $this->status === 'refused'; }
    public function isSuspended(): bool { return $this->status === 'suspended'; }

    public function getStatusBadge(): array
    {
        return match ($this->status) {
            'pending'   => ['class' => 'bg-yellow-100 text-yellow-700', 'label' => 'En attente'],
            'active'    => ['class' => 'bg-green-100 text-green-700',   'label' => 'Actif'],
            'refused'   => ['class' => 'bg-red-100 text-red-700',       'label' => 'Refusé'],
            'suspended' => ['class' => 'bg-gray-100 text-gray-700',     'label' => 'Suspendu'],
            default     => ['class' => 'bg-gray-100 text-gray-600',     'label' => 'Inconnu'],
        };
    }

    // ─── Phone OTP ────────────────────────────────────────────────────────────
    public function isPhoneVerified(): bool { return $this->phone_verified_at !== null; }

    public function generatePhoneOtp(): string
    {
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->update([
            'phone_otp'            => $otp,
            'phone_otp_expires_at' => now()->addMinutes(15),
        ]);
        return $otp;
    }

    // ─── JWT ──────────────────────────────────────────────────────────────────
    public function getJWTIdentifier()        { return $this->getKey(); }
    public function getJWTCustomClaims(): array { return ['role' => $this->role]; }
}
