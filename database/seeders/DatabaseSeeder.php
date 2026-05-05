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

        // Données de test reproductibles (client/pro/admin @test.com)
        $this->call(TestDataSeeder::class);
    }

    // ── Portraits d'artisans / ouvriers (Unsplash — licence libre) ────────────
    private static array $photos = [
        // Artisans au travail — casques, uniformes, outils
        'https://images.unsplash.com/photo-1543357644-160b53c087e8?q=80&w=400&auto=format&fit=crop',  // casque jaune
        'https://images.unsplash.com/photo-1605018787514-72c0eff870bc?q=80&w=400&auto=format&fit=crop', // uniforme bleu
        'https://images.unsplash.com/photo-1646227655685-a530813759b3?q=80&w=400&auto=format&fit=crop', // casque blanc
        'https://images.unsplash.com/photo-1649769069590-268b0b994462?q=80&w=400&auto=format&fit=crop', // clés en main
        'https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?q=80&w=400&auto=format&fit=crop', // ouvrier chantier
        'https://images.unsplash.com/photo-1621905252472-943afaa20e20?q=80&w=400&auto=format&fit=crop', // portrait ouvrier
        'https://images.unsplash.com/photo-1630670401138-9a5c91abad18?q=80&w=400&auto=format&fit=crop', // technicien
        'https://images.unsplash.com/photo-1679679811837-c28b2586f533?q=80&w=400&auto=format&fit=crop', // pro extérieur
        // Hommes marocains / maghrébins
        'https://images.unsplash.com/photo-1660572343385-471989c53909?q=80&w=400&auto=format&fit=crop', // gilet orange
        'https://images.unsplash.com/photo-1713593673489-3abf4784345a?q=80&w=400&auto=format&fit=crop', // chemise rayée chapeau
        'https://images.unsplash.com/photo-1684012247658-f1d2b9e4b9be?q=80&w=400&auto=format&fit=crop', // homme turban
        'https://images.unsplash.com/photo-1632560958537-59c4ba374f02?q=80&w=400&auto=format&fit=crop', // turban bleu
        'https://images.unsplash.com/photo-1584386874123-e696f50fa53c?q=80&w=400&auto=format&fit=crop', // artisan bois
        'https://images.unsplash.com/photo-1732395805034-e0bf859665e5?q=80&w=400&auto=format&fit=crop', // uniforme terrain
        'https://images.unsplash.com/photo-1758876734777-dcc6981f3671?q=80&w=400&auto=format&fit=crop', // travailleur
        'https://images.unsplash.com/photo-1722898414188-df8e94b0cfee?q=80&w=400&auto=format&fit=crop', // pro extérieur
        'https://images.unsplash.com/photo-1748442001865-5583ec02ae22?q=80&w=400&auto=format&fit=crop', // inspection tuyaux
        'https://images.unsplash.com/photo-1591732706572-c023823375f8?q=80&w=400&auto=format&fit=crop', // électricien
        'https://images.unsplash.com/photo-1570624091335-e0a330dcdce2?q=80&w=400&auto=format&fit=crop', // constructeur
        'https://images.unsplash.com/photo-1609664843043-a66fbe0684bc?q=80&w=400&auto=format&fit=crop', // équipe chantier
        'https://images.unsplash.com/photo-1690473768476-44b5cebb7d80?q=80&w=400&auto=format&fit=crop', // ouvrier portrait
        'https://images.unsplash.com/photo-1759355642213-0dc484f9ebe0?q=80&w=400&auto=format&fit=crop', // homme casquette
        'https://images.unsplash.com/photo-1764328165995-0624c280a6d2?q=80&w=400&auto=format&fit=crop', // artisan atelier
        'https://images.unsplash.com/photo-1772442198620-3674b427e59e?q=80&w=400&auto=format&fit=crop', // ouvrier terrain
        'https://images.unsplash.com/photo-1776937482510-b794a7d0c267?q=80&w=400&auto=format&fit=crop', // pro souriant
        // Femmes professionnelles
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', // femme pro
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', // femme portrait
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=400&auto=format&fit=crop', // femme bureau
        'https://images.unsplash.com/photo-1607746882042-944635dfe10a?q=80&w=400&auto=format&fit=crop', // femme tech
        // Compléments
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568602471122-9bcb1dce0c8a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1615109398623-88086a70537b?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1562788869-4ed32648eb72?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1545167622-83bade800b63?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504199367641-aba8151af406?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=400&auto=format&fit=crop',
    ];

    // ── Photos de réalisations par catégorie (Unsplash) ───────────────────────
    private static array $portfolios = [
        'Plomberie'    => [
            'photo-1620626011761-996317b8d101', // salle de bain rénovée
            'photo-1661107259637-4e1c55462428', // salle de bain miroir
            'photo-1696987007764-7f8b85dd3033', // double vasque moderne
        ],
        'Electricite'  => [
            'photo-1767514536570-83d70c024247', // câblage pro
            'photo-1768321908749-92ba11a8693b', // installation tableau
            'photo-1768321911048-46171ac7d425', // boîtes électriques
        ],
        'Peinture'     => [
            'photo-1589939705400-57af4b8e1f9a', // salon peint moderne
            'photo-1562259949-e8e7290bd9e0',    // peinture décorative
            'photo-1600121848594-d8be78b7d7d5', // intérieur lumineux
        ],
        'Climatisation'=> [
            'photo-1527484500625-6e23a4c2e27a', // unité split
            'photo-1621905251918-48416bd8575a', // installation clim
            'photo-1590935216052-f37b9a6f8e5b', // technicien clim
        ],
        'Menuiserie'   => [
            'photo-1567225591-f2e1aca75cb5',    // cuisine bois
            'photo-1622021142947-da7dedc7c39a', // porte sur-mesure
            'photo-1533090368676-1fd25485db88', // atelier menuiserie
        ],
        'Menage'       => [
            'photo-1581578731548-c64695cc6952', // nettoyage salon
            'photo-1585771724684-38269d6639fd', // résultat propre
            'photo-1556909114-f6e7ad7d3136',    // ménage cuisine
        ],
        'Maconnerie'   => [
            'photo-1704005445445-2747074be8ac', // pose briques
            'photo-1701850009190-2859ba2aeea6', // ciment mur
            'photo-1704005446393-0262b4cb6877', // finition maçon
        ],
        'Serrurerie'   => [
            'photo-1558618047-30ea1a7aa2f0',    // serrure 3 points
            'photo-1562516142-5fb38dc47b82',    // porte blindée
            'photo-1584622781564-1d987f7333c1', // verrou sécurité
        ],
        'Jardinage'    => [
            'photo-1416879595882-3373a0480b5b', // jardin entretenu
            'photo-1585320806297-9794b3e4aaae', // taille haie
            'photo-1558618666-fcd25c85cd64',    // pelouse verte
        ],
        'Informatique' => [
            'photo-1518770660439-4636190af475', // réseau câbles
            'photo-1593642632559-0c6d3fc62b89', // réparation PC
            'photo-1549921296-3b0f9a35af35',    // dépannage informatique
        ],
        'Demenagement' => [
            'photo-1600518464441-9154a4dea21b', // cartons emballés
            'photo-1558618666-fcd25c85cd64',    // transport mobilier
            'photo-1416879595882-3373a0480b5b', // chargement camion
        ],
        'Soudure'      => [
            'photo-1504917595217-d5f5f836e2aa', // soudure arc
            'photo-1590935216052-f37b9a6f8e5b', // portail métal
            'photo-1558618666-fcd25c85cd64',    // grille forgée
        ],
        'Carrelage'    => [
            'photo-1600607688066-890987f18a86', // sol carrelé moderne
            'photo-1588854337236-6889d631faa8', // carrelage cuisine
            'photo-1604014237800-1c9102c219da', // salle de bain carrelée
        ],
        'Vitrerie'     => [
            'photo-1524484485831-a92fcc0a3a5a', // vitrine moderne
            'photo-1601760561441-16420502c7e0', // double vitrage
            'photo-1558618666-fcd25c85cd64',    // miroir sur-mesure
        ],
        'Chauffage'    => [
            'photo-1504307651254-35680f356dfd', // chaudière gaz
            'photo-1621905251918-48416bd8575a', // radiateur moderne
            'photo-1558618666-fcd25c85cd64',    // thermostat connecté
        ],
        'Decoration'   => [
            'photo-1586023492125-27b2c045efd7', // salon décoré
            'photo-1556909114-f6e7ad7d3136',    // chambre design
            'photo-1524484485831-a92fcc0a3a5a', // espace aménagé
        ],
        'Nettoyage'    => [
            'photo-1581578731548-c64695cc6952', // nettoyage bureau
            'photo-1585771724684-38269d6639fd', // local propre
            'photo-1556909114-f6e7ad7d3136',    // nettoyage vitres
        ],
        'Charpenterie' => [
            'photo-1567225591-f2e1aca75cb5',    // charpente bois
            'photo-1590935216052-f37b9a6f8e5b', // toiture
            'photo-1558618666-fcd25c85cd64',    // zinguerie
        ],
        'Coiffure'     => [
            'photo-1560066984-138daef5473b',    // coiffure femme
            'photo-1522338242-43f18e0c7f2a',    // coupe homme
            'photo-1522337360788-8b13dee7a37e', // salon coiffure
        ],
        'Photographie' => [
            'photo-1516035069-f6e1c4f7d0ec',    // mariage photo
            'photo-1542038374117-b8a5b14d6f6e', // portrait studio
            'photo-1533227268428-f9ed0900fb3b', // reportage événement
        ],
    ];

    // ── Descriptions personnalisées inspirées d'allopro.ma et harfiyin.com ────
    private static array $descriptions = [
        'Plomberie'    => 'Plombier professionnel — réparation fuites, installation chauffe-eau, rénovation salles de bains complètes. Disponible 7j/7, intervention en moins de 2h sur Casablanca et région. Devis gratuit.',
        'Electricite'  => 'Électricien certifié, installations aux normes. Tableau électrique, câblage, éclairage LED, dépannage urgence 24h. Travail soigné avec garantie. Attestation de conformité fournie.',
        'Peinture'     => 'Peintre bâtiment qualifié, peinture intérieure et extérieure, enduits décoratifs, revêtements muraux. Matériaux premium, délais respectés. Finitions impeccables, transformation garantie.',
        'Climatisation'=> 'Technicien froid et climatisation agréé. Installation, maintenance et réparation: split, cassette, VRF, reversible. Recharge gaz, nettoyage filtres. Garantie constructeur préservée.',
        'Menuiserie'   => 'Menuisier artisan, fabrication sur-mesure: cuisines équipées, dressings, portes PVC/alu, fenêtres, habillage mural bois. Bois massif et panneaux qualité supérieure. Pose professionnelle incluse.',
        'Menage'       => 'Service ménage professionnel à domicile — nettoyage complet, repassage, vitres, après-chantier. Personnel formé, discret et ponctuel. Produits fournis. Passage régulier ou ponctuel.',
        'Maconnerie'   => 'Maçon qualifié — construction, rénovation, extension. Maçonnerie traditionnelle et moderne: fondations, murs, dalles béton, escaliers. Travaux soignés, devis détaillé gratuit.',
        'Serrurerie'   => 'Serrurier agréé — ouverture de porte, remplacement serrure 3 points, blindage de porte, installation digicode. Urgence 24h/24, intervention garantie en moins de 30 minutes.',
        'Jardinage'    => 'Jardinier paysagiste — entretien régulier, taille arbres et haies, création pelouses et massifs, arrosage automatique. Travail soigné avec ramassage des déchets verts inclus.',
        'Informatique' => 'Technicien informatique — dépannage PC/Mac, installation logiciels, réseau Wi-Fi, récupération données, sécurité antivirus, formation domicile. Tarif transparent, diagnostic gratuit.',
        'Demenagement' => 'Déménageur professionnel avec camion équipé — emballage sécurisé, transport soigné, montage/démontage meubles. Assurance tous risques incluse. Devis gratuit sur place.',
        'Soudure'      => 'Soudeur-métalliste — fabrication portails, grilles de sécurité, garde-corps, pergolas, structures sur-mesure. Soudure MIG/TIG/ARC. Galvanisation et peinture anti-rouille disponibles.',
        'Carrelage'    => 'Carreleur expert — pose carrelage sol et mur, faïence, mosaïque, marbre, grès cérame. Rénovation salle de bain et cuisine complète. Joints hydrofuges. Finitions millimétriques garanties.',
        'Vitrerie'     => 'Vitrier qualifié — remplacement vitre cassée, miroir, double vitrage phonique et thermique, verrière. Intervention rapide sur devis gratuit. Vitrification et film de protection disponibles.',
        'Chauffage'    => 'Chauffagiste certifié — installation et entretien chaudières gaz, fuel, granulés. Plancher chauffant, radiateurs, ballon thermodynamique. Contrat de maintenance annuel disponible.',
        'Decoration'   => 'Décorateur intérieur — conception, sourcing et réalisation complète: salon, chambre, cuisine, salle de bain. Plans 3D, accompagnement chantier, coordination des artisans. Visite de conseil offerte.',
        'Nettoyage'    => 'Société de nettoyage — locaux commerciaux, bureaux, hôtels, après-chantier, vitres en hauteur. Matériel industriel haute performance, produits certifiés. Équipes disponibles soirs et week-ends.',
        'Charpenterie' => 'Charpentier couvreur — charpente bois traditionnelle et industrielle, rénovation toiture complète, zinguerie, isolation. Travaux dans les règles de l\'art avec assurance décennale.',
        'Coiffure'     => 'Coiffeur à domicile — coupe femme et homme, couleur, mèches, brushing, coiffure de mariage et événements. Produits professionnels L\'Oréal. Disponible soirs et week-ends sur rendez-vous.',
        'Photographie' => 'Photographe professionnel — mariages, fiançailles, portraits, événements entreprise, produits commerciaux. Retouche avancée incluse. Livraison galerie privée HD sous 7 jours ouvrés.',
    ];

    private function seedProfessionals(): void
    {
        $professionals = [

            // ─── PLOMBERIE ────────────────────────────────────────────────────
            ['name' => 'Youssef El Alami',       'phone' => '0661234501', 'profession' => 'Plombier',               'category' => 'Plomberie',    'city' => 'Casablanca', 'cities' => ['Mohammedia','El Jadida'],     'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.8, 'views' => 420, 'wa' => 85,  'calls' => 62,  'missions' => 134, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Abderrahim Boujemaa',    'phone' => '0661234551', 'profession' => 'Plombier Sanitaire',     'category' => 'Plomberie',    'city' => 'Casablanca', 'cities' => ['Berrechid','Bouskoura'],      'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.7, 'views' => 388, 'wa' => 78,  'calls' => 55,  'missions' => 119, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Redouane Guenoun',       'phone' => '0661234532', 'profession' => 'Plombier Chauffagiste',  'category' => 'Plomberie',    'city' => 'Tanger',     'cities' => ['Tetouan','Larache'],         'lat' => 35.7595, 'lng' => -5.8340, 'rating' => 4.6, 'views' => 312, 'wa' => 66,  'calls' => 48,  'missions' => 91,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Amazigh']],
            ['name' => 'Brahim El Kheir',        'phone' => '0661234545', 'profession' => 'Plombier Dépannage',    'category' => 'Plomberie',    'city' => 'Meknes',     'cities' => ['Fes','Ifrane'],              'lat' => 33.8730, 'lng' => -5.5546, 'rating' => 4.4, 'views' => 198, 'wa' => 41,  'calls' => 29,  'missions' => 58,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Mohamed Ennaim',         'phone' => '0661234560', 'profession' => 'Plombier Rénovation',   'category' => 'Plomberie',    'city' => 'Agadir',     'cities' => ['Inezgane','Tiznit'],         'lat' => 30.4278, 'lng' => -9.5981, 'rating' => 4.5, 'views' => 241, 'wa' => 49,  'calls' => 35,  'missions' => 74,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Amazigh']],

            // ─── ELECTRICITE ──────────────────────────────────────────────────
            ['name' => 'Hassan Benali',          'phone' => '0661234502', 'profession' => 'Électricien',            'category' => 'Electricite',  'city' => 'Rabat',      'cities' => ['Sale','Temara'],             'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.7, 'views' => 380, 'wa' => 72,  'calls' => 55,  'missions' => 98,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Azzeddine Salase',       'phone' => '0661234552', 'profession' => 'Électricien Général',   'category' => 'Electricite',  'city' => 'Casablanca', 'cities' => ['Mohammedia','Ain Sebaa'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 5.0, 'views' => 612, 'wa' => 134, 'calls' => 92,  'missions' => 218, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Youssef Driouich',       'phone' => '0661234553', 'profession' => 'Électricien Bâtiment',  'category' => 'Electricite',  'city' => 'Mohammédia',  'cities' => ['Casablanca','Benslimane'],   'lat' => 33.7246, 'lng' => -7.3862, 'rating' => 4.0, 'views' => 188, 'wa' => 38,  'calls' => 27,  'missions' => 55,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe','Français']],
            ['name' => 'Mehdi Ziyad',            'phone' => '0661234525', 'profession' => 'Électricien Industriel','category' => 'Electricite',  'city' => 'Marrakech',  'cities' => ['Agadir','Taroudant'],        'lat' => 31.6295, 'lng' => -7.9811, 'rating' => 4.9, 'views' => 543, 'wa' => 118, 'calls' => 84,  'missions' => 201, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Hamza Ait Benhaddou',    'phone' => '0661234538', 'profession' => 'Électricien Dépannage', 'category' => 'Electricite',  'city' => 'Agadir',     'cities' => ['Inezgane','Tiznit'],         'lat' => 30.4278, 'lng' => -9.5981, 'rating' => 4.5, 'views' => 267, 'wa' => 55,  'calls' => 38,  'missions' => 79,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe','Amazigh']],

            // ─── PEINTURE ─────────────────────────────────────────────────────
            ['name' => 'Rachid Tazi',            'phone' => '0661234503', 'profession' => 'Peintre Bâtiment',      'category' => 'Peinture',     'city' => 'Marrakech',  'cities' => ['Essaouira','Safi'],          'lat' => 31.6295, 'lng' => -7.9811, 'rating' => 4.9, 'views' => 510, 'wa' => 110, 'calls' => 78,  'missions' => 187, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Jalal Eddine Rifki',     'phone' => '0661234554', 'profession' => 'Peintre Décorateur',    'category' => 'Peinture',     'city' => 'Rabat',      'cities' => ['Sale','Kenitra'],            'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.8, 'views' => 466, 'wa' => 98,  'calls' => 69,  'missions' => 154, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Tarik Oulhaj',           'phone' => '0661234526', 'profession' => 'Peintre Intérieur',     'category' => 'Peinture',     'city' => 'Tanger',     'cities' => ['Tetouan','Ceuta'],           'lat' => 35.7595, 'lng' => -5.8340, 'rating' => 4.7, 'views' => 388, 'wa' => 79,  'calls' => 57,  'missions' => 112, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Espagnol']],

            // ─── CLIMATISATION ────────────────────────────────────────────────
            ['name' => 'Hicham Rahmouni',        'phone' => '0661234555', 'profession' => 'Tech Climatisation',    'category' => 'Climatisation','city' => 'Casablanca', 'cities' => ['Mohammedia','Rabat'],        'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.9, 'views' => 587, 'wa' => 128, 'calls' => 89,  'missions' => 209, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Khalid Mansouri',        'phone' => '0661234504', 'profession' => 'Tech Froid et Clim',    'category' => 'Climatisation','city' => 'Casablanca', 'cities' => ['Rabat','Kenitra'],           'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.6, 'views' => 295, 'wa' => 58,  'calls' => 41,  'missions' => 76,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Anas Karimi',            'phone' => '0661234527', 'profession' => 'Technicien HVAC',       'category' => 'Climatisation','city' => 'Rabat',      'cities' => ['Sale','Kenitra'],            'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.8, 'views' => 441, 'wa' => 92,  'calls' => 65,  'missions' => 143, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── MENUISERIE ───────────────────────────────────────────────────
            ['name' => 'Omar Chraibi',           'phone' => '0661234505', 'profession' => 'Menuisier Bois',        'category' => 'Menuiserie',   'city' => 'Fes',        'cities' => ['Meknes','Rabat'],            'lat' => 34.0331, 'lng' => -5.0003, 'rating' => 4.5, 'views' => 210, 'wa' => 44,  'calls' => 33,  'missions' => 61,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Jamal Bennis',           'phone' => '0661234533', 'profession' => 'Menuisier Aluminium',   'category' => 'Menuiserie',   'city' => 'Casablanca', 'cities' => ['Mohammedia','Berrechid'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.7, 'views' => 356, 'wa' => 73,  'calls' => 52,  'missions' => 108, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'SE WOOD Meuble',         'phone' => '0661234556', 'profession' => 'Menuisier Décoration',  'category' => 'Menuiserie',   'city' => 'Rabat',      'cities' => ['Sale','Temara'],             'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.8, 'views' => 429, 'wa' => 89,  'calls' => 63,  'missions' => 136, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Hicham El Fassi',        'phone' => '0661234546', 'profession' => 'Charpentier Menuisier', 'category' => 'Menuiserie',   'city' => 'Meknes',     'cities' => ['Fes','Azrou'],               'lat' => 33.8730, 'lng' => -5.5546, 'rating' => 4.4, 'views' => 187, 'wa' => 38,  'calls' => 27,  'missions' => 54,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe']],

            // ─── MENAGE ───────────────────────────────────────────────────────
            ['name' => 'Fatima Zahra Idrissi',   'phone' => '0661234506', 'profession' => 'Femme de ménage',       'category' => 'Menage',       'city' => 'Casablanca', 'cities' => ['Mohammedia','Berrechid'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.9, 'views' => 640, 'wa' => 145, 'calls' => 89,  'missions' => 220, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Naima Khaldi',           'phone' => '0661234528', 'profession' => 'Aide ménagère',         'category' => 'Menage',       'city' => 'Rabat',      'cities' => ['Sale','Temara'],             'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.8, 'views' => 529, 'wa' => 121, 'calls' => 74,  'missions' => 183, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Khadija Ouali',          'phone' => '0661234539', 'profession' => 'Femme de ménage',       'category' => 'Menage',       'city' => 'Casablanca', 'cities' => ['Ain Sebaa','Ain Chock'],     'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.7, 'views' => 413, 'wa' => 88,  'calls' => 61,  'missions' => 148, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe']],
            ['name' => 'Houda Benkirane',        'phone' => '0661234561', 'profession' => 'Service ménage domicile','category' => 'Menage',      'city' => 'Marrakech',  'cities' => ['Casablanca','Rabat'],        'lat' => 31.6295, 'lng' => -7.9811, 'rating' => 4.6, 'views' => 318, 'wa' => 67,  'calls' => 45,  'missions' => 101, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── MACONNERIE ───────────────────────────────────────────────────
            ['name' => 'Mustapha Berrada',       'phone' => '0661234507', 'profession' => 'Maçon',                 'category' => 'Maconnerie',   'city' => 'Tanger',     'cities' => ['Tetouan','Al Hoceima'],      'lat' => 35.7595, 'lng' => -5.8340, 'rating' => 4.4, 'views' => 175, 'wa' => 38,  'calls' => 25,  'missions' => 52,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe','Français']],
            ['name' => 'Mohamed Elbouayssy',     'phone' => '0661234557', 'profession' => 'Maçon Rénovateur',      'category' => 'Maconnerie',   'city' => 'Casablanca', 'cities' => ['Mohammedia','Ain Sebaa'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 5.0, 'views' => 544, 'wa' => 116, 'calls' => 81,  'missions' => 194, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Brahim El Amrani',       'phone' => '0661234529', 'profession' => 'Maçon Constructeur',    'category' => 'Maconnerie',   'city' => 'Agadir',     'cities' => ['Inezgane','Ait Melloul'],    'lat' => 30.4278, 'lng' => -9.5981, 'rating' => 4.6, 'views' => 264, 'wa' => 54,  'calls' => 37,  'missions' => 77,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Amazigh']],

            // ─── SERRURERIE ───────────────────────────────────────────────────
            ['name' => 'Abdellatif Ouali',       'phone' => '0661234508', 'profession' => 'Serrurier',             'category' => 'Serrurerie',   'city' => 'Agadir',     'cities' => ['Inezgane','Tiznit'],         'lat' => 30.4278, 'lng' => -9.5981, 'rating' => 4.7, 'views' => 330, 'wa' => 67,  'calls' => 91,  'missions' => 109, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Amazigh']],
            ['name' => 'Lahcen Amhane',          'phone' => '0661234534', 'profession' => 'Serrurier Urgence 24h', 'category' => 'Serrurerie',   'city' => 'Fes',        'cities' => ['Meknes','Sefrou'],           'lat' => 34.0331, 'lng' => -5.0003, 'rating' => 4.8, 'views' => 497, 'wa' => 104, 'calls' => 138, 'missions' => 176, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Abdelalai Elmsassi',     'phone' => '0661234558', 'profession' => 'Serrurier Blindage',    'category' => 'Serrurerie',   'city' => 'Fes',        'cities' => ['Meknes','Rabat'],            'lat' => 34.0331, 'lng' => -5.0003, 'rating' => 4.5, 'views' => 287, 'wa' => 59,  'calls' => 77,  'missions' => 98,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── JARDINAGE ────────────────────────────────────────────────────
            ['name' => 'Karim Elhajjami',        'phone' => '0661234509', 'profession' => 'Jardinier',             'category' => 'Jardinage',    'city' => 'Rabat',      'cities' => ['Kenitra','Sale'],            'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.6, 'views' => 195, 'wa' => 41,  'calls' => 28,  'missions' => 73,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Ali Bouazza',            'phone' => '0661234535', 'profession' => 'Paysagiste Jardinier',  'category' => 'Jardinage',    'city' => 'Casablanca', 'cities' => ['Mohammedia','Bouskoura'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.9, 'views' => 612, 'wa' => 132, 'calls' => 88,  'missions' => 199, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── INFORMATIQUE ─────────────────────────────────────────────────
            ['name' => 'Samir Lahlou',           'phone' => '0661234510', 'profession' => 'Tech Informatique',     'category' => 'Informatique', 'city' => 'Casablanca', 'cities' => ['Rabat','Mohammedia'],        'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.8, 'views' => 488, 'wa' => 102, 'calls' => 67,  'missions' => 156, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Anglais']],
            ['name' => 'Younes El Fassi',        'phone' => '0661234536', 'profession' => 'Technicien Réseau',     'category' => 'Informatique', 'city' => 'Marrakech',  'cities' => ['Casablanca','Agadir'],       'lat' => 31.6295, 'lng' => -7.9811, 'rating' => 4.7, 'views' => 375, 'wa' => 77,  'calls' => 53,  'missions' => 112, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Anglais']],
            ['name' => 'Nadia Belkacem',         'phone' => '0661234540', 'profession' => 'Support Informatique',  'category' => 'Informatique', 'city' => 'Casablanca', 'cities' => ['Rabat','Sale'],              'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.9, 'views' => 558, 'wa' => 119, 'calls' => 81,  'missions' => 176, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Anglais']],

            // ─── DEMENAGEMENT ─────────────────────────────────────────────────
            ['name' => 'Nabil Sqalli',           'phone' => '0661234511', 'profession' => 'Déménageur',            'category' => 'Demenagement', 'city' => 'Casablanca', 'cities' => ['Rabat','Marrakech'],         'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.5, 'views' => 260, 'wa' => 54,  'calls' => 39,  'missions' => 87,  'verified' => false, 'status' => 'busy',      'langs' => ['Arabe','Français']],
            ['name' => 'Hassan Guerraoui',       'phone' => '0661234537', 'profession' => 'Déménageur Pro',        'category' => 'Demenagement', 'city' => 'Tanger',     'cities' => ['Tetouan','Kenitra'],         'lat' => 35.7595, 'lng' => -5.8340, 'rating' => 4.7, 'views' => 341, 'wa' => 70,  'calls' => 49,  'missions' => 103, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Espagnol']],

            // ─── SOUDURE ──────────────────────────────────────────────────────
            ['name' => 'Driss Kettani',          'phone' => '0661234512', 'profession' => 'Soudeur',               'category' => 'Soudure',      'city' => 'Oujda',      'cities' => ['Nador','Fes'],               'lat' => 34.6814, 'lng' => -1.9086, 'rating' => 4.3, 'views' => 148, 'wa' => 32,  'calls' => 21,  'missions' => 44,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe']],
            ['name' => 'Abdeslam Qaissi',        'phone' => '0661234541', 'profession' => 'Soudeur Métalliste',    'category' => 'Soudure',      'city' => 'Agadir',     'cities' => ['Inezgane','Biougra'],        'lat' => 30.4278, 'lng' => -9.5981, 'rating' => 4.6, 'views' => 231, 'wa' => 47,  'calls' => 33,  'missions' => 68,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Amazigh']],

            // ─── CARRELAGE ────────────────────────────────────────────────────
            ['name' => 'Mohammed Rifai',         'phone' => '0661234513', 'profession' => 'Carreleur',             'category' => 'Carrelage',    'city' => 'Fes',        'cities' => ['Meknes','Sefrou'],           'lat' => 34.0331, 'lng' => -5.0003, 'rating' => 4.7, 'views' => 357, 'wa' => 74,  'calls' => 52,  'missions' => 116, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Mourad Slimani',         'phone' => '0661234542', 'profession' => 'Carreleur Faïenceur',   'category' => 'Carrelage',    'city' => 'Rabat',      'cities' => ['Sale','Kenitra'],            'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.8, 'views' => 428, 'wa' => 89,  'calls' => 63,  'missions' => 131, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Abdelouahab Zaki',       'phone' => '0661234562', 'profession' => 'Carreleur Marbre',      'category' => 'Carrelage',    'city' => 'Casablanca', 'cities' => ['El Jadida','Mohammedia'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.9, 'views' => 519, 'wa' => 109, 'calls' => 75,  'missions' => 163, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── VITRERIE ─────────────────────────────────────────────────────
            ['name' => 'Aziz Cherkaoui',         'phone' => '0661234514', 'profession' => 'Vitrier',               'category' => 'Vitrerie',     'city' => 'Casablanca', 'cities' => ['Mohammedia','El Jadida'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.6, 'views' => 289, 'wa' => 59,  'calls' => 42,  'missions' => 88,  'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── CHAUFFAGE ────────────────────────────────────────────────────
            ['name' => 'Bilal Moussaoui',        'phone' => '0661234515', 'profession' => 'Chauffagiste',          'category' => 'Chauffage',    'city' => 'Tanger',     'cities' => ['Tetouan','Larache'],         'lat' => 35.7595, 'lng' => -5.8340, 'rating' => 4.5, 'views' => 213, 'wa' => 44,  'calls' => 31,  'missions' => 65,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Rachid Benchekroun',     'phone' => '0661234563', 'profession' => 'Tech Chauffage Gaz',    'category' => 'Chauffage',    'city' => 'Casablanca', 'cities' => ['Rabat','Kenitra'],           'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.8, 'views' => 412, 'wa' => 86,  'calls' => 60,  'missions' => 128, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── DECORATION ───────────────────────────────────────────────────
            ['name' => 'Karim Tahiri',           'phone' => '0661234516', 'profession' => 'Décorateur Intérieur',  'category' => 'Decoration',   'city' => 'Marrakech',  'cities' => ['Casablanca','Rabat'],        'lat' => 31.6295, 'lng' => -7.9811, 'rating' => 4.8, 'views' => 466, 'wa' => 98,  'calls' => 68,  'missions' => 142, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Anglais']],
            ['name' => 'Ilham Benkirane',        'phone' => '0661234543', 'profession' => 'Designer Intérieur',    'category' => 'Decoration',   'city' => 'Marrakech',  'cities' => ['Casablanca','Essaouira'],    'lat' => 31.6295, 'lng' => -7.9811, 'rating' => 4.9, 'views' => 589, 'wa' => 126, 'calls' => 82,  'missions' => 191, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Anglais']],
            ['name' => 'Hamza El Moudden',       'phone' => '0661234559', 'profession' => 'Architecte Décorateur', 'category' => 'Decoration',   'city' => 'Rabat',      'cities' => ['Casablanca','Fes'],          'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.7, 'views' => 397, 'wa' => 83,  'calls' => 57,  'missions' => 124, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Anglais']],

            // ─── NETTOYAGE ────────────────────────────────────────────────────
            ['name' => 'Soufiane El Kadi',       'phone' => '0661234517', 'profession' => 'Agent de Nettoyage',    'category' => 'Nettoyage',    'city' => 'Casablanca', 'cities' => ['Mohammedia','Bouskoura'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.5, 'views' => 208, 'wa' => 43,  'calls' => 30,  'missions' => 62,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Abderrahman Hajoui',     'phone' => '0661234564', 'profession' => 'Nettoyage Professionnel','category' => 'Nettoyage',   'city' => 'Casablanca', 'cities' => ['Rabat','Berrechid'],         'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.7, 'views' => 341, 'wa' => 71,  'calls' => 49,  'missions' => 107, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── CHARPENTERIE ─────────────────────────────────────────────────
            ['name' => 'Abderrahman Squali',     'phone' => '0661234518', 'profession' => 'Charpentier Couvreur',  'category' => 'Charpenterie', 'city' => 'Fes',        'cities' => ['Meknes','Rabat'],            'lat' => 34.0331, 'lng' => -5.0003, 'rating' => 4.4, 'views' => 176, 'wa' => 36,  'calls' => 25,  'missions' => 51,  'verified' => false, 'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── COIFFURE ─────────────────────────────────────────────────────
            ['name' => 'Yassine Benali',         'phone' => '0661234519', 'profession' => 'Coiffeur à Domicile',   'category' => 'Coiffure',     'city' => 'Rabat',      'cities' => ['Sale','Temara'],             'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.7, 'views' => 381, 'wa' => 79,  'calls' => 55,  'missions' => 117, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Loubna Ezzahra',         'phone' => '0661234544', 'profession' => 'Coiffeuse Visagiste',   'category' => 'Coiffure',     'city' => 'Casablanca', 'cities' => ['Mohammedia','Berrechid'],    'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.9, 'views' => 674, 'wa' => 152, 'calls' => 93,  'missions' => 238, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
            ['name' => 'Samira Lahlou',          'phone' => '0661234565', 'profession' => 'Coiffeuse Mariage',     'category' => 'Coiffure',     'city' => 'Marrakech',  'cities' => ['Casablanca','Agadir'],       'lat' => 31.6295, 'lng' => -7.9811, 'rating' => 5.0, 'views' => 721, 'wa' => 163, 'calls' => 104, 'missions' => 256, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],

            // ─── PHOTOGRAPHIE ─────────────────────────────────────────────────
            ['name' => 'Ayoub Eddahbi',          'phone' => '0661234520', 'profession' => 'Photographe Événements','category' => 'Photographie','city' => 'Casablanca', 'cities' => ['Rabat','Marrakech'],         'lat' => 33.5731, 'lng' => -7.5898, 'rating' => 4.8, 'views' => 453, 'wa' => 95,  'calls' => 66,  'missions' => 139, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français','Anglais']],
            ['name' => 'Zineb Lahlou',           'phone' => '0661234566', 'profession' => 'Photographe Mariages',  'category' => 'Photographie','city' => 'Rabat',      'cities' => ['Casablanca','Meknes'],       'lat' => 34.0209, 'lng' => -6.8416, 'rating' => 4.9, 'views' => 534, 'wa' => 114, 'calls' => 79,  'missions' => 168, 'verified' => true,  'status' => 'available', 'langs' => ['Arabe','Français']],
        ];

        $reviews = [
            ['Excellent travail, très professionnel et ponctuel. Je recommande vivement !', 5],
            ['Bon rapport qualité-prix, travail soigné et propre. Très satisfait.', 5],
            ['Intervention rapide, problème résolu en moins d\'une heure. Merci !', 5],
            ['Professionnel sérieux, explique bien son intervention. À contacter sans hésiter.', 4],
            ['Très bon service, disponible même le week-end. Travail impeccable.', 5],
            ['Efficace et discret, respecte les horaires. Personnel de confiance.', 4],
            ['Très compétent, matériel de qualité. Je referai appel à ses services.', 5],
            ['Service rapide et honnête. Prix raisonnable, transparence totale.', 4],
            ['Excellent artisan, travail soigné et propre. Aucun débordement de chantier.', 5],
            ['Ponctuel, professionnel et sympathique. Résultat au-delà de mes attentes.', 5],
            ['Un vrai professionnel, je lui fais confiance les yeux fermés. Parfait.', 5],
            ['Très bon service après-vente, suivi rigoureux. Vraiment sérieux.', 4],
            ['Travail de qualité supérieure, délais respectés. Aucun surcoût surprise.', 5],
            ['Artisan consciencieux, laisse le chantier propre. Bravo !', 4],
            ['Réactif, disponible, compétent. La combinaison parfaite.', 5],
            ['Devis précis, respect du budget. Je recommande sans hésitation.', 5],
        ];

        $clientNames = [
            'Hamid Bensouda', 'Aicha Tahiri', 'Mohamed Berrada', 'Nadia Skali',
            'Younes Lamrani', 'Samira El Fassi', 'Abdou Rami', 'Zineb Chaoui',
            'Yousra Amrani', 'Mehdi Lazrak', 'Fatima Lahlou', 'Kamal Ziani',
            'Sara Bennani', 'Amine Rami', 'Houda Tazi', 'Omar Khalil',
        ];

        foreach ($professionals as $i => $data) {
            $category = DB::table('categories')->where('name', $data['category'])->first();
            if (! $category) continue;
            if (DB::table('professionals')->where('phone', $data['phone'])->exists()) continue;

            $slug = Str::slug($data['name'] . '-' . $data['profession']);
            $base = $slug; $n = 1;
            while (DB::table('professionals')->where('slug', $slug)->exists()) {
                $slug = $base . '-' . $n++;
            }

            $photo   = self::$photos[$i % count(self::$photos)];
            $portIds = self::$portfolios[$data['category']] ?? [];
            $portfolio = array_map(
                fn ($id) => "https://images.unsplash.com/{$id}?q=80&w=800&auto=format&fit=crop",
                array_slice($portIds, 0, 3)
            );

            $desc = self::$descriptions[$data['category']]
                ?? 'Professionnel expérimenté, disponible pour interventions à domicile. Travail soigné, prix honnête. Devis gratuit.';

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

            $emailSlug = Str::slug($data['name'], '.');
            $email     = $emailSlug . '@m3allemclick.ma';
            if (strlen($email) > 100) $email = 'pro.' . ($i + 100) . '@m3allemclick.ma';
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
            if (DB::table('users')->where('email', $client['email'])->exists()) continue;
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
