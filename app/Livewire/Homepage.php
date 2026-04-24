<?php

namespace App\Livewire;

use App\Models\Category;
use App\Models\Professional;
use Livewire\Component;

class Homepage extends Component
{
    public string $search = '';
    public string $city   = '';

    public function submit(): void
    {
        $params = array_filter(['search' => $this->search, 'city' => $this->city]);
        $this->redirect(route('professionals.index', $params), navigate: true);
    }

    public function render()
    {
        return view('livewire.homepage', [
            'categories' => Category::where('active', true)->orderBy('sort_order')->get(),
            'stats' => [
                'professionals' => Professional::count(),
                'verified'      => Professional::where('verified', true)->count(),
                'missions'      => Professional::sum('completed_missions'),
                'cities'        => Professional::distinct('main_city')->count('main_city'),
            ],
            'featured' => Professional::with('category')
                ->where('verified', true)
                ->where('is_available', true)
                ->inRandomOrder()
                ->limit(6)
                ->get(),
        ])->layout('layouts.app', ['title' => 'M3allemClick — ' . __('hero')]);
    }
}
