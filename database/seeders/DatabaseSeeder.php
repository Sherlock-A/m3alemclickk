<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Professional;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            ['name' => 'Plomberie',    'icon' => '🔧', 'description' => 'Plombiers qualifiés'],
            ['name' => 'Électricité',  'icon' => '⚡', 'description' => 'Électriciens certifiés'],
            ['name' => 'Peinture',     'icon' => '🎨', 'description' => 'Peintres de confiance'],
            ['name' => 'Climatisation','icon' => '❄️', 'description' => 'Techniciens climatisation'],
            ['name' => 'Menuiserie',   'icon' => '🪚', 'description' => 'Menuisiers et artisans bois'],
            ['name' => 'Ménage',       'icon' => '🧹', 'description' => 'Services à domicile'],
        ])->map(fn ($item, $index) => Category::create([
            ...$item,
            'sort_order' => $index + 1,
            'active' => true,
        ]));

        $cities = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir'];
        $professions = ['Plomberie', 'Électricité', 'Peinture', 'Climatisation', 'Menuiserie', 'Ménage'];

        foreach (range(1, 12) as $i) {
            $professional = Professional::create([
                'category_id' => $categories[($i - 1) % $categories->count()]->id,
                'name' => "Professionnel {$i}",
                'phone' => '2126000000'.$i,
                'profession' => $professions[($i - 1) % count($professions)],
                'main_city' => $cities[($i - 1) % count($cities)],
                'travel_cities' => [$cities[($i) % count($cities)], $cities[($i + 1) % count($cities)]],
                'languages' => ['Français', 'Arabe'],
                'description' => 'Professionnel expérimenté, rapide et fiable, disponible pour interventions à domicile.',
                'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
                'portfolio' => [
                    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
                ],
                'status' => $i % 3 === 0 ? 'busy' : 'available',
                'views' => rand(80, 500),
                'whatsapp_clicks' => rand(20, 200),
                'calls' => rand(10, 120),
                'rating' => rand(40, 50) / 10,
                'verified' => $i % 2 === 0,
                'completed_missions' => rand(10, 150),
                'is_available' => $i % 3 !== 0,
                'latitude' => 33.5731,
                'longitude' => -7.5898,
            ]);

            User::firstOrCreate(
                ['email' => "pro{$i}@m3allemclick.ma"],
                [
                    'name'            => $professional->name,
                    'password'        => 'password',
                    'role'            => 'professional',
                    'status'          => 'active',
                    'professional_id' => $professional->id,
                ]
            );

            foreach (range(1, 3) as $r) {
                Review::create([
                    'professional_id' => $professional->id,
                    'client_name' => "Client {$r}",
                    'rating' => rand(4, 5),
                    'comment' => 'Service sérieux, ponctuel et très bon rapport qualité-prix.',
                    'approved' => true,
                ]);
            }
        }

        User::firstOrCreate(
            ['email' => 'admin@m3allemclick.ma'],
            [
                'name' => 'Admin M3allemClick',
                'password' => 'password',
                'role' => 'admin',
            ]
        );

        User::firstOrCreate(
            ['email' => 'client@m3allemclick.ma'],
            [
                'name' => 'Client Test',
                'password' => 'password',
                'role' => 'client',
                'status' => 'active',
            ]
        );
    }
}
