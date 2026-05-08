<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Professional;
use App\Models\User;
use App\Models\Review;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1 Professionnel démo ─────────────────────────────────────────────
        $pro = Professional::create([
            'name'               => 'Youssef Alami',
            'slug'               => 'youssef-alami-plombier-casablanca',
            'phone'              => '0661234567',
            'profession'         => 'Plombier',
            'category_id'        => 1,
            'main_city'          => 'Casablanca',
            'travel_cities'      => ['Mohammedia', 'Kénitra'],
            'languages'          => ['Arabe', 'Français'],
            'description'        => 'Plombier professionnel avec 10 ans d\'expérience à Casablanca. Intervention rapide pour fuites, installations sanitaires, chauffe-eaux et canalisations bouchées. Disponible 7j/7.',
            'photo'              => null,
            'portfolio'          => [],
            'status'             => 'available',
            'views'              => 0,
            'whatsapp_clicks'    => 0,
            'calls'              => 0,
            'rating'             => 0,
            'verified'           => false,
            'completed_missions' => 0,
            'is_available'       => true,
            'latitude'           => 33.5731,
            'longitude'          => -7.5898,
        ]);

        User::create([
            'name'            => 'Youssef Alami',
            'email'           => 'pro@jobly.ma',
            'password'        => 'password',
            'role'            => 'professional',
            'status'          => 'active',
            'professional_id' => $pro->id,
        ]);

        // ── 1 Client démo ────────────────────────────────────────────────────
        User::create([
            'name'     => 'Karim Bennani',
            'email'    => 'client@jobly.ma',
            'password' => 'password',
            'role'     => 'client',
            'status'   => 'active',
        ]);

        $this->command->info('Démo créée : 1 professionnel (pro@jobly.ma) + 1 client (client@jobly.ma) — mot de passe : password');
    }
}
