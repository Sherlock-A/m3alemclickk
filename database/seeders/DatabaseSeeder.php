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

    // Unsplash portrait photos — each pro gets a unique one
    private static array $photos = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545167622-83bade800b63?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562788869-4ed32648eb72?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1615109398623-88086a70537b?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568602471122-9bcb1dce0c8a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607746882042-944635dfe10a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522338242-43f18e0c7f2a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1548544149-4835e62ee5b3?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1592188657297-c6473609f988?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504199367641-aba8151af406?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1553267751-1c148a7280a1?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=400&auto=format&fit=crop',
    ];

    // Portfolio photos keyed by category
    private static array $portfolios = [
        'Plomberie'    => ['photo-1504307651254-35680f356dfd','photo-1581092335397-9583eb92d232','photo-1585771724684-38269d6639fd'],
        'Electricite'  => ['photo-1621905251918-48416bd8575a','photo-1558618047-30ea1a7aa2f0','photo-1555664946-6efea1b0e28c'],
        'Peinture'     => ['photo-1589939705400-57af4b8e1f9a','photo-1562259949-e8e7290bd9e0','photo-1558618666-fcd25c85cd64'],
        'Climatisation'=> ['photo-1527484500625-6e23a4c2e27a','photo-1558618666-fcd25c85cd64','photo-1621905251918-48416bd8575a'],
        'Menuiserie'   => ['photo-1567225591-f2e1aca75cb5','photo-1622021142947-da7dedc7c39a','photo-1558618666-fcd25c85cd64'],
        'Menage'       => ['photo-1581578731548-c64695cc6952','photo-1585771724684-38269d6639fd','photo-1556909114-f6e7ad7d3136'],
        'Maconnerie'   => ['photo-1590935216052-f37b9a6f8e5b','photo-1504307651254-35680f356dfd','photo-1524484485831-a92fcc0a3a5a'],
        'Serrurerie'   => ['photo-1558618047-30ea1a7aa2f0','photo-1519085360753-af0119f7cbe7','photo-1558618666-fcd25c85cd64'],
        'Jardinage'    => ['photo-1416879595882-3373a0480b5b','photo-1558618666-fcd25c85cd64','photo-1585771724684-38269d6639fd'],
        'Informatique' => ['photo-1518770660439-4636190af475','photo-1558618666-fcd25c85cd64','photo-1573496359142-b8d87734a5a2'],
        'Demenagement' => ['photo-1600518464441-9154a4dea21b','photo-1416879595882-3373a0480b5b','photo-1558618666-fcd25c85cd64'],
        'Soudure'      => ['photo-1504917595217-d5f5f836e2aa','photo-1590935216052-f37b9a6f8e5b','photo-1558618666-fcd25c85cd64'],
        'Carrelage'    => ['photo-1600607688066-890987f18a86','photo-1590935216052-f37b9a6f8e5b','photo-1558618666-fcd25c85cd64'],
        'Vitrerie'     => ['photo-1524484485831-a92fcc0a3a5a','photo-1558618666-fcd25c85cd64','photo-1590935216052-f37b9a6f8e5b'],
        'Chauffage'    => ['photo-1504307651254-35680f356dfd','photo-1558618666-fcd25c85cd64','photo-1621905251918-48416bd8575a'],
        'Decoration'   => ['photo-1524484485831-a92fcc0a3a5a','photo-1556909114-f6e7ad7d3136','photo-1558618666-fcd25c85cd64'],
        'Nettoyage'    => ['photo-1581578731548-c64695cc6952','photo-1585771724684-38269d6639fd','photo-1558618666-fcd25c85cd64'],
        'Charpenterie' => ['photo-1567225591-f2e1aca75cb5','photo-1590935216052-f37b9a6f8e5b','photo-1558618666-fcd25c85cd64'],
        'Coiffure'     => ['photo-1560066984-138daef5473b','photo-1522338242-43f18e0c7f2a','photo-1585771724684-38269d6639fd'],
        'Photographie' => ['photo-1516035069-f6e1c4f7d0ec','photo-1542038374117-b8a5b14d6f6e','photo-1558618666-fcd25c85cd64'],
    ];

    private static array $descriptions = [
        'Plomberie'    => 'Plombier expérimenté, spécialisé en réparation de fuites, installation de chauffe-eau et débouchage. Intervention rapide 7j/7 sur Casablanca et alentours. Devis gratuit.',
        'Electricite'  => 'Électricien certifié, installations conformes aux normes. Tableau électrique, prises, éclairage LED, dépannage urgence. Travail soigné garanti.',
        'Peinture'     => 'Peintre qualifié, peinture intérieure et extérieure, enduits, finitions impeccables. Matériaux de qualité, délais respectés. Transformez votre espace.',
        'Climatisation'=> 'Technicien froid et climatisation agréé. Installation, maintenance et réparation de tous systèmes: split, cassette, VRF. Garantie constructeur.',
        'Menuiserie'   => 'Menuisier artisan, fabrication sur-mesure: cuisines, dressings, portes, fenêtres PVC et aluminium. Bois massif et panneaux de qualité supérieure.',
        'Menage'       => 'Service de ménage professionnel à domicile. Nettoyage complet, repassage, vitres. Produits écologiques. Personnel de confiance, discret et ponctuel.',
        'Maconnerie'   => 'Maçon qualifié, construction, rénovation, extension. Maçonnerie traditionnelle et moderne. Fondations, murs, dalles béton. Devis détaillé offert.',
        'Serrurerie'   => 'Serrurier agréé, ouverture de portes, remplacement de serrures 3 points, blindage de portes. Urgence 24h/24. Intervention en moins de 30 minutes.',
        'Jardinage'    => 'Jardinier paysagiste, entretien régulier de jardins, taille d\'arbres et haies, création de pelouses et massifs floraux. Résultats garantis.',
        'Informatique' => 'Technicien informatique, dépannage PC/Mac, installation logiciels, réseau Wi-Fi, récupération de données, formation à domicile. Tarif honnête.',
        'Demenagement' => 'Déménageur professionnel avec camion équipé. Emballage sécurisé, transport, montage/démontage de meubles. Assurance incluse. Devis gratuit.',
        'Soudure'      => 'Soudeur-métalliste, fabrication de portails, grilles, garde-corps, structures métalliques sur-mesure. Soudure MIG/TIG. Travail soigné et durable.',
        'Carrelage'    => 'Carreleur expert, pose de carrelage sol et mur, faïence, mosaïque, marbre. Rénovation salle de bain et cuisine. Finitions parfaites garanties.',
        'Vitrerie'     => 'Vitrier qualifié, remplacement de vitres cassées, miroirs, double vitrage, verrière. Intervention rapide sur toute la région. Devis gratuit.',
        'Chauffage'    => 'Chauffagiste certifié, installation et entretien de chaudières gaz, fuel, granulés. Plancher chauffant, radiateurs. Contrat de maintenance disponible.',
        'Decoration'   => 'Décorateur d\'intérieur, conception et réalisation de projets d\'aménagement. Du salon à la chambre, créez un espace qui vous ressemble. Visite offerte.',
        'Nettoyage'    => 'Société de nettoyage professionnelle, locaux commerciaux, bureaux, après-chantier, vitres en hauteur. Matériel industriel, équipes formées.',
        'Charpenterie' => 'Charpentier couvreur, charpente bois traditionnelle et industrielle, rénovation toiture, zinguerie. Travaux soignés dans les règles de l\'art.',
        'Coiffure'     => 'Coiffeur à domicile pour femmes et hommes. Coupe, couleur, brushing, coiffure de mariage. Produits professionnels. Disponible soirs et week-ends.',
        'Photographie' => 'Photographe professionnel, mariages, portraits, événements d\'entreprise, reportages. Retouche incluse, livraison numérique haute résolution sous 7 jours.',
    ];

    private function seedProfessionals(): void
    {
        $professionals = [
            // ── Plomberie ──────────────────────────────────────────────────
            ['name' => 'Youssef El Alami',      'phone' => '0661234501', 'profession' => 'Plombier',               'category' => 'Plomberie',    'city' => 'Casablanca', 'cities' => ['Mohammedia','El Jadida'],     'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.8, 'views' => 420, 'wa' => 85,  'calls' => 62,  'missions' => 134, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Redouane Guenoun',       'phone' => '0661234532', 'profession' => 'Plombier Sanitaire',     'category' => 'Plomberie',    'city' => 'Tanger',     'cities' => ['Tetouan','Larache'],         'lat' => 35.7595, 'lng' => -5.8340,  'rating' => 4.6, 'views' => 312, 'wa' => 66,  'calls' => 48,  'missions' => 91,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Amazigh']],
            ['name' => 'Brahim El Kheir',        'phone' => '0661234545', 'profession' => 'Plombier Chauffagiste',  'category' => 'Plomberie',    'city' => 'Meknes',     'cities' => ['Fes','Ifrane'],              'lat' => 33.8730, 'lng' => -5.5546,  'rating' => 4.4, 'views' => 198, 'wa' => 41,  'calls' => 29,  'missions' => 58,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Electricite ────────────────────────────────────────────────
            ['name' => 'Hassan Benali',          'phone' => '0661234502', 'profession' => 'Electricien',            'category' => 'Electricite',  'city' => 'Rabat',      'cities' => ['Sale','Temara'],             'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.7, 'views' => 380, 'wa' => 72,  'calls' => 55,  'missions' => 98,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Mehdi Ziyad',            'phone' => '0661234525', 'profession' => 'Electricien Batiment',   'category' => 'Electricite',  'city' => 'Marrakech',  'cities' => ['Agadir','Taroudant'],        'lat' => 31.6295, 'lng' => -7.9811,  'rating' => 4.9, 'views' => 543, 'wa' => 118, 'calls' => 84,  'missions' => 201, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Hamza Ait Benhaddou',    'phone' => '0661234538', 'profession' => 'Electricien Industriel', 'category' => 'Electricite',  'city' => 'Agadir',     'cities' => ['Inezgane','Tiznit'],         'lat' => 30.4278, 'lng' => -9.5981,  'rating' => 4.5, 'views' => 267, 'wa' => 55,  'calls' => 38,  'missions' => 79,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe','Amazigh']],

            // ── Peinture ───────────────────────────────────────────────────
            ['name' => 'Rachid Tazi',            'phone' => '0661234503', 'profession' => 'Peintre Batiment',       'category' => 'Peinture',     'city' => 'Marrakech',  'cities' => ['Essaouira','Safi'],          'lat' => 31.6295, 'lng' => -7.9811,  'rating' => 4.9, 'views' => 510, 'wa' => 110, 'calls' => 78,  'missions' => 187, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Tarik Oulhaj',           'phone' => '0661234526', 'profession' => 'Peintre Decorateur',     'category' => 'Peinture',     'city' => 'Tanger',     'cities' => ['Tetouan','Ceuta'],           'lat' => 35.7595, 'lng' => -5.8340,  'rating' => 4.7, 'views' => 388, 'wa' => 79,  'calls' => 57,  'missions' => 112, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Espagnol']],

            // ── Climatisation ──────────────────────────────────────────────
            ['name' => 'Khalid Mansouri',        'phone' => '0661234504', 'profession' => 'Tech Climatisation',     'category' => 'Climatisation','city' => 'Casablanca', 'cities' => ['Rabat','Kenitra'],           'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.6, 'views' => 295, 'wa' => 58,  'calls' => 41,  'missions' => 76,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Anas Karimi',            'phone' => '0661234527', 'profession' => 'Tech Froid et Clim',     'category' => 'Climatisation','city' => 'Rabat',      'cities' => ['Sale','Kenitra'],            'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.8, 'views' => 441, 'wa' => 92,  'calls' => 65,  'missions' => 143, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Menuiserie ─────────────────────────────────────────────────
            ['name' => 'Omar Chraibi',           'phone' => '0661234505', 'profession' => 'Menuisier',              'category' => 'Menuiserie',   'city' => 'Fes',        'cities' => ['Meknes','Rabat'],            'lat' => 34.0331, 'lng' => -5.0003,  'rating' => 4.5, 'views' => 210, 'wa' => 44,  'calls' => 33,  'missions' => 61,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Jamal Bennis',           'phone' => '0661234533', 'profession' => 'Menuisier Aluminium',    'category' => 'Menuiserie',   'city' => 'Casablanca', 'cities' => ['Mohammedia','Berrechid'],    'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.7, 'views' => 356, 'wa' => 73,  'calls' => 52,  'missions' => 108, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Hicham El Fassi',        'phone' => '0661234546', 'profession' => 'Charpentier Menuisier',  'category' => 'Menuiserie',   'city' => 'Meknes',     'cities' => ['Fes','Azrou'],               'lat' => 33.8730, 'lng' => -5.5546,  'rating' => 4.4, 'views' => 187, 'wa' => 38,  'calls' => 27,  'missions' => 54,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe']],

            // ── Menage ─────────────────────────────────────────────────────
            ['name' => 'Fatima Zahra Idrissi',   'phone' => '0661234506', 'profession' => 'Femme de menage',        'category' => 'Menage',       'city' => 'Casablanca', 'cities' => ['Mohammedia','Berrechid'],    'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.9, 'views' => 640, 'wa' => 145, 'calls' => 89,  'missions' => 220, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Naima Khaldi',           'phone' => '0661234528', 'profession' => 'Aide Menagere',          'category' => 'Menage',       'city' => 'Rabat',      'cities' => ['Sale','Temara'],             'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.8, 'views' => 529, 'wa' => 121, 'calls' => 74,  'missions' => 183, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Khadija Ouali',          'phone' => '0661234539', 'profession' => 'Femme de menage',        'category' => 'Menage',       'city' => 'Casablanca', 'cities' => ['Ain Sebaa','Ain Chock'],     'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.7, 'views' => 413, 'wa' => 88,  'calls' => 61,  'missions' => 148, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe']],

            // ── Maconnerie ─────────────────────────────────────────────────
            ['name' => 'Mustapha Berrada',       'phone' => '0661234507', 'profession' => 'Macon',                  'category' => 'Maconnerie',   'city' => 'Tanger',     'cities' => ['Tetouan','Al Hoceima'],      'lat' => 35.7595, 'lng' => -5.8340,  'rating' => 4.4, 'views' => 175, 'wa' => 38,  'calls' => 25,  'missions' => 52,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe','Francais']],
            ['name' => 'Brahim El Amrani',       'phone' => '0661234529', 'profession' => 'Macon Renovateur',       'category' => 'Maconnerie',   'city' => 'Agadir',     'cities' => ['Inezgane','Ait Melloul'],    'lat' => 30.4278, 'lng' => -9.5981,  'rating' => 4.6, 'views' => 264, 'wa' => 54,  'calls' => 37,  'missions' => 77,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Amazigh']],

            // ── Serrurerie ─────────────────────────────────────────────────
            ['name' => 'Abdellatif Ouali',       'phone' => '0661234508', 'profession' => 'Serrurier',              'category' => 'Serrurerie',   'city' => 'Agadir',     'cities' => ['Inezgane','Tiznit'],         'lat' => 30.4278, 'lng' => -9.5981,  'rating' => 4.7, 'views' => 330, 'wa' => 67,  'calls' => 91,  'missions' => 109, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Amazigh']],
            ['name' => 'Lahcen Amhane',          'phone' => '0661234534', 'profession' => 'Serrurier Urgence',      'category' => 'Serrurerie',   'city' => 'Fes',        'cities' => ['Meknes','Sefrou'],           'lat' => 34.0331, 'lng' => -5.0003,  'rating' => 4.8, 'views' => 497, 'wa' => 104, 'calls' => 138, 'missions' => 176, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Jardinage ──────────────────────────────────────────────────
            ['name' => 'Karim Elhajjami',        'phone' => '0661234509', 'profession' => 'Jardinier',              'category' => 'Jardinage',    'city' => 'Rabat',      'cities' => ['Kenitra','Sale'],            'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.6, 'views' => 195, 'wa' => 41,  'calls' => 28,  'missions' => 73,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Ali Bouazza',            'phone' => '0661234535', 'profession' => 'Paysagiste Jardinier',   'category' => 'Jardinage',    'city' => 'Casablanca', 'cities' => ['Mohammedia','Bouskoura'],    'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.9, 'views' => 612, 'wa' => 132, 'calls' => 88,  'missions' => 199, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Informatique ───────────────────────────────────────────────
            ['name' => 'Samir Lahlou',           'phone' => '0661234510', 'profession' => 'Tech Informatique',      'category' => 'Informatique', 'city' => 'Casablanca', 'cities' => ['Rabat','Mohammedia'],        'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.8, 'views' => 488, 'wa' => 102, 'calls' => 67,  'missions' => 156, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Anglais']],
            ['name' => 'Younes El Fassi',        'phone' => '0661234536', 'profession' => 'Technicien Reseau',      'category' => 'Informatique', 'city' => 'Marrakech',  'cities' => ['Casablanca','Agadir'],       'lat' => 31.6295, 'lng' => -7.9811,  'rating' => 4.7, 'views' => 375, 'wa' => 77,  'calls' => 53,  'missions' => 112, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Anglais']],
            ['name' => 'Nadia Belkacem',         'phone' => '0661234540', 'profession' => 'Tech Support Informatique','category' => 'Informatique','city' => 'Casablanca','cities' => ['Rabat','Sale'],              'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.9, 'views' => 558, 'wa' => 119, 'calls' => 81,  'missions' => 176, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Anglais']],

            // ── Demenagement ───────────────────────────────────────────────
            ['name' => 'Nabil Sqalli',           'phone' => '0661234511', 'profession' => 'Demenageur',             'category' => 'Demenagement', 'city' => 'Casablanca', 'cities' => ['Rabat','Marrakech'],         'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.5, 'views' => 260, 'wa' => 54,  'calls' => 39,  'missions' => 87,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe','Francais']],
            ['name' => 'Hassan Guerraoui',       'phone' => '0661234537', 'profession' => 'Demenageur Professionnel','category' => 'Demenagement','city' => 'Tanger',    'cities' => ['Tetouan','Kenitra'],         'lat' => 35.7595, 'lng' => -5.8340,  'rating' => 4.7, 'views' => 341, 'wa' => 70,  'calls' => 49,  'missions' => 103, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Espagnol']],

            // ── Soudure ────────────────────────────────────────────────────
            ['name' => 'Driss Kettani',          'phone' => '0661234512', 'profession' => 'Soudeur',                'category' => 'Soudure',      'city' => 'Oujda',      'cities' => ['Nador','Fes'],               'lat' => 34.6814, 'lng' => -1.9086,  'rating' => 4.3, 'views' => 148, 'wa' => 32,  'calls' => 21,  'missions' => 44,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe']],
            ['name' => 'Abdeslam Qaissi',        'phone' => '0661234541', 'profession' => 'Soudeur Metalliste',     'category' => 'Soudure',      'city' => 'Agadir',     'cities' => ['Inezgane','Biougra'],        'lat' => 30.4278, 'lng' => -9.5981,  'rating' => 4.6, 'views' => 231, 'wa' => 47,  'calls' => 33,  'missions' => 68,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Amazigh']],

            // ── Carrelage ──────────────────────────────────────────────────
            ['name' => 'Mohammed Rifai',         'phone' => '0661234513', 'profession' => 'Carreleur',              'category' => 'Carrelage',    'city' => 'Fes',        'cities' => ['Meknes','Sefrou'],           'lat' => 34.0331, 'lng' => -5.0003,  'rating' => 4.7, 'views' => 357, 'wa' => 74,  'calls' => 52,  'missions' => 116, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Mourad Slimani',         'phone' => '0661234542', 'profession' => 'Carreleur Faienceur',    'category' => 'Carrelage',    'city' => 'Rabat',      'cities' => ['Sale','Kenitra'],            'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.8, 'views' => 428, 'wa' => 89,  'calls' => 63,  'missions' => 131, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Vitrerie ───────────────────────────────────────────────────
            ['name' => 'Aziz Cherkaoui',         'phone' => '0661234514', 'profession' => 'Vitrier',                'category' => 'Vitrerie',     'city' => 'Casablanca', 'cities' => ['Mohammedia','El Jadida'],    'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.6, 'views' => 289, 'wa' => 59,  'calls' => 42,  'missions' => 88,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Chauffage ──────────────────────────────────────────────────
            ['name' => 'Bilal Moussaoui',        'phone' => '0661234515', 'profession' => 'Chauffagiste',           'category' => 'Chauffage',    'city' => 'Tanger',     'cities' => ['Tetouan','Larache'],         'lat' => 35.7595, 'lng' => -5.8340,  'rating' => 4.5, 'views' => 213, 'wa' => 44,  'calls' => 31,  'missions' => 65,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Decoration ─────────────────────────────────────────────────
            ['name' => 'Karim Tahiri',           'phone' => '0661234516', 'profession' => 'Decorateur Interieur',   'category' => 'Decoration',   'city' => 'Marrakech',  'cities' => ['Casablanca','Rabat'],        'lat' => 31.6295, 'lng' => -7.9811,  'rating' => 4.8, 'views' => 466, 'wa' => 98,  'calls' => 68,  'missions' => 142, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Anglais']],
            ['name' => 'Ilham Benkirane',        'phone' => '0661234543', 'profession' => 'Designer Interieur',     'category' => 'Decoration',   'city' => 'Marrakech',  'cities' => ['Casablanca','Essaouira'],    'lat' => 31.6295, 'lng' => -7.9811,  'rating' => 4.9, 'views' => 589, 'wa' => 126, 'calls' => 82,  'missions' => 191, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Anglais']],

            // ── Nettoyage ──────────────────────────────────────────────────
            ['name' => 'Soufiane El Kadi',       'phone' => '0661234517', 'profession' => 'Agent de Nettoyage',     'category' => 'Nettoyage',    'city' => 'Casablanca', 'cities' => ['Mohammedia','Bouskoura'],    'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.5, 'views' => 208, 'wa' => 43,  'calls' => 30,  'missions' => 62,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Charpenterie ───────────────────────────────────────────────
            ['name' => 'Abderrahman Squali',     'phone' => '0661234518', 'profession' => 'Charpentier Couvreur',   'category' => 'Charpenterie', 'city' => 'Fes',        'cities' => ['Meknes','Rabat'],            'lat' => 34.0331, 'lng' => -5.0003,  'rating' => 4.4, 'views' => 176, 'wa' => 36,  'calls' => 25,  'missions' => 51,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Coiffure ───────────────────────────────────────────────────
            ['name' => 'Yassine Benali',         'phone' => '0661234519', 'profession' => 'Coiffeur a Domicile',    'category' => 'Coiffure',     'city' => 'Rabat',      'cities' => ['Sale','Temara'],             'lat' => 34.0209, 'lng' => -6.8416,  'rating' => 4.7, 'views' => 381, 'wa' => 79,  'calls' => 55,  'missions' => 117, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],
            ['name' => 'Loubna Ezzahra',         'phone' => '0661234544', 'profession' => 'Coiffeuse Visagiste',    'category' => 'Coiffure',     'city' => 'Casablanca', 'cities' => ['Mohammedia','Berrechid'],    'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.9, 'views' => 674, 'wa' => 152, 'calls' => 93,  'missions' => 238, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais']],

            // ── Photographie ───────────────────────────────────────────────
            ['name' => 'Ayoub Eddahbi',          'phone' => '0661234520', 'profession' => 'Photographe Evenementiel','category' => 'Photographie','city' => 'Casablanca','cities' => ['Rabat','Marrakech'],         'lat' => 33.5731, 'lng' => -7.5898,  'rating' => 4.8, 'views' => 453, 'wa' => 95,  'calls' => 66,  'missions' => 139, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Francais','Anglais']],
        ];

        $reviews = [
            ['Excellent travail, très professionnel et ponctuel. Je recommande vivement !', 5],
            ['Bon rapport qualité-prix, travail soigné et propre. Très satisfait.', 5],
            ['Intervention rapide, problème résolu en moins d\'une heure. Merci !', 5],
            ['Professionnel sérieux, explique bien son intervention. À contacter sans hésiter.', 4],
            ['Très bon service, disponible même le week-end. Travail impeccable.', 4],
            ['Efficace et discret, respecte les horaires. Je recommande.', 4],
            ['Très compétent, matériel de qualité. Je ferai de nouveau appel à ses services.', 5],
            ['Service rapide et honnête. Prix raisonnable et transparence totale.', 4],
            ['Excellent artisan, travail soigné et propre. Aucun débordement de chantier.', 5],
            ['Ponctuel, professionnel et sympathique. Résultat au-delà de mes attentes.', 5],
            ['Un vrai professionnel, je lui fais confiance les yeux fermés. Parfait.', 4],
            ['Très bon service après-vente, suivi rigoureux. Vraiment sérieux.', 4],
        ];

        $clientNames = [
            'Hamid Bensouda', 'Aicha Tahiri', 'Mohamed Berrada', 'Nadia Skali',
            'Younes Lamrani', 'Samira El Fassi', 'Abdou Rami', 'Zineb Chaoui',
            'Yousra Amrani', 'Mehdi Lazrak', 'Fatima Lahlou', 'Kamal Ziani',
        ];

        foreach ($professionals as $i => $data) {
            $category = DB::table('categories')->where('name', $data['category'])->first();
            if (! $category) {
                continue;
            }
            if (DB::table('professionals')->where('phone', $data['phone'])->exists()) {
                continue;
            }

            $slug = Str::slug($data['name'] . '-' . $data['profession']);
            $base = $slug; $n = 1;
            while (DB::table('professionals')->where('slug', $slug)->exists()) {
                $slug = $base . '-' . $n++;
            }

            // Pick unique photo and portfolio for this professional
            $photo     = self::$photos[$i % count(self::$photos)];
            $portIds   = self::$portfolios[$data['category']] ?? [];
            $portfolio = array_map(
                fn ($id) => "https://images.unsplash.com/{$id}?q=80&w=800&auto=format&fit=crop",
                array_slice($portIds, 0, 3)
            );

            $desc = self::$descriptions[$data['category']]
                ?? 'Professionnel expérimenté, disponible pour interventions à domicile. Travail soigné et prix honnête. Devis gratuit.';

            $proId = DB::table('professionals')->insertGetId([
                'category_id'        => $category->id,
                'name'               => $data['name'],
                'slug'               => $slug,
                'phone'              => $data['phone'],
                'profession'         => $data['profession'],
                'main_city'          => $data['city'],
                'travel_cities'      => json_encode($data['cities']),
                'languages'          => json_encode($data['langs']),
                'description'        => $desc,
                'photo'              => $photo,
                'portfolio'          => json_encode($portfolio),
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
                'created_at'         => now()->subDays(rand(1, 180)),
                'updated_at'         => now(),
            ]);

            // Pro user account
            $email = 'pro' . ($i + 1) . '@m3allemclick.ma';
            if (! DB::table('users')->where('email', $email)->exists()) {
                DB::table('users')->insert([
                    'name'            => $data['name'],
                    'email'           => $email,
                    'password'        => Hash::make('password'),
                    'role'            => 'professional',
                    'status'          => 'active',
                    'professional_id' => $proId,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }

            // 3–4 reviews per professional
            $count = ($i % 3 === 0) ? 4 : 3;
            for ($r = 0; $r < $count; $r++) {
                [$comment, $stars] = $reviews[($i * 4 + $r) % count($reviews)];
                DB::table('reviews')->insert([
                    'professional_id' => $proId,
                    'client_name'     => $clientNames[($i * 4 + $r) % count($clientNames)],
                    'rating'          => $stars,
                    'comment'         => $comment,
                    'approved'        => 1,
                    'created_at'      => now()->subDays(rand(1, 60)),
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
            ['email' => 'client3@m3allemclick.ma', 'name' => 'Yousra Tazi'],
        ];

        foreach ($clients as $client) {
            if (DB::table('users')->where('email', $client['email'])->exists()) {
                continue;
            }
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
