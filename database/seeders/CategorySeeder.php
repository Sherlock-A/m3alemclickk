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
            // ── Bâtiment & Travaux ─────────────────────────────────────────
            [
                'name' => 'Plomberie', 'icon' => '🔧',
                'description' => 'Réparation et installation de plomberie',
                'translations' => ['fr' => 'Plomberie', 'ar' => 'سباكة', 'en' => 'Plumbing'],
            ],
            [
                'name' => 'Electricite', 'icon' => '⚡',
                'description' => 'Électriciens certifiés pour toutes installations',
                'translations' => ['fr' => 'Électricité', 'ar' => 'كهرباء', 'en' => 'Electricity'],
            ],
            [
                'name' => 'Peinture', 'icon' => '🎨',
                'description' => 'Peinture intérieure et extérieure',
                'translations' => ['fr' => 'Peinture', 'ar' => 'دهان', 'en' => 'Painting'],
            ],
            [
                'name' => 'Climatisation', 'icon' => '❄️',
                'description' => 'Installation et entretien de climatiseurs',
                'translations' => ['fr' => 'Climatisation', 'ar' => 'تكييف', 'en' => 'Air Conditioning'],
            ],
            [
                'name' => 'Menuiserie', 'icon' => '🪚',
                'description' => 'Fabrication et pose de meubles et fenêtres',
                'translations' => ['fr' => 'Menuiserie', 'ar' => 'نجارة', 'en' => 'Carpentry'],
            ],
            [
                'name' => 'Menage', 'icon' => '🧹',
                'description' => 'Services de ménage et nettoyage à domicile',
                'translations' => ['fr' => 'Ménage', 'ar' => 'تنظيف المنزل', 'en' => 'House Cleaning'],
            ],
            [
                'name' => 'Maconnerie', 'icon' => '🧱',
                'description' => 'Travaux de maçonnerie et béton',
                'translations' => ['fr' => 'Maçonnerie', 'ar' => 'بناء', 'en' => 'Masonry'],
            ],
            [
                'name' => 'Serrurerie', 'icon' => '🔑',
                'description' => 'Installation et dépannage de serrures',
                'translations' => ['fr' => 'Serrurerie', 'ar' => 'حدادة وأقفال', 'en' => 'Locksmith'],
            ],
            [
                'name' => 'Jardinage', 'icon' => '🌿',
                'description' => 'Entretien de jardins et espaces verts',
                'translations' => ['fr' => 'Jardinage', 'ar' => 'بستنة', 'en' => 'Gardening'],
            ],
            [
                'name' => 'Informatique', 'icon' => '💻',
                'description' => 'Dépannage PC, réseaux et assistance informatique',
                'translations' => ['fr' => 'Informatique', 'ar' => 'معلوميات', 'en' => 'IT & Computing'],
            ],
            [
                'name' => 'Demenagement', 'icon' => '📦',
                'description' => 'Services de déménagement et transport',
                'translations' => ['fr' => 'Déménagement', 'ar' => 'نقل العفش', 'en' => 'Moving'],
            ],
            [
                'name' => 'Soudure', 'icon' => '🔩',
                'description' => 'Soudure, ferronnerie et métallerie',
                'translations' => ['fr' => 'Soudure', 'ar' => 'لحام', 'en' => 'Welding'],
            ],
            [
                'name' => 'Carrelage', 'icon' => '🪟',
                'description' => 'Pose et rénovation de carrelage et faïence',
                'translations' => ['fr' => 'Carrelage', 'ar' => 'تبليط', 'en' => 'Tiling'],
            ],
            [
                'name' => 'Vitrerie', 'icon' => '🪞',
                'description' => 'Remplacement et installation de vitres',
                'translations' => ['fr' => 'Vitrerie', 'ar' => 'زجاجية', 'en' => 'Glazing'],
            ],
            [
                'name' => 'Chauffage', 'icon' => '🔥',
                'description' => 'Installation et entretien de chaudières',
                'translations' => ['fr' => 'Chauffage', 'ar' => 'تدفئة', 'en' => 'Heating'],
            ],
            [
                'name' => 'Decoration', 'icon' => '🛋️',
                'description' => 'Décoration intérieure et aménagement',
                'translations' => ['fr' => 'Décoration', 'ar' => 'ديكور', 'en' => 'Interior Design'],
            ],
            [
                'name' => 'Nettoyage', 'icon' => '🧽',
                'description' => 'Nettoyage industriel et de locaux commerciaux',
                'translations' => ['fr' => 'Nettoyage', 'ar' => 'نظافة صناعية', 'en' => 'Industrial Cleaning'],
            ],
            [
                'name' => 'Charpenterie', 'icon' => '🪵',
                'description' => 'Charpente bois, couverture et toiture',
                'translations' => ['fr' => 'Charpenterie', 'ar' => 'نجارة البناء', 'en' => 'Roofing & Timber'],
            ],
            [
                'name' => 'Coiffure', 'icon' => '✂️',
                'description' => 'Coiffeur à domicile — homme et femme',
                'translations' => ['fr' => 'Coiffure', 'ar' => 'حلاقة', 'en' => 'Hairdressing'],
            ],
            [
                'name' => 'Photographie', 'icon' => '📷',
                'description' => 'Photographe professionnel événementiel',
                'translations' => ['fr' => 'Photographie', 'ar' => 'تصوير', 'en' => 'Photography'],
            ],
            [
                'name' => 'Topographie', 'icon' => '📐',
                'description' => 'Topographie, bornage et relevés de terrain',
                'translations' => ['fr' => 'Topographie', 'ar' => 'مساحة ورسم خرائط', 'en' => 'Surveying & Topography'],
            ],

            // ── Nouvelles catégories (22–70) ──────────────────────────────
            [
                'name' => 'Alarme', 'icon' => '🔒',
                'description' => 'Installation de systèmes d\'alarme et de vidéosurveillance',
                'translations' => ['fr' => 'Alarme & Sécurité', 'ar' => 'أنظمة الإنذار والأمن', 'en' => 'Alarm & Security'],
            ],
            [
                'name' => 'Platrier', 'icon' => '🪣',
                'description' => 'Travaux de plâtrerie et enduits',
                'translations' => ['fr' => 'Plâtrerie', 'ar' => 'جبس', 'en' => 'Plastering'],
            ],
            [
                'name' => 'Facadier', 'icon' => '🏢',
                'description' => 'Ravalement et isolation de façades',
                'translations' => ['fr' => 'Façadier', 'ar' => 'واجهات', 'en' => 'Facade Work'],
            ],
            [
                'name' => 'Toiture', 'icon' => '🏠',
                'description' => 'Pose et rénovation de toitures et couvertures',
                'translations' => ['fr' => 'Toiture & Couverture', 'ar' => 'أسطح وتغطية', 'en' => 'Roofing'],
            ],
            [
                'name' => 'MecaniqueAuto', 'icon' => '🚗',
                'description' => 'Réparation et entretien de véhicules',
                'translations' => ['fr' => 'Mécanique auto', 'ar' => 'ميكانيك السيارات', 'en' => 'Auto Mechanics'],
            ],
            [
                'name' => 'Electronique', 'icon' => '📺',
                'description' => 'Réparation d\'appareils électroniques',
                'translations' => ['fr' => 'Électronique', 'ar' => 'إلكترونيات', 'en' => 'Electronics'],
            ],
            [
                'name' => 'Telephonie', 'icon' => '📱',
                'description' => 'Réparation et dépannage de smartphones et tablettes',
                'translations' => ['fr' => 'Réparation téléphone', 'ar' => 'إصلاح الهواتف', 'en' => 'Phone Repair'],
            ],
            [
                'name' => 'Parquet', 'icon' => '🪵',
                'description' => 'Pose de parquet, stratifié et revêtements de sol',
                'translations' => ['fr' => 'Parquet & Revêtements', 'ar' => 'باركيه وأرضيات', 'en' => 'Flooring'],
            ],
            [
                'name' => 'Isolation', 'icon' => '🌡️',
                'description' => 'Isolation thermique et acoustique',
                'translations' => ['fr' => 'Isolation thermique', 'ar' => 'عزل حراري', 'en' => 'Thermal Insulation'],
            ],
            [
                'name' => 'Etancheite', 'icon' => '💧',
                'description' => 'Étanchéité toiture, terrasse et fondations',
                'translations' => ['fr' => 'Étanchéité', 'ar' => 'عزل مائي', 'en' => 'Waterproofing'],
            ],
            [
                'name' => 'Piscine', 'icon' => '🏊',
                'description' => 'Construction et entretien de piscines',
                'translations' => ['fr' => 'Piscine', 'ar' => 'حمام سباحة', 'en' => 'Pool Maintenance'],
            ],
            [
                'name' => 'Marbre', 'icon' => '💎',
                'description' => 'Pose et entretien de marbre, granit et pierre naturelle',
                'translations' => ['fr' => 'Marbre & Pierre', 'ar' => 'رخام وحجر', 'en' => 'Marble & Stone'],
            ],
            [
                'name' => 'Ferronnerie', 'icon' => '⚙️',
                'description' => 'Ferronnerie d\'art, grilles et rampes',
                'translations' => ['fr' => 'Ferronnerie', 'ar' => 'حدادة فنية', 'en' => 'Ironwork'],
            ],
            [
                'name' => 'Portail', 'icon' => '🚪',
                'description' => 'Installation de portails, clôtures et barrières',
                'translations' => ['fr' => 'Portail & Clôture', 'ar' => 'بوابات وأسوار', 'en' => 'Gates & Fences'],
            ],
            [
                'name' => 'Volets', 'icon' => '🪟',
                'description' => 'Installation de volets roulants, stores et moustiquaires',
                'translations' => ['fr' => 'Volets & Stores', 'ar' => 'مصاريع وستائر', 'en' => 'Shutters & Blinds'],
            ],
            [
                'name' => 'Cuisine', 'icon' => '🍳',
                'description' => 'Conception et installation de cuisines équipées',
                'translations' => ['fr' => 'Cuisine équipée', 'ar' => 'مطابخ مجهزة', 'en' => 'Kitchen Installation'],
            ],
            [
                'name' => 'SalleDeBain', 'icon' => '🛁',
                'description' => 'Rénovation et aménagement de salles de bain',
                'translations' => ['fr' => 'Salle de bain', 'ar' => 'حمامات', 'en' => 'Bathroom Renovation'],
            ],
            [
                'name' => 'Dressing', 'icon' => '👗',
                'description' => 'Fabrication et installation de dressings et placards',
                'translations' => ['fr' => 'Dressing & Placards', 'ar' => 'خزائن ملابس', 'en' => 'Wardrobe'],
            ],
            [
                'name' => 'Escalier', 'icon' => '🪜',
                'description' => 'Fabrication et rénovation d\'escaliers',
                'translations' => ['fr' => 'Escalier', 'ar' => 'درج', 'en' => 'Stairs'],
            ],
            [
                'name' => 'Plafond', 'icon' => '🏛️',
                'description' => 'Pose de faux-plafonds et cloisons',
                'translations' => ['fr' => 'Faux-Plafond', 'ar' => 'أسقف مستعارة', 'en' => 'False Ceiling'],
            ],
            [
                'name' => 'Moustiquaire', 'icon' => '🕸️',
                'description' => 'Pose de moustiquaires fixes et enroulables',
                'translations' => ['fr' => 'Moustiquaire', 'ar' => 'شبكات حشرات', 'en' => 'Mosquito Nets'],
            ],
            [
                'name' => 'NettoyageVitre', 'icon' => '🪟',
                'description' => 'Nettoyage de vitres et façades vitrées',
                'translations' => ['fr' => 'Nettoyage de vitres', 'ar' => 'تنظيف زجاج', 'en' => 'Window Cleaning'],
            ],
            [
                'name' => 'BabySitter', 'icon' => '👶',
                'description' => 'Garde d\'enfants à domicile',
                'translations' => ['fr' => 'Baby-sitter', 'ar' => 'جليسة أطفال', 'en' => 'Babysitting'],
            ],
            [
                'name' => 'AidePersonnes', 'icon' => '🤝',
                'description' => 'Aide à domicile pour personnes âgées ou handicapées',
                'translations' => ['fr' => 'Aide aux personnes âgées', 'ar' => 'رعاية كبار السن', 'en' => 'Elder Care'],
            ],
            [
                'name' => 'CoursParticuliers', 'icon' => '📚',
                'description' => 'Cours particuliers tous niveaux et matières',
                'translations' => ['fr' => 'Cours particuliers', 'ar' => 'دروس خصوصية', 'en' => 'Private Tutoring'],
            ],
            [
                'name' => 'Traduction', 'icon' => '🌍',
                'description' => 'Traduction de documents et interprétariat',
                'translations' => ['fr' => 'Traduction', 'ar' => 'ترجمة', 'en' => 'Translation'],
            ],
            [
                'name' => 'Comptabilite', 'icon' => '🧾',
                'description' => 'Comptabilité, fiscalité et conseil financier',
                'translations' => ['fr' => 'Comptabilité', 'ar' => 'محاسبة', 'en' => 'Accounting'],
            ],
            [
                'name' => 'Juridique', 'icon' => '⚖️',
                'description' => 'Conseil juridique et assistance légale',
                'translations' => ['fr' => 'Conseil juridique', 'ar' => 'استشارات قانونية', 'en' => 'Legal Services'],
            ],
            [
                'name' => 'Architecture', 'icon' => '📏',
                'description' => 'Architecture, plans et permis de construire',
                'translations' => ['fr' => 'Architecture', 'ar' => 'هندسة معمارية', 'en' => 'Architecture'],
            ],
            [
                'name' => 'DesignGraphique', 'icon' => '🎭',
                'description' => 'Identité visuelle, logo et supports graphiques',
                'translations' => ['fr' => 'Design graphique', 'ar' => 'تصميم جرافيك', 'en' => 'Graphic Design'],
            ],
            [
                'name' => 'WebDev', 'icon' => '🌐',
                'description' => 'Création de sites web et applications',
                'translations' => ['fr' => 'Développement web', 'ar' => 'تطوير مواقع', 'en' => 'Web Development'],
            ],
            [
                'name' => 'Marketing', 'icon' => '📣',
                'description' => 'Marketing digital, réseaux sociaux et SEO',
                'translations' => ['fr' => 'Marketing digital', 'ar' => 'تسويق رقمي', 'en' => 'Digital Marketing'],
            ],
            [
                'name' => 'Traiteur', 'icon' => '🍽️',
                'description' => 'Service traiteur pour événements et réceptions',
                'translations' => ['fr' => 'Traiteur', 'ar' => 'طعام وضيافة', 'en' => 'Catering'],
            ],
            [
                'name' => 'Evenementiel', 'icon' => '🎉',
                'description' => 'Organisation de mariages, fêtes et événements',
                'translations' => ['fr' => 'Événementiel', 'ar' => 'تنظيم فعاليات', 'en' => 'Event Planning'],
            ],
            [
                'name' => 'GardeAnimaux', 'icon' => '🐾',
                'description' => 'Garde et promenade d\'animaux de compagnie',
                'translations' => ['fr' => 'Garde d\'animaux', 'ar' => 'رعاية الحيوانات', 'en' => 'Pet Care'],
            ],
            [
                'name' => 'Veterinaire', 'icon' => '🩺',
                'description' => 'Soins vétérinaires à domicile',
                'translations' => ['fr' => 'Vétérinaire', 'ar' => 'طب بيطري', 'en' => 'Veterinary'],
            ],
            [
                'name' => 'CoachSportif', 'icon' => '💪',
                'description' => 'Coaching sportif et fitness personnalisé',
                'translations' => ['fr' => 'Coach sportif', 'ar' => 'مدرب رياضي', 'en' => 'Sports Coach'],
            ],
            [
                'name' => 'Bien-etre', 'icon' => '🧘',
                'description' => 'Yoga, méditation et bien-être',
                'translations' => ['fr' => 'Bien-être & Yoga', 'ar' => 'صحة ورياضة', 'en' => 'Wellness & Yoga'],
            ],
            [
                'name' => 'Esthetique', 'icon' => '💅',
                'description' => 'Soins esthétiques et beauté à domicile',
                'translations' => ['fr' => 'Esthétique', 'ar' => 'تجميل', 'en' => 'Beauty & Aesthetics'],
            ],
            [
                'name' => 'Massage', 'icon' => '🧖',
                'description' => 'Massage thérapeutique et relaxation',
                'translations' => ['fr' => 'Massage', 'ar' => 'مساج', 'en' => 'Massage'],
            ],
            [
                'name' => 'Maquillage', 'icon' => '💄',
                'description' => 'Maquillage professionnel pour mariages et événements',
                'translations' => ['fr' => 'Maquillage', 'ar' => 'مكياج', 'en' => 'Makeup'],
            ],
            [
                'name' => 'Couture', 'icon' => '🧵',
                'description' => 'Couture, retouches et broderie',
                'translations' => ['fr' => 'Couture & Broderie', 'ar' => 'خياطة وتطريز', 'en' => 'Sewing & Embroidery'],
            ],
            [
                'name' => 'Pressing', 'icon' => '👕',
                'description' => 'Pressing, nettoyage et repassage de vêtements',
                'translations' => ['fr' => 'Pressing', 'ar' => 'غسيل ملابس', 'en' => 'Laundry'],
            ],
            [
                'name' => 'Livraison', 'icon' => '🚚',
                'description' => 'Livraison de colis et courses à domicile',
                'translations' => ['fr' => 'Livraison', 'ar' => 'توصيل', 'en' => 'Delivery'],
            ],
            [
                'name' => 'Carrosserie', 'icon' => '🚘',
                'description' => 'Carrosserie et peinture automobile',
                'translations' => ['fr' => 'Carrosserie auto', 'ar' => 'هيكلة السيارات', 'en' => 'Auto Body Repair'],
            ],
            [
                'name' => 'Pergola', 'icon' => '🌳',
                'description' => 'Installation de pergolas, tonnelles et terrasses',
                'translations' => ['fr' => 'Pergola & Terrasse', 'ar' => 'بيرغولا وتراس', 'en' => 'Pergola & Terrace'],
            ],
            [
                'name' => 'PanneauxSolaires', 'icon' => '☀️',
                'description' => 'Installation de panneaux solaires photovoltaïques',
                'translations' => ['fr' => 'Panneaux solaires', 'ar' => 'ألواح شمسية', 'en' => 'Solar Panels'],
            ],
            [
                'name' => 'Ascenseur', 'icon' => '🛗',
                'description' => 'Installation et maintenance d\'ascenseurs',
                'translations' => ['fr' => 'Ascenseur', 'ar' => 'مصعد', 'en' => 'Elevator'],
            ],
            [
                'name' => 'Domotique', 'icon' => '🏡',
                'description' => 'Maison connectée, automatisation et domotique',
                'translations' => ['fr' => 'Domotique', 'ar' => 'منزل ذكي', 'en' => 'Smart Home'],
            ],
        ];

        foreach ($categories as $i => $cat) {
            $slug   = Str::slug($cat['name']);
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
                DB::table('categories')->where('name', $cat['name'])->update([
                    'icon'         => $data['icon'],
                    'translations' => $data['translations'],
                    'sort_order'   => $data['sort_order'],
                    'updated_at'   => now(),
                ]);
            } else {
                DB::table('categories')->insert(array_merge($data, ['created_at' => now()]));
            }
        }
    }
}
