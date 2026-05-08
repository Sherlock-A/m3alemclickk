<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Données de test reproductibles pour final-test.ps1.
 * Idempotent : peut être relancé sans dupliquer les enregistrements.
 *
 * Professionnels créés :
 *   Ahmed Bennani     — Plombier         — Casablanca
 *   Karima El Fassi   — Électricien      — Rabat
 *   Fatima Zahra Nacer— Femme de ménage  — Tanger
 *   Said Tazi         — Déménageur       — Marrakech   ← pro@test.com
 *
 * Comptes utilisateurs :
 *   client@test.com / password  (client)
 *   pro@test.com    / password  (professional → Said Tazi)
 *   admin@test.com  / password  (admin)
 */
class TestDataSeeder extends Seeder
{
    private const TEST_PASSWORD = 'password';

    public function run(): void
    {
        $this->seedTestProfessionals();
        $this->seedTestAccounts();
    }

    // ── 4 professionnels de démonstration ────────────────────────────────────

    private function seedTestProfessionals(): void
    {
        $entries = [
            [
                'name'       => 'Ahmed Bennani',
                'phone'      => '0699000001',
                'profession' => 'Plombier',
                'category'   => 'Plomberie',
                'city'       => 'Casablanca',
                'lat'        => 33.5731,
                'lng'        => -7.5898,
                'email'      => 'ahmed.bennani@test.ma',
            ],
            [
                'name'       => 'Karima El Fassi',
                'phone'      => '0699000002',
                'profession' => 'Électricien',
                'category'   => 'Electricite',
                'city'       => 'Rabat',
                'lat'        => 34.0209,
                'lng'        => -6.8416,
                'email'      => 'karima.elfassi@test.ma',
            ],
            [
                'name'       => 'Fatima Zahra Nacer',
                'phone'      => '0699000003',
                'profession' => 'Femme de ménage',
                'category'   => 'Menage',
                'city'       => 'Tanger',
                'lat'        => 35.7595,
                'lng'        => -5.8340,
                'email'      => 'fatima.zahra.nacer@test.ma',
            ],
            [
                'name'       => 'Said Tazi',
                'phone'      => '0699000004',
                'profession' => 'Déménageur',
                'category'   => 'Demenagement',
                'city'       => 'Marrakech',
                'lat'        => 31.6295,
                'lng'        => -7.9811,
                'email'      => 'pro@test.com',   // ← compte de test principal
            ],
        ];

        $sampleReviews = [
            ['client_name' => 'Hamid Bensouda', 'rating' => 5, 'comment' => 'Excellent travail, très professionnel et ponctuel.'],
            ['client_name' => 'Aicha Tahiri',   'rating' => 4, 'comment' => 'Bon service, rapide et efficace. Je recommande.'],
            ['client_name' => 'Mohamed Berrada','rating' => 5, 'comment' => 'Travail soigné, prix honnête. Parfait.'],
        ];

        foreach ($entries as $data) {
            if (DB::table('professionals')->where('phone', $data['phone'])->exists()) {
                continue;
            }

            $category = DB::table('categories')->where('name', $data['category'])->first();
            if (! $category) continue;

            $slug = Str::slug($data['name'] . '-' . $data['profession']);
            $base = $slug; $n = 1;
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
                'travel_cities'      => json_encode([]),
                'languages'          => json_encode(['Arabe', 'Français']),
                'description'        => 'Professionnel qualifié, disponible pour interventions à domicile. Devis gratuit, travail soigné.',
                'photo'              => 'https://images.unsplash.com/photo-1543357644-160b53c087e8?q=80&w=400&auto=format&fit=crop',
                'portfolio'          => json_encode([]),
                'status'             => 'available',
                'views'              => rand(80, 250),
                'whatsapp_clicks'    => rand(15, 60),
                'calls'              => rand(8, 40),
                'rating'             => 4.5,
                'verified'           => 1,
                'completed_missions' => rand(15, 60),
                'is_available'       => 1,
                'latitude'           => $data['lat'],
                'longitude'          => $data['lng'],
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);

            // 3 avis approuvés par professionnel
            foreach ($sampleReviews as $rev) {
                DB::table('reviews')->insert([
                    'professional_id' => $proId,
                    'client_name'     => $rev['client_name'],
                    'rating'          => $rev['rating'],
                    'comment'         => $rev['comment'],
                    'approved'        => 1,
                    'created_at'      => now()->subDays(rand(1, 30)),
                    'updated_at'      => now(),
                ]);
            }

            // Compte utilisateur lié au professionnel
            if (! DB::table('users')->where('email', $data['email'])->exists()) {
                DB::table('users')->insert([
                    'name'            => $data['name'],
                    'email'           => $data['email'],
                    'password'        => Hash::make(self::TEST_PASSWORD),
                    'role'            => 'professional',
                    'status'          => 'active',
                    'professional_id' => $proId,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }
        }
    }

    // ── 3 comptes test (client + admin — le pro est créé ci-dessus) ───────────

    private function seedTestAccounts(): void
    {
        $accounts = [
            [
                'name'     => 'Client Test',
                'email'    => 'client@test.com',
                'role'     => 'client',
            ],
            [
                'name'     => 'Admin Test',
                'email'    => 'admin@test.com',
                'role'     => 'admin',
            ],
        ];

        foreach ($accounts as $acc) {
            if (DB::table('users')->where('email', $acc['email'])->exists()) {
                continue;
            }
            DB::table('users')->insert([
                'name'       => $acc['name'],
                'email'      => $acc['email'],
                'password'   => Hash::make(self::TEST_PASSWORD),
                'role'       => $acc['role'],
                'status'     => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
