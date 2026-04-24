<?php

namespace App\Livewire\Professionals;

use App\Models\Category;
use App\Models\City;
use App\Models\Professional;
use Livewire\Attributes\Url;
use Livewire\Component;
use Livewire\WithPagination;

class Index extends Component
{
    use WithPagination;

    #[Url] public string $search       = '';
    #[Url] public string $city         = '';
    #[Url] public string $category     = '';
    #[Url] public string $availability = '';
    #[Url] public string $sort         = 'featured';

    public function updatingSearch():       void { $this->resetPage(); }
    public function updatingCity():          void { $this->resetPage(); }
    public function updatingCategory():      void { $this->resetPage(); }
    public function updatingAvailability():  void { $this->resetPage(); }

    public function clearFilters(): void
    {
        $this->reset(['search', 'city', 'category', 'availability', 'sort']);
        $this->resetPage();
    }

    // Called by Alpine GPS after IP detection
    public function setCity(string $city): void
    {
        $this->city = $city;
        $this->resetPage();
    }

    public function render()
    {
        $query = Professional::with('category')
            ->whereHas('user', fn($q) => $q->where('status', 'active'))
            ->when($this->search, fn($q) => $q->where(function ($q) {
                $q->where('name',        'like', "%{$this->search}%")
                  ->orWhere('profession','like', "%{$this->search}%")
                  ->orWhere('description','like', "%{$this->search}%");
            }))
            ->when($this->city, fn($q) => $q->where(function ($q) {
                $q->where('main_city', 'like', "%{$this->city}%")
                  ->orWhere('travel_cities', 'like', "%{$this->city}%");
            }))
            ->when($this->category, fn($q) => $q->whereHas('category', fn($q) => $q->where('slug', $this->category)))
            ->when($this->availability, fn($q) => $q->where('status', $this->availability));

        $query = match ($this->sort) {
            'rating'  => $query->orderByDesc('rating'),
            'views'   => $query->orderByDesc('views'),
            'newest'  => $query->orderByDesc('created_at'),
            default   => $query->orderByDesc('verified')->orderByDesc('rating'),
        };

        return view('livewire.professionals.index', [
            'professionals' => $query->paginate(12),
            'categories'    => Category::where('active', true)->orderBy('sort_order')->get(),
            'cities'        => City::where('active', true)->orderBy('sort_order')->get(),
        ])->layout('layouts.app', ['title' => __('professionals') . ' — M3allemClick']);
    }
}
