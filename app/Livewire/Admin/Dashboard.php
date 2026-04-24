<?php

namespace App\Livewire\Admin;

use App\Models\Professional;
use App\Models\Review;
use App\Models\User;
use Livewire\Component;

class Dashboard extends Component
{
    public function render()
    {
        return view('livewire.admin.dashboard', [
            'stats' => [
                'total_pros'    => User::where('role', 'professional')->count(),
                'pending'       => User::where('role', 'professional')->where('status', 'pending')->count(),
                'active'        => User::where('role', 'professional')->where('status', 'active')->count(),
                'refused'       => User::where('role', 'professional')->where('status', 'refused')->count(),
                'total_reviews' => Review::count(),
                'total_views'   => Professional::sum('views'),
                'total_wa'      => Professional::sum('whatsapp_clicks'),
                'total_calls'   => Professional::sum('calls'),
            ],
            'recent' => User::with('professional')
                ->where('role', 'professional')
                ->where('status', 'pending')
                ->latest()
                ->limit(5)
                ->get(),
        ])->layout('layouts.app', ['title' => 'Admin Dashboard — M3allemClick']);
    }
}
