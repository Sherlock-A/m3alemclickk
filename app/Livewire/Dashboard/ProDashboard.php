<?php

namespace App\Livewire\Dashboard;

use App\Models\Category;
use App\Models\City;
use App\Models\Professional;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class ProDashboard extends Component
{
    public bool   $editMode   = false;
    public bool   $saved      = false;

    // Profile fields
    public string  $name        = '';
    public string  $phone       = '';
    public string  $profession  = '';
    public string  $main_city   = '';
    public string  $description = '';
    public string  $status      = 'available';
    public ?int    $category_id = null;

    protected array $rules = [
        'name'        => 'required|min:2|max:100',
        'phone'       => 'required|min:8|max:20',
        'profession'  => 'required|min:2|max:100',
        'main_city'   => 'required|max:100',
        'description' => 'nullable|max:1000',
        'category_id' => 'nullable|exists:categories,id',
        'status'      => 'in:available,busy,offline',
    ];

    public function mount(): void
    {
        if (!Auth::check()) {
            $this->redirect(route('pro.login'));
            return;
        }

        $pro = Auth::user()->professional;
        if ($pro) {
            $this->name        = $pro->name;
            $this->phone       = $pro->phone;
            $this->profession  = $pro->profession;
            $this->main_city   = $pro->main_city;
            $this->description = $pro->description ?? '';
            $this->status      = $pro->status ?? 'available';
            $this->category_id = $pro->category_id;
        }
    }

    public function saveProfile(): void
    {
        $this->validate();

        $pro = Auth::user()->professional;
        if ($pro) {
            $pro->update([
                'name'        => $this->name,
                'phone'       => $this->phone,
                'profession'  => $this->profession,
                'main_city'   => $this->main_city,
                'description' => $this->description,
                'status'      => $this->status,
                'category_id' => $this->category_id,
            ]);
        }

        $this->editMode = false;
        $this->saved    = true;
        $this->dispatch('toast-success', message: 'Profil mis à jour.');
    }

    public function resubmit(): void
    {
        $user = Auth::user();
        $user->update(['status' => 'pending', 'rejection_reason' => null]);
        $this->dispatch('toast-success', message: 'Profil soumis à nouveau pour validation.');
    }

    public function render()
    {
        return view('livewire.dashboard.pro-dashboard', [
            'user'       => Auth::user(),
            'pro'        => Auth::user()?->professional,
            'categories' => Category::where('active', true)->orderBy('sort_order')->get(),
            'cities'     => City::where('active', true)->orderBy('sort_order')->get(),
        ])->layout('layouts.app', ['title' => 'Mon espace — M3allemClick']);
    }
}
