<?php

namespace App\Livewire\Auth;

use App\Models\Category;
use App\Models\City;
use App\Models\Professional;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Register extends Component
{
    public string $name                  = '';
    public string $email                 = '';
    public string $phone                 = '';
    public string $profession            = '';
    public string $main_city             = '';
    public ?int   $category_id           = null;
    public string $password              = '';
    public string $password_confirmation = '';

    protected array $rules = [
        'name'                  => 'required|min:2|max:100',
        'email'                 => 'required|email|unique:users,email',
        'phone'                 => 'required|min:8|max:20',
        'profession'            => 'required|min:2|max:100',
        'main_city'             => 'required|max:100',
        'category_id'           => 'nullable|exists:categories,id',
        'password'              => 'required|min:8|confirmed',
    ];

    public function register(): void
    {
        $this->validate();

        // Feature 3: Phone uniqueness check
        if (Professional::where('phone', $this->phone)->exists()) {
            $this->addError('phone', __('phone_duplicate'));
            return;
        }

        $professional = Professional::create([
            'name'               => $this->name,
            'phone'              => $this->phone,
            'profession'         => $this->profession,
            'main_city'          => $this->main_city,
            'category_id'        => $this->category_id,
            'status'             => 'pending',
            'is_available'       => false,
            'verified'           => false,
            'rating'             => 0,
            'views'              => 0,
            'whatsapp_clicks'    => 0,
            'calls'              => 0,
            'completed_missions' => 0,
        ]);

        $user = User::create([
            'name'            => $this->name,
            'email'           => $this->email,
            'password'        => $this->password,
            'role'            => 'professional',
            'status'          => 'pending',
            'professional_id' => $professional->id,
        ]);

        Auth::login($user, false);

        $this->redirect(route('pro.dashboard'), navigate: true);
    }

    public function render()
    {
        return view('livewire.auth.register', [
            'categories' => Category::where('active', true)->orderBy('sort_order')->get(),
            'cities'     => City::where('active', true)->orderBy('sort_order')->get(),
        ])->layout('layouts.auth', ['title' => __('register')]);
    }
}
