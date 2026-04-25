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
            ['name' => 'Plomberie',     'icon' => "\xF0\x9F\x94\xA7", 'description' => 'Reparation et installation de plomberie'],
            ['name' => 'Electricite',   'icon' => "\xE2\x9A\xA1",     'description' => 'Electriciens certifies pour installations'],
            ['name' => 'Peinture',      'icon' => "\xF0\x9F\x8E\xA8", 'description' => 'Peinture interieure et exterieure'],
            ['name' => 'Climatisation', 'icon' => "\xE2\x9D\x84\xEF\xB8\x8F", 'description' => 'Installation et entretien de climatiseurs'],
            ['name' => 'Menuiserie',    'icon' => "\xF0\x9F\xAA\x9A", 'description' => 'Fabrication et pose de meubles et fenetres'],
            ['name' => 'Menage',        'icon' => "\xF0\x9F\xA7\xB9", 'description' => 'Services de menage et nettoyage'],
            ['name' => 'Maconnerie',    'icon' => "\xF0\x9F\xA7\xB1", 'description' => 'Travaux de maconnerie et carrelage'],
            ['name' => 'Serrurerie',    'icon' => "\xF0\x9F\x94\x91", 'description' => 'Installation et depannage de serrures'],
            ['name' => 'Jardinage',     'icon' => "\xF0\x9F\x8C\xBF", 'description' => 'Entretien de jardins et espaces verts'],
            ['name' => 'Informatique',  'icon' => "\xF0\x9F\x92\xBB", 'description' => 'Depannage PC et reseaux informatiques'],
            ['name' => 'Demenagement',  'icon' => "\xF0\x9F\x93\xA6", 'description' => 'Services de demenagement'],
            ['name' => 'Soudure',       'icon' => "\xF0\x9F\x94\xA9", 'description' => 'Soudure et ferronnerie'],
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
