<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Plomberie',          'icon' => '🔧', 'description' => 'Réparation et installation de plomberie, canalisations, robinetterie'],
            ['name' => 'Électricité',         'icon' => '⚡', 'description' => 'Électriciens certifiés pour installations et dépannages électriques'],
            ['name' => 'Peinture',            'icon' => '🎨', 'description' => 'Peinture intérieure et extérieure, enduit, décoration murale'],
            ['name' => 'Climatisation',       'icon' => '❄️', 'description' => 'Installation, entretien et réparation de climatiseurs et systèmes HVAC'],
            ['name' => 'Menuiserie',          'icon' => '🪚', 'description' => 'Fabrication et pose de meubles, portes, fenêtres en bois et aluminium'],
            ['name' => 'Ménage & Nettoyage', 'icon' => '🧹', 'description' => 'Services de ménage, nettoyage de bureaux et domiciles'],
            ['name' => 'Maçonnerie',          'icon' => '🧱', 'description' => 'Travaux de maçonnerie, carrelage, revêtement de sol'],
            ['name' => 'Serrurerie',          'icon' => '🔑', 'description' => 'Installation et dépannage de serrures, portes blindées'],
            ['name' => 'Jardinage',           'icon' => '🌿', 'description' => 'Entretien de jardins, taille, arrosage automatique'],
            ['name' => 'Informatique',        'icon' => '💻', 'description' => 'Dépannage PC, installation logiciels, réseaux informatiques'],
            ['name' => 'Déménagement',        'icon' => '📦', 'description' => 'Services de déménagement, transport de meubles et emballage'],
            ['name' => 'Soudure',             'icon' => '🔩', 'description' => 'Soudure, ferronnerie, portails et grilles métalliques'],
        ];

        foreach ($categories as $index => $cat) {
            Category::firstOrCreate(
                ['name' => $cat['name']],
                [
                    'icon'        => $cat['icon'],
                    'description' => $cat['description'],
                    'sort_order'  => $index + 1,
                    'active'      => true,
                ]
            );
        }
    }
}
