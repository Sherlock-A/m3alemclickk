<?php

namespace App\Livewire\Professionals;

use App\Models\Professional;
use Livewire\Component;

class Show extends Component
{
    public Professional $professional;

    public function mount(string $slug): void
    {
        $this->professional = Professional::with(['category', 'reviews' => fn($q) => $q->where('approved', true)->latest()])
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view counter
        $this->professional->increment('views');
    }

    public function render()
    {
        return view('livewire.professionals.show')
            ->layout('layouts.app', [
                'title'       => $this->professional->name . ' — ' . $this->professional->profession,
                'description' => $this->professional->description ?? $this->professional->name . ' — ' . $this->professional->profession . ' à ' . $this->professional->main_city,
            ]);
    }
}
