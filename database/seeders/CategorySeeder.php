<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Plomberie',     'icon' => 'wrench',      'description' => 'Reparation et installation de plomberie, canalisations, robinetterie'],
            ['name' => 'Electricite',   'icon' => 'bolt',        'description' => 'Electriciens certifies pour installations et depannages electriques'],
            ['name' => 'Peinture',      'icon' => 'paint-brush', 'description' => 'Peinture interieure et exterieure, enduit, decoration murale'],
            ['name' => 'Climatisation', 'icon' => 'wind',        'description' => 'Installation, entretien et reparation de climatiseurs et systemes HVAC'],
            ['name' => 'Menuiserie',    'icon' => 'hammer',      'description' => 'Fabrication et pose de meubles, portes, fenetres en bois et aluminium'],
            ['name' => 'Menage',        'icon' => 'broom',       'description' => 'Services de menage, nettoyage de bureaux et domiciles'],
            ['name' => 'Maconnerie',    'icon' => 'building',    'description' => 'Travaux de maconnerie, carrelage, revetement de sol'],
            ['name' => 'Serrurerie',    'icon' => 'key',         'description' => 'Installation et depannage de serrures, portes blindees'],
            ['name' => 'Jardinage',     'icon' => 'leaf',        'description' => 'Entretien de jardins, taille, arrosage automatique'],
            ['name' => 'Informatique',  'icon' => 'laptop',      'description' => 'Depannage PC, installation logiciels, reseaux informatiques'],
            ['name' => 'Demenagement',  'icon' => 'truck',       'description' => 'Services de demenagement, transport de meubles et emballage'],
            ['name' => 'Soudure',       'icon' => 'fire',        'description' => 'Soudure, ferronnerie, portails et grilles metalliques'],
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
