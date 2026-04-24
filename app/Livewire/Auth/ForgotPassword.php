<?php

namespace App\Livewire\Auth;

use App\Mail\PhoneOtp;
use App\Models\Professional;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Livewire\Component;

class ForgotPassword extends Component
{
    public string $step     = 'phone'; // phone → otp → password
    public string $phone    = '';
    public string $otp      = '';
    public string $password = '';
    public string $password_confirmation = '';

    // Step 1: Validate phone & send OTP
    public function sendOtp(): void
    {
        $this->validate(['phone' => 'required|min:8|max:20']);

        $professional = Professional::where('phone', $this->phone)->first();
        if (!$professional) {
            $this->addError('phone', 'Aucun artisan trouvé avec ce numéro de téléphone.');
            return;
        }

        $user = User::where('professional_id', $professional->id)->first();
        if (!$user) {
            $this->addError('phone', 'Compte introuvable.');
            return;
        }

        $generatedOtp = $user->generatePhoneOtp();
        session(['otp_reset_user_id' => $user->id]);

        try {
            Mail::to($user->email)->send(new PhoneOtp($user, $generatedOtp));
        } catch (\Exception $e) {
            \Log::error('OTP mail error: ' . $e->getMessage());
        }

        $this->step = 'otp';
    }

    // Step 2: Verify OTP
    public function verifyOtp(): void
    {
        $this->validate(['otp' => 'required|digits:6']);

        $userId = session('otp_reset_user_id');
        if (!$userId) { $this->step = 'phone'; return; }

        $user = User::findOrFail($userId);

        if ($user->phone_otp !== $this->otp || now()->isAfter($user->phone_otp_expires_at)) {
            $this->addError('otp', 'Code incorrect ou expiré.');
            return;
        }

        $this->step = 'password';
    }

    // Step 3: Save new password
    public function savePassword(): void
    {
        $this->validate(['password' => 'required|min:8|confirmed']);

        $userId = session('otp_reset_user_id');
        if (!$userId) { $this->step = 'phone'; return; }

        $user = User::findOrFail($userId);

        if ($user->phone_otp !== $this->otp || now()->isAfter($user->phone_otp_expires_at)) {
            $this->step = 'phone';
            $this->addError('phone', 'Session expirée. Recommencez.');
            return;
        }

        $user->update([
            'password'             => Hash::make($this->password),
            'phone_otp'            => null,
            'phone_otp_expires_at' => null,
            'phone_verified_at'    => now(),
        ]);

        session()->forget('otp_reset_user_id');
        session()->flash('status', 'Mot de passe réinitialisé avec succès.');
        $this->redirect(route('pro.login'), navigate: true);
    }

    public function resendOtp(): void
    {
        $this->step = 'phone';
        $this->otp  = '';
    }

    public function render()
    {
        return view('livewire.auth.forgot-password')
            ->layout('layouts.auth', ['title' => __('forgot_password')]);
    }
}
