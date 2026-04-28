<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Plomberie',     'icon' => '🔧', 'description' => 'Réparation et installation de plomberie'],
            ['name' => 'Electricite',   'icon' => '⚡', 'description' => 'Électriciens certifiés pour toutes installations'],
            ['name' => 'Peinture',      'icon' => '🎨', 'description' => 'Peinture intérieure et extérieure'],
            ['name' => 'Climatisation', 'icon' => '❄️', 'description' => 'Installation et entretien de climatiseurs'],
            ['name' => 'Menuiserie',    'icon' => '🪚', 'description' => 'Fabrication et pose de meubles et fenêtres'],
            ['name' => 'Menage',        'icon' => '🧹', 'description' => 'Services de ménage et nettoyage à domicile'],
            ['name' => 'Maconnerie',    'icon' => '🧱', 'description' => 'Travaux de maçonnerie et béton'],
            ['name' => 'Serrurerie',    'icon' => '🔑', 'description' => 'Installation et dépannage de serrures'],
            ['name' => 'Jardinage',     'icon' => '🌿', 'description' => 'Entretien de jardins et espaces verts'],
            ['name' => 'Informatique',  'icon' => '💻', 'description' => 'Dépannage PC, réseaux et assistance informatique'],
            ['name' => 'Demenagement',  'icon' => '📦', 'description' => 'Services de déménagement et transport'],
            ['name' => 'Soudure',       'icon' => '🔩', 'description' => 'Soudure, ferronnerie et métallerie'],
            ['name' => 'Carrelage',     'icon' => '🪟', 'description' => 'Pose et rénovation de carrelage et faïence'],
            ['name' => 'Vitrerie',      'icon' => '🪞', 'description' => 'Remplacement et installation de vitres'],
            ['name' => 'Chauffage',     'icon' => '🔥', 'description' => 'Installation et entretien de chaudières'],
            ['name' => 'Decoration',    'icon' => '🛋️', 'description' => 'Décoration intérieure et aménagement'],
            ['name' => 'Nettoyage',     'icon' => '🧽', 'description' => 'Nettoyage industriel et de locaux commerciaux'],
            ['name' => 'Charpenterie',  'icon' => '🪵', 'description' => 'Charpente bois, couverture et toiture'],
            ['name' => 'Coiffure',      'icon' => '✂️', 'description' => 'Coiffeur à domicile — homme et femme'],
            ['name' => 'Photographie',  'icon' => '📷', 'description' => 'Photographe professionnel événementiel'],
        ];

        foreach ($categories as $i => $cat) {
            $slug = Str::slug($cat['name']);
            $exists = DB::table('categories')->where('name', $cat['name'])->exists();
            if ($exists) continue;

            DB::table('categories')->insert([
                'name'        => $cat['name'],
                'slug'        => $slug,
                'icon'        => $cat['icon'],
                'description' => $cat['description'],
                'sort_order'  => $i + 1,
                'active'      => 1,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}
