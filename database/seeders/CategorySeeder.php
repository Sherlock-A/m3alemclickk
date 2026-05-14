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
            [
                'name' => 'Plomberie', 'icon' => '🔧',
                'description' => 'Réparation et installation de plomberie',
                'translations' => ['fr' => 'Plomberie', 'ar' => 'سباكة', 'en' => 'Plumbing', 'ber' => 'Aselmed n waman'],
            ],
            [
                'name' => 'Electricite', 'icon' => '⚡',
                'description' => 'Électriciens certifiés pour toutes installations',
                'translations' => ['fr' => 'Électricité', 'ar' => 'كهرباء', 'en' => 'Electricity', 'ber' => 'Tanfust'],
            ],
            [
                'name' => 'Peinture', 'icon' => '🎨',
                'description' => 'Peinture intérieure et extérieure',
                'translations' => ['fr' => 'Peinture', 'ar' => 'دهان', 'en' => 'Painting', 'ber' => 'Tizrarin'],
            ],
            [
                'name' => 'Climatisation', 'icon' => '❄️',
                'description' => 'Installation et entretien de climatiseurs',
                'translations' => ['fr' => 'Climatisation', 'ar' => 'تكييف', 'en' => 'Air Conditioning', 'ber' => 'Asenfar n yiles'],
            ],
            [
                'name' => 'Menuiserie', 'icon' => '🪚',
                'description' => 'Fabrication et pose de meubles et fenêtres',
                'translations' => ['fr' => 'Menuiserie', 'ar' => 'نجارة', 'en' => 'Carpentry', 'ber' => 'Tanaggalt'],
            ],
            [
                'name' => 'Menage', 'icon' => '🧹',
                'description' => 'Services de ménage et nettoyage à domicile',
                'translations' => ['fr' => 'Ménage', 'ar' => 'تنظيف المنزل', 'en' => 'House Cleaning', 'ber' => 'Aseqsi n Axxam'],
            ],
            [
                'name' => 'Maconnerie', 'icon' => '🧱',
                'description' => 'Travaux de maçonnerie et béton',
                'translations' => ['fr' => 'Maçonnerie', 'ar' => 'بناء', 'en' => 'Masonry', 'ber' => 'Abenna'],
            ],
            [
                'name' => 'Serrurerie', 'icon' => '🔑',
                'description' => 'Installation et dépannage de serrures',
                'translations' => ['fr' => 'Serrurerie', 'ar' => 'حدادة وأقفال', 'en' => 'Locksmith', 'ber' => 'Asekfer'],
            ],
            [
                'name' => 'Jardinage', 'icon' => '🌿',
                'description' => 'Entretien de jardins et espaces verts',
                'translations' => ['fr' => 'Jardinage', 'ar' => 'بستنة', 'en' => 'Gardening', 'ber' => 'Tifeddit'],
            ],
            [
                'name' => 'Informatique', 'icon' => '💻',
                'description' => 'Dépannage PC, réseaux et assistance informatique',
                'translations' => ['fr' => 'Informatique', 'ar' => 'معلوميات', 'en' => 'IT & Computing', 'ber' => 'Aselkim'],
            ],
            [
                'name' => 'Demenagement', 'icon' => '📦',
                'description' => 'Services de déménagement et transport',
                'translations' => ['fr' => 'Déménagement', 'ar' => 'نقل العفش', 'en' => 'Moving', 'ber' => 'Azgel'],
            ],
            [
                'name' => 'Soudure', 'icon' => '🔩',
                'description' => 'Soudure, ferronnerie et métallerie',
                'translations' => ['fr' => 'Soudure', 'ar' => 'لحام', 'en' => 'Welding', 'ber' => 'Tasudurt'],
            ],
            [
                'name' => 'Carrelage', 'icon' => '🪟',
                'description' => 'Pose et rénovation de carrelage et faïence',
                'translations' => ['fr' => 'Carrelage', 'ar' => 'تبليط', 'en' => 'Tiling', 'ber' => 'Amezdaj'],
            ],
            [
                'name' => 'Vitrerie', 'icon' => '🪞',
                'description' => 'Remplacement et installation de vitres',
                'translations' => ['fr' => 'Vitrerie', 'ar' => 'زجاجية', 'en' => 'Glazing', 'ber' => 'Izran'],
            ],
            [
                'name' => 'Chauffage', 'icon' => '🔥',
                'description' => 'Installation et entretien de chaudières',
                'translations' => ['fr' => 'Chauffage', 'ar' => 'تدفئة', 'en' => 'Heating', 'ber' => 'Aseɣed'],
            ],
            [
                'name' => 'Decoration', 'icon' => '🛋️',
                'description' => 'Décoration intérieure et aménagement',
                'translations' => ['fr' => 'Décoration', 'ar' => 'ديكور', 'en' => 'Interior Design', 'ber' => 'Azeɣlif'],
            ],
            [
                'name' => 'Nettoyage', 'icon' => '🧽',
                'description' => 'Nettoyage industriel et de locaux commerciaux',
                'translations' => ['fr' => 'Nettoyage', 'ar' => 'نظافة صناعية', 'en' => 'Industrial Cleaning', 'ber' => 'Aseqsi'],
            ],
            [
                'name' => 'Charpenterie', 'icon' => '🪵',
                'description' => 'Charpente bois, couverture et toiture',
                'translations' => ['fr' => 'Charpenterie', 'ar' => 'نجارة البناء', 'en' => 'Roofing & Timber', 'ber' => 'Tanaggalt n Uxxam'],
            ],
            [
                'name' => 'Coiffure', 'icon' => '✂️',
                'description' => 'Coiffeur à domicile — homme et femme',
                'translations' => ['fr' => 'Coiffure', 'ar' => 'حلاقة', 'en' => 'Hairdressing', 'ber' => 'Tifrat'],
            ],
            [
                'name' => 'Photographie', 'icon' => '📷',
                'description' => 'Photographe professionnel événementiel',
                'translations' => ['fr' => 'Photographie', 'ar' => 'تصوير', 'en' => 'Photography', 'ber' => 'Tasnektimt'],
            ],
            [
                'name' => 'Topographie', 'icon' => '📐',
                'description' => 'Topographie, bornage et relevés de terrain',
                'translations' => ['fr' => 'Topographie', 'ar' => 'مساحة ورسم خرائط', 'en' => 'Surveying & Topography', 'ber' => 'Asukmaz n Umaḍal'],
            ],
        ];

        foreach ($categories as $i => $cat) {
            $slug = Str::slug($cat['name']);
            $exists = DB::table('categories')->where('name', $cat['name'])->exists();

            $data = [
                'name'         => $cat['name'],
                'slug'         => $slug,
                'icon'         => $cat['icon'],
                'description'  => $cat['description'],
                'translations' => json_encode($cat['translations'], JSON_UNESCAPED_UNICODE),
                'sort_order'   => $i + 1,
                'active'       => 1,
                'updated_at'   => now(),
            ];

            if ($exists) {
                // Update translations and icon for existing categories
                DB::table('categories')->where('name', $cat['name'])->update([
                    'icon'         => $cat['icon'],
                    'translations' => $data['translations'],
                    'updated_at'   => now(),
                ]);
            } else {
                DB::table('categories')->insert(array_merge($data, ['created_at' => now()]));
            }
        }
    }
}
