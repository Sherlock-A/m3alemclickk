<?php

namespace App\Livewire\Auth;

use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Login extends Component
{
    public string $email    = '';
    public string $password = '';
    public bool   $remember = false;

    protected array $rules = [
        'email'    => 'required|email',
        'password' => 'required|min:6',
    ];

    public function login(): void
    {
        $this->validate();

        if (!Auth::attempt(['email' => $this->email, 'password' => $this->password], $this->remember)) {
            $this->addError('email', 'Email ou mot de passe incorrect.');
            return;
        }

        $user = Auth::user();

        if ($user->isSuspended()) {
            Auth::logout();
            $this->addError('email', __('profile_suspended'));
            return;
        }

        session()->regenerate();

        // Feature 1: Admin bypass — auto-verify + flash message
        if ($user->isAdmin()) {
            if (!$user->phone_verified_at) {
                $user->update(['phone_verified_at' => now(), 'status' => 'active']);
            }
            session()->flash('status', __('admin_no_verify'));
            $this->redirect(route('admin.dashboard'), navigate: true);
            return;
        }

        if ($user->isProfessional()) {
            $this->redirect(route('pro.dashboard'), navigate: true);
            return;
        }

        $this->redirect(route('home'), navigate: true);
    }

    public function render()
    {
        return view('livewire.auth.login')
            ->layout('layouts.auth', ['title' => __('login')]);
    }
}
