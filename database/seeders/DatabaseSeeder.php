<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CategorySeeder::class,
            CitySeeder::class,
            AdminSeeder::class,
        ]);

        $this->seedProfessionals();
        $this->seedClients();
    }

    private function seedProfessionals(): void
    {
        $professionals = [
            ['name' => 'Youssef El Alami',      'phone' => '0661234501', 'profession' => 'Plombier',               'category' => 'Plomberie',     'city' => 'Casablanca',  'cities' => ['Mohammedia','El Jadida'],  'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.8, 'views' => 420, 'wa' => 85,  'calls' => 62,  'missions' => 134, 'verified' => true,  'status' => 'available'],
            ['name' => 'Hassan Benali',          'phone' => '0661234502', 'profession' => 'Electricien',            'category' => 'Electricite',   'city' => 'Rabat',       'cities' => ['Sale','Temara'],           'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.7, 'views' => 380, 'wa' => 72,  'calls' => 55,  'missions' => 98,  'verified' => true,  'status' => 'available'],
            ['name' => 'Rachid Tazi',            'phone' => '0661234503', 'profession' => 'Peintre',                'category' => 'Peinture',      'city' => 'Marrakech',   'cities' => ['Agadir','Essaouira'],      'lat' => 31.6295, 'lng' => -7.9811,  'rating' => 4.9, 'views' => 510, 'wa' => 110, 'calls' => 78,  'missions' => 187, 'verified' => true,  'status' => 'available'],
            ['name' => 'Khalid Mansouri',        'phone' => '0661234504', 'profession' => 'Tech Climatisation',     'category' => 'Climatisation', 'city' => 'Casablanca',  'cities' => ['Rabat','Kenitra'],         'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.6, 'views' => 295, 'wa' => 58,  'calls' => 41,  'missions' => 76,  'verified' => true,  'status' => 'available'],
            ['name' => 'Omar Chraibi',           'phone' => '0661234505', 'profession' => 'Menuisier',              'category' => 'Menuiserie',    'city' => 'Fes',         'cities' => ['Meknes','Rabat'],          'lat' => 34.0331, 'lng' => -5.0003,  'rating' => 4.5, 'views' => 210, 'wa' => 44,  'calls' => 33,  'missions' => 61,  'verified' => false, 'status' => 'available'],
            ['name' => 'Fatima Zahra Idrissi',   'phone' => '0661234506', 'profession' => 'Femme de menage',        'category' => 'Menage',        'city' => 'Casablanca',  'cities' => ['Mohammedia','Berrechid'],  'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.9, 'views' => 640, 'wa' => 145, 'calls' => 89,  'missions' => 220, 'verified' => true,  'status' => 'available'],
            ['name' => 'Mustapha Berrada',       'phone' => '0661234507', 'profession' => 'Macon',                  'category' => 'Maconnerie',    'city' => 'Tanger',      'cities' => ['Tetouan','Al Hoceima'],    'lat' => 35.7595, 'lng' => -5.8340,  'rating' => 4.4, 'views' => 175, 'wa' => 38,  'calls' => 25,  'missions' => 52,  'verified' => false, 'status' => 'busy'],
            ['name' => 'Abdellatif Ouali',       'phone' => '0661234508', 'profession' => 'Serrurier',              'category' => 'Serrurerie',    'city' => 'Agadir',      'cities' => ['Inezgane','Tiznit'],       'lat' => 30.4278, 'lng' => -9.5981,  'rating' => 4.7, 'views' => 330, 'wa' => 67,  'calls' => 91,  'missions' => 109, 'verified' => true,  'status' => 'available'],
            ['name' => 'Karim Elhajjami',        'phone' => '0661234509', 'profession' => 'Jardinier',              'category' => 'Jardinage',     'city' => 'Rabat',       'cities' => ['Kenitra','Sale'],          'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.6, 'views' => 195, 'wa' => 41,  'calls' => 28,  'missions' => 73,  'verified' => true,  'status' => 'available'],
            ['name' => 'Samir Lahlou',           'phone' => '0661234510', 'profession' => 'Tech Informatique',      'category' => 'Informatique',  'city' => 'Casablanca',  'cities' => ['Rabat','Mohammedia'],      'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.8, 'views' => 488, 'wa' => 102, 'calls' => 67,  'missions' => 156, 'verified' => true,  'status' => 'available'],
            ['name' => 'Nabil Sqalli',           'phone' => '0661234511', 'profession' => 'Demenageur',             'category' => 'Demenagement',  'city' => 'Casablanca',  'cities' => ['Rabat','Marrakech'],       'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.5, 'views' => 260, 'wa' => 54,  'calls' => 39,  'missions' => 87,  'verified' => false, 'status' => 'busy'],
            ['name' => 'Driss Kettani',          'phone' => '0661234512', 'profession' => 'Soudeur',                'category' => 'Soudure',       'city' => 'Oujda',       'cities' => ['Nador','Fes'],             'lat' => 34.6814, 'lng' => -1.9086,  'rating' => 4.3, 'views' => 148, 'wa' => 32,  'calls' => 21,  'missions' => 44,  'verified' => false, 'status' => 'available'],
        ];

        $photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop';
        $portfolio = json_encode([
            'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
        ]);
        $desc = 'Professionnel experimente, disponible pour interventions a domicile. Travail soigne et prix honnete.';

        $comments = [
            'Excellent travail, tres professionnel et ponctuel. Je recommande !',
            'Bon rapport qualite-prix, travail soigne et propre.',
            'Intervention rapide, probleme resolu en moins d\'une heure.',
            'Professionnel serieux, explique bien son intervention.',
            'Tres bon service, disponible meme le week-end.',
            'Efficace et discret, respecte les horaires. Je recommande.',
        ];
        $clientNames = ['Hamid Bensouda', 'Aicha Tahiri', 'Mohamed Berrada', 'Nadia Skali', 'Younes Lamrani', 'Samira El Fassi'];

        foreach ($professionals as $i => $data) {
            $category = DB::table('categories')->where('name', $data['category'])->first();
            if (!$category) continue;

            $proExists = DB::table('professionals')->where('phone', $data['phone'])->exists();
            if ($proExists) continue;

            $slug = Str::slug($data['name'] . '-' . $data['profession']);
            // ensure unique slug
            $base = $slug;
            $n = 1;
            while (DB::table('professionals')->where('slug', $slug)->exists()) {
                $slug = $base . '-' . $n++;
            }

            $proId = DB::table('professionals')->insertGetId([
                'category_id'        => $category->id,
                'name'               => $data['name'],
                'slug'               => $slug,
                'phone'              => $data['phone'],
                'profession'         => $data['profession'],
                'main_city'          => $data['city'],
                'travel_cities'      => json_encode($data['cities']),
                'languages'          => json_encode(['Arabe', 'Francais']),
                'description'        => $desc,
                'photo'              => $photo,
                'portfolio'          => $portfolio,
                'status'             => $data['status'],
                'views'              => $data['views'],
                'whatsapp_clicks'    => $data['wa'],
                'calls'              => $data['calls'],
                'rating'             => $data['rating'],
                'verified'           => $data['verified'] ? 1 : 0,
                'completed_missions' => $data['missions'],
                'is_available'       => $data['status'] === 'available' ? 1 : 0,
                'latitude'           => $data['lat'],
                'longitude'          => $data['lng'],
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);

            $userExists = DB::table('users')->where('email', 'pro'.($i+1).'@m3allemclick.ma')->exists();
            if (!$userExists) {
                DB::table('users')->insert([
                    'name'            => $data['name'],
                    'email'           => 'pro'.($i+1).'@m3allemclick.ma',
                    'password'        => Hash::make('password'),
                    'role'            => 'professional',
                    'status'          => 'active',
                    'professional_id' => $proId,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }

            // 3 reviews per pro
            for ($r = 0; $r < 3; $r++) {
                DB::table('reviews')->insert([
                    'professional_id' => $proId,
                    'client_name'     => $clientNames[($i * 3 + $r) % count($clientNames)],
                    'rating'          => ($r === 0) ? 5 : 4,
                    'comment'         => $comments[($i * 3 + $r) % count($comments)],
                    'approved'        => 1,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }
        }
    }

    private function seedClients(): void
    {
        $clients = [
            ['email' => 'client@m3allemclick.ma',  'name' => 'Ahmed El Fassi'],
            ['email' => 'client2@m3allemclick.ma', 'name' => 'Sanaa Benkirane'],
        ];

        foreach ($clients as $client) {
            $exists = DB::table('users')->where('email', $client['email'])->exists();
            if ($exists) continue;

            DB::table('users')->insert([
                'name'       => $client['name'],
                'email'      => $client['email'],
                'password'   => Hash::make('password'),
                'role'       => 'client',
                'status'     => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
