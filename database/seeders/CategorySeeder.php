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
            ['name' => 'Plomberie',     'icon' => 'wrench',      'description' => 'Reparation et installation de plomberie'],
            ['name' => 'Electricite',   'icon' => 'bolt',        'description' => 'Electriciens certifies pour installations'],
            ['name' => 'Peinture',      'icon' => 'paint-brush', 'description' => 'Peinture interieure et exterieure'],
            ['name' => 'Climatisation', 'icon' => 'wind',        'description' => 'Installation et entretien de climatiseurs'],
            ['name' => 'Menuiserie',    'icon' => 'hammer',      'description' => 'Fabrication et pose de meubles et fenetres'],
            ['name' => 'Menage',        'icon' => 'broom',       'description' => 'Services de menage et nettoyage'],
            ['name' => 'Maconnerie',    'icon' => 'building',    'description' => 'Travaux de maconnerie et carrelage'],
            ['name' => 'Serrurerie',    'icon' => 'key',         'description' => 'Installation et depannage de serrures'],
            ['name' => 'Jardinage',     'icon' => 'leaf',        'description' => 'Entretien de jardins et espaces verts'],
            ['name' => 'Informatique',  'icon' => 'laptop',      'description' => 'Depannage PC et reseaux informatiques'],
            ['name' => 'Demenagement',  'icon' => 'truck',       'description' => 'Services de demenagement'],
            ['name' => 'Soudure',       'icon' => 'fire',        'description' => 'Soudure et ferronnerie'],
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
