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
            [
                'name'        => 'Youssef El Alami',
                'phone'       => '0661234501',
                'profession'  => 'Plombier',
                'category'    => 'Plomberie',
                'city'        => 'Casablanca',
                'cities'      => ['Mohammedia', 'El Jadida'],
                'languages'   => ['Français', 'Arabe', 'Darija'],
                'description' => 'Plombier professionnel avec 12 ans d\'expérience. Intervention rapide pour fuites, débouchage, installation sanitaire.',
                'photo'       => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.8,
                'views'       => 420,
                'whatsapp'    => 85,
                'calls'       => 62,
                'missions'    => 134,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 33.5731,
                'lng'         => -7.5898,
            ],
            [
                'name'        => 'Hassan Benali',
                'phone'       => '0661234502',
                'profession'  => 'Électricien',
                'category'    => 'Electricite',
                'city'        => 'Rabat',
                'cities'      => ['Salé', 'Témara'],
                'languages'   => ['Français', 'Arabe'],
                'description' => 'Électricien certifié, spécialisé en tableaux électriques, domotique et dépannage résidentiel.',
                'photo'       => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.7,
                'views'       => 380,
                'whatsapp'    => 72,
                'calls'       => 55,
                'missions'    => 98,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 34.0209,
                'lng'         => -6.8416,
            ],
            [
                'name'        => 'Rachid Tazi',
                'phone'       => '0661234503',
                'profession'  => 'Peintre',
                'category'    => 'Peinture',
                'city'        => 'Marrakech',
                'cities'      => ['Agadir', 'Essaouira'],
                'languages'   => ['Français', 'Arabe', 'Amazigh'],
                'description' => 'Peintre décorateur, maîtrisant enduit, peinture décorative, béton ciré et tadelakt marocain.',
                'photo'       => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.9,
                'views'       => 510,
                'whatsapp'    => 110,
                'calls'       => 78,
                'missions'    => 187,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 31.6295,
                'lng'         => -7.9811,
            ],
            [
                'name'        => 'Khalid Mansouri',
                'phone'       => '0661234504',
                'profession'  => 'Technicien Climatisation',
                'category'    => 'Climatisation',
                'city'        => 'Casablanca',
                'cities'      => ['Rabat', 'Kénitra'],
                'languages'   => ['Français', 'Arabe'],
                'description' => 'Technicien HVAC agréé, installation et entretien de climatiseurs multi-split, gainables et cassettes.',
                'photo'       => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.6,
                'views'       => 295,
                'whatsapp'    => 58,
                'calls'       => 41,
                'missions'    => 76,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 33.5731,
                'lng'         => -7.5898,
            ],
            [
                'name'        => 'Omar Chraibi',
                'phone'       => '0661234505',
                'profession'  => 'Menuisier',
                'category'    => 'Menuiserie',
                'city'        => 'Fès',
                'cities'      => ['Meknès', 'Rabat'],
                'languages'   => ['Arabe', 'Darija'],
                'description' => 'Menuisier artisan, fabrication sur mesure de cuisines, dressings, portes et fenêtres en bois massif.',
                'photo'       => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.5,
                'views'       => 210,
                'whatsapp'    => 44,
                'calls'       => 33,
                'missions'    => 61,
                'verified'    => false,
                'status'      => 'available',
                'lat'         => 34.0331,
                'lng'         => -5.0003,
            ],
            [
                'name'        => 'Fatima Zahra Idrissi',
                'phone'       => '0661234506',
                'profession'  => 'Femme de ménage',
                'category'    => 'Menage',
                'city'        => 'Casablanca',
                'cities'      => ['Mohammedia', 'Berrechid'],
                'languages'   => ['Français', 'Arabe', 'Darija'],
                'description' => 'Service de ménage professionnel pour particuliers et bureaux. Nettoyage après travaux disponible.',
                'photo'       => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.9,
                'views'       => 640,
                'whatsapp'    => 145,
                'calls'       => 89,
                'missions'    => 220,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 33.5731,
                'lng'         => -7.5898,
            ],
            [
                'name'        => 'Mustapha Berrada',
                'phone'       => '0661234507',
                'profession'  => 'Maçon',
                'category'    => 'Maconnerie',
                'city'        => 'Tanger',
                'cities'      => ['Tétouan', 'Al Hoceïma'],
                'languages'   => ['Arabe', 'Darija', 'Espagnol'],
                'description' => 'Maçon qualifié : fondations, murs, carrelage, revêtements et finitions de haute qualité.',
                'photo'       => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.4,
                'views'       => 175,
                'whatsapp'    => 38,
                'calls'       => 25,
                'missions'    => 52,
                'verified'    => false,
                'status'      => 'busy',
                'lat'         => 35.7595,
                'lng'         => -5.8340,
            ],
            [
                'name'        => 'Abdellatif Ouali',
                'phone'       => '0661234508',
                'profession'  => 'Serrurier',
                'category'    => 'Serrurerie',
                'city'        => 'Agadir',
                'cities'      => ['Inezgane', 'Tiznit'],
                'languages'   => ['Français', 'Arabe', 'Amazigh'],
                'description' => 'Serrurier dépanneur 24h/24, ouverture de portes, blindage, installation de serrures de haute sécurité.',
                'photo'       => 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.7,
                'views'       => 330,
                'whatsapp'    => 67,
                'calls'       => 91,
                'missions'    => 109,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 30.4278,
                'lng'         => -9.5981,
            ],
            [
                'name'        => 'Karim Elhajjami',
                'phone'       => '0661234509',
                'profession'  => 'Jardinier',
                'category'    => 'Jardinage',
                'city'        => 'Rabat',
                'cities'      => ['Kénitra', 'Salé'],
                'languages'   => ['Français', 'Arabe'],
                'description' => 'Jardinier paysagiste, création et entretien de jardins, systèmes d\'irrigation et espaces verts.',
                'photo'       => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.6,
                'views'       => 195,
                'whatsapp'    => 41,
                'calls'       => 28,
                'missions'    => 73,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 34.0209,
                'lng'         => -6.8416,
            ],
            [
                'name'        => 'Samir Lahlou',
                'phone'       => '0661234510',
                'profession'  => 'Technicien Informatique',
                'category'    => 'Informatique',
                'city'        => 'Casablanca',
                'cities'      => ['Rabat', 'Mohammedia'],
                'languages'   => ['Français', 'Arabe', 'Anglais'],
                'description' => 'Dépannage PC/Mac, installation et configuration réseaux, récupération de données, cybersécurité.',
                'photo'       => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.8,
                'views'       => 488,
                'whatsapp'    => 102,
                'calls'       => 67,
                'missions'    => 156,
                'verified'    => true,
                'status'      => 'available',
                'lat'         => 33.5731,
                'lng'         => -7.5898,
            ],
            [
                'name'        => 'Nabil Sqalli',
                'phone'       => '0661234511',
                'profession'  => 'Déménageur',
                'category'    => 'Demenagement',
                'city'        => 'Casablanca',
                'cities'      => ['Rabat', 'Marrakech'],
                'languages'   => ['Français', 'Arabe'],
                'description' => 'Service de déménagement avec camion équipé, emballage professionnel et assurance incluse.',
                'photo'       => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.5,
                'views'       => 260,
                'whatsapp'    => 54,
                'calls'       => 39,
                'missions'    => 87,
                'verified'    => false,
                'status'      => 'busy',
                'lat'         => 33.5731,
                'lng'         => -7.5898,
            ],
            [
                'name'        => 'Driss Kettani',
                'phone'       => '0661234512',
                'profession'  => 'Soudeur',
                'category'    => 'Soudure',
                'city'        => 'Oujda',
                'cities'      => ['Nador', 'Fès'],
                'languages'   => ['Arabe', 'Darija'],
                'description' => 'Soudeur MIG/TIG, fabrication de portails, rampes, garde-corps et structures métalliques sur mesure.',
                'photo'       => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
                'rating'      => 4.3,
                'views'       => 148,
                'whatsapp'    => 32,
                'calls'       => 21,
                'missions'    => 44,
                'verified'    => false,
                'status'      => 'available',
                'lat'         => 34.6814,
                'lng'         => -1.9086,
            ],
        ];

        $reviews = [
            ['comment' => 'Excellent travail, très professionnel et ponctuel. Je recommande vivement !', 'rating' => 5],
            ['comment' => 'Bon rapport qualité-prix, travail soigné et propre. Reviendra sans hésiter.', 'rating' => 5],
            ['comment' => 'Intervention rapide, problème résolu en moins d\'une heure. Très satisfait.', 'rating' => 4],
            ['comment' => 'Professionnel sérieux, explique bien son intervention. Prix honnête.', 'rating' => 5],
            ['comment' => 'Très bon service, disponible même le week-end. Travail de qualité.', 'rating' => 4],
            ['comment' => 'Efficace et discret, respecte les horaires convenus. Je recommande.', 'rating' => 5],
            ['comment' => 'Excellent professionnel, matériel de qualité, résultat impeccable.', 'rating' => 5],
            ['comment' => 'Travail bien fait, délai respecté. Très bonne communication.', 'rating' => 4],
        ];

        $clientNames = [
            'Hamid Bensouda', 'Aicha Tahiri', 'Mohamed Berrada', 'Nadia Skali',
            'Younes Lamrani', 'Samira El Fassi', 'Amine Ziani', 'Lalla Fatima',
        ];

        foreach ($professionals as $i => $data) {
            $category = Category::where('name', $data['category'])->first();
            if (!$category) continue;

            $professional = Professional::create([
                'category_id'        => $category->id,
                'name'               => $data['name'],
                'phone'              => $data['phone'],
                'profession'         => $data['profession'],
                'main_city'          => $data['city'],
                'travel_cities'      => $data['cities'],
                'languages'          => $data['languages'],
                'description'        => $data['description'],
                'photo'              => $data['photo'],
                'portfolio'          => [
                    'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
                ],
                'status'             => $data['status'],
                'views'              => $data['views'],
                'whatsapp_clicks'    => $data['whatsapp'],
                'calls'              => $data['calls'],
                'rating'             => $data['rating'],
                'verified'           => $data['verified'],
                'completed_missions' => $data['missions'],
                'is_available'       => $data['status'] === 'available',
                'latitude'           => $data['lat'],
                'longitude'          => $data['lng'],
            ]);

            User::firstOrCreate(
                ['email' => 'pro'.($i + 1).'@m3allemclick.ma'],
                [
                    'name'            => $professional->name,
                    'password'        => 'password',
                    'role'            => 'professional',
                    'status'          => 'active',
                    'professional_id' => $professional->id,
                ]
            );

            // 3 avis par professionnel
            foreach (range(0, 2) as $r) {
                $rev = $reviews[($i * 3 + $r) % count($reviews)];
                Review::create([
                    'professional_id' => $professional->id,
                    'client_name'     => $clientNames[($i * 3 + $r) % count($clientNames)],
                    'rating'          => $rev['rating'],
                    'comment'         => $rev['comment'],
                    'approved'        => true,
                ]);
            }
        }
    }

    private function seedClients(): void
    {
        $clients = [
            ['email' => 'client@m3allemclick.ma',  'name' => 'Ahmed El Fassi'],
            ['email' => 'client2@m3allemclick.ma', 'name' => 'Sanaa Benkirane'],
            ['email' => 'client3@m3allemclick.ma', 'name' => 'Tariq Zemmouri'],
        ];

        foreach ($clients as $client) {
            User::firstOrCreate(
                ['email' => $client['email']],
                [
                    'name'     => $client['name'],
                    'password' => 'password',
                    'role'     => 'client',
                    'status'   => 'active',
                ]
            );
        }
    }
}
