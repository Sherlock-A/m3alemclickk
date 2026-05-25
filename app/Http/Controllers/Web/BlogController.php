<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class BlogController extends Controller
{
    private static array $ARTICLES = [
        'choisir-plombier-casablanca' => [
            'slug'        => 'choisir-plombier-casablanca',
            'title'       => 'Comment choisir un plombier fiable à Casablanca en 2026',
            'description' => 'Guide complet pour trouver et choisir un plombier de confiance à Casablanca : vérifications essentielles, tarifs, questions à poser et comment éviter les arnaques.',
            'category'    => 'Plomberie',
            'city'        => 'Casablanca',
            'readTime'    => 5,
            'date'        => '2026-05-01',
            'intro'       => "Trouver un plombier fiable à Casablanca peut s'avérer difficile : nombreux prestataires non vérifiés, tarifs opaques, et risque d'arnaques. Ce guide vous donne toutes les clés pour faire le bon choix.",
            'sections'    => [
                [
                    'title'   => '1. Vérifiez l'identité et les références',
                    'content' => "Avant tout contact, assurez-vous que le plombier est joignable sur un numéro marocain stable. Demandez sa CIN ou son RC (registre de commerce) si c'est une entreprise. Sur Jobly, tous les artisans passent une vérification d'identité + appel de confirmation — un gage de sérieux.\n\n**À demander :**\n- Avez-vous des références de clients à Casablanca ?\n- Êtes-vous affilié à une chambre des métiers ?\n- Pouvez-vous me montrer des photos de vos travaux récents ?",
                ],
                [
                    'title'   => '2. Comprenez les tarifs pratiqués à Casablanca',
                    'content' => "Les prix d'un plombier à Casablanca varient selon la prestation :\n\n- **Fuite robinet / siphon** : 150–300 MAD\n- **Débouchage canalisation** : 200–450 MAD\n- **Installation WC / lavabo** : 300–600 MAD\n- **Remplacement chauffe-eau** : 400–800 MAD (hors matériel)\n- **Urgence nuit/week-end** : majoration 50–100%\n\nMéfiez-vous des devis trop bas (signe d'un manque d'expérience ou de matériel de mauvaise qualité) et des devis excessivement élevés sans justification.",
                ],
                [
                    'title'   => '3. Lisez les avis clients',
                    'content' => "Les avis clients sont le meilleur indicateur de qualité. Sur Jobly, les avis sont vérifiés et modérés par notre équipe — aucun faux avis n'est toléré.\n\n**Bons signes :**\n- Note moyenne ≥ 4/5 sur au moins 10 avis\n- Commentaires spécifiques (ponctualité, qualité du travail, propreté)\n- L'artisan répond aux avis négatifs avec professionnalisme\n\n**Mauvais signes :**\n- Zéro avis (artisan nouveau ou qui efface ses avis)\n- Avis génériques sans détail\n- Plusieurs plaintes sur les prix non respectés",
                ],
                [
                    'title'   => '4. Demandez un devis écrit',
                    'content' => "Un professionnel sérieux établit toujours un devis détaillé avant d'intervenir. Le devis doit préciser :\n\n- La nature exacte des travaux\n- Le prix main-d'œuvre et le prix des matériaux séparément\n- Le délai d'intervention\n- Les conditions de garantie (en général 1 an sur les travaux)\n\n*Conseil Jobly :* Contactez 2 à 3 plombiers via notre plateforme et comparez leurs devis. Notre outil de comparaison est gratuit.",
                ],
                [
                    'title'   => '5. Évitez les pièges classiques',
                    'content' => "**Les arnaques fréquentes à Casablanca :**\n\n- **Le devis gonflé en cours de route** : le plombier commence les travaux et annonce un prix bien plus élevé qu'annoncé. Solution : exigez un devis écrit signé avant toute intervention.\n\n- **La pièce «obligatoire» hors de prix** : certains prétendent que la pièce est «rare» pour justifier un surcoût. Demandez toujours à voir la pièce usagée et comparez le prix en magasin.\n\n- **Le manque de garantie** : un artisan sérieux garantit son travail. Sans garantie, vous n'avez aucun recours si la fuite réapparaît 2 semaines plus tard.\n\n- **Le paiement intégral en avance** : ne payez jamais 100% avant intervention. Un acompte de 30% est raisonnable, le solde à la fin.",
                ],
            ],
            'cta' => [
                'text'  => 'Trouver un plombier vérifié à Casablanca',
                'url'   => '/professionnels/casablanca/plomberie',
                'label' => 'Voir les plombiers',
            ],
            'related' => [
                'choisir-electricien-maroc',
                'prix-artisan-maroc-2026',
            ],
        ],

        'choisir-electricien-maroc' => [
            'slug'        => 'choisir-electricien-maroc',
            'title'       => 'Comment choisir un électricien fiable au Maroc en 2026',
            'description' => 'Guide pratique pour sélectionner un électricien qualifié au Maroc : habilitations, tarifs, questions à poser et signaux d'alarme à éviter.',
            'category'    => 'Électricité',
            'city'        => null,
            'readTime'    => 6,
            'date'        => '2026-05-10',
            'intro'       => "L'électricité est le domaine où les erreurs coûtent le plus cher — et peuvent être dangereuses. Voici comment choisir un électricien qualifié au Maroc en toute sérénité.",
            'sections'    => [
                [
                    'title'   => '1. Vérifiez les qualifications obligatoires',
                    'content' => "Au Maroc, les travaux électriques doivent respecter la norme NM C15-100 (adaptée de la norme française). Un électricien qualifié doit :\n\n- Avoir une formation technique (OFPPT, école de formation professionnelle, ou expérience prouvée)\n- Connaître les normes de sécurité en vigueur\n- Être capable de lire un plan électrique\n\nSur Jobly, les électriciens passent par une vérification d'identité et de compétences avant d'être listés.",
                ],
                [
                    'title'   => '2. Tarifs indicatifs 2026',
                    'content' => "**Petites interventions :**\n- Remplacement prise / interrupteur : 80–150 MAD\n- Pose luminaire / plafonnier : 100–200 MAD\n- Réparation panne électrique : 150–300 MAD\n\n**Travaux moyens :**\n- Mise aux normes tableau électrique : 400–800 MAD\n- Installation circuit dédié (cuisine, climatisation) : 300–600 MAD\n- Passage de câbles sous gaine : 50–100 MAD/mètre\n\n**Gros travaux :**\n- Rénovation électrique complète appartement : 3 000–8 000 MAD\n- Installation tableau neuf avec disjoncteurs : 800–1 500 MAD",
                ],
                [
                    'title'   => '3. Questions essentielles à poser',
                    'content' => "Avant de confier vos travaux, posez ces questions :\n\n**Sécurité :**\n- Connaissez-vous la norme NM C15-100 ?\n- Coupez-vous le disjoncteur général avant d'intervenir ?\n- Testez-vous l'installation après les travaux ?\n\n**Administratif :**\n- Pouvez-vous me remettre une facture ?\n- Garantissez-vous votre travail ? Sur quelle durée ?\n\n**Pratique :**\n- Combien de temps durent ces travaux ?\n- Avez-vous déjà réalisé ce type d'installation ?",
                ],
                [
                    'title'   => '4. Signaux d'alarme',
                    'content' => "**Ne faites pas confiance à un électricien qui :**\n\n❌ Ne coupe pas le courant avant d'intervenir (danger mortel)\n❌ Laisse des fils dénudés non protégés\n❌ Ne vérifie pas la mise à la terre\n❌ Refuse de donner un devis écrit\n❌ Demande un paiement cash intégral avant les travaux\n❌ Ne peut pas expliquer ce qu'il fait en termes simples\n\n**Bons signes de professionnalisme :**\n✅ Arrive avec son propre matériel de test (multimètre, testeur de phase)\n✅ Prend des photos avant/après les travaux\n✅ Explique le problème clairement\n✅ Mentionne les risques si les travaux ne sont pas faits correctement",
                ],
                [
                    'title'   => '5. Urgences électriques : que faire ?',
                    'content' => "En cas de court-circuit, de disjoncteur qui saute en boucle, ou d'odeur de brûlé :\n\n1. **Coupez immédiatement** le disjoncteur général\n2. Ne touchez à rien\n3. Ouvrez les fenêtres en cas d'odeur\n4. Contactez un électricien d'urgence via Jobly — filtrez par «Disponible maintenant»\n\n*Note :* Les urgences impliquent généralement une majoration de 30 à 50% sur le tarif normal.",
                ],
            ],
            'cta' => [
                'text'  => 'Trouver un électricien vérifié au Maroc',
                'url'   => '/professionals?profession=Electricien',
                'label' => 'Voir les électriciens',
            ],
            'related' => [
                'choisir-plombier-casablanca',
                'prix-artisan-maroc-2026',
            ],
        ],

        'prix-artisan-maroc-2026' => [
            'slug'        => 'prix-artisan-maroc-2026',
            'title'       => 'Prix des artisans au Maroc en 2026 : guide complet des tarifs',
            'description' => 'Découvrez les tarifs moyens des artisans au Maroc en 2026 : plombiers, électriciens, peintres, maçons et plus. Comparez les prix avant de contacter un professionnel.',
            'category'    => 'Général',
            'city'        => null,
            'readTime'    => 7,
            'date'        => '2026-05-15',
            'intro'       => "Avant de contacter un artisan, connaître les tarifs du marché vous permet de négocier en connaissance de cause et d'éviter les devis abusifs. Voici un guide complet des prix pratiqués au Maroc en 2026.",
            'sections'    => [
                [
                    'title'   => 'Plomberie',
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Fuite robinet | 150–300 MAD |\n| Débouchage canalisation | 200–450 MAD |\n| Installation WC | 300–600 MAD |\n| Remplacement chauffe-eau | 400–800 MAD |\n| Réparation fuite sous carrelage | 500–1 200 MAD |\n\n*Ces tarifs n'incluent généralement pas les pièces de remplacement.*",
                ],
                [
                    'title'   => 'Électricité',
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Remplacement prise / interrupteur | 80–150 MAD |\n| Pose luminaire | 100–200 MAD |\n| Mise aux normes tableau | 400–800 MAD |\n| Installation climatisation | 500–1 200 MAD |\n| Rénovation électrique appartement | 3 000–8 000 MAD |",
                ],
                [
                    'title'   => 'Peinture',
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Peinture intérieure | 25–50 MAD/m² |\n| Peinture décorative | 50–80 MAD/m² |\n| Ravalement façade | 40–70 MAD/m² |\n| Préparation + impression incluses | Généralement inclus |\n\n*Le prix au m² varie selon la qualité de la peinture utilisée.*",
                ],
                [
                    'title'   => 'Maçonnerie / Carrelage',
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Pose carrelage sol | 80–150 MAD/m² |\n| Pose faïence murale | 100–200 MAD/m² |\n| Enduit / crépi | 50–100 MAD/m² |\n| Démolition cloison | 200–400 MAD |\n| Construction mur parpaing | 300–600 MAD/m² |",
                ],
                [
                    'title'   => 'Menuiserie',
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Pose porte intérieure | 200–400 MAD |\n| Fabrication porte bois | 600–1 200 MAD |\n| Placard sur mesure | 800–2 000 MAD |\n| Réparation fenêtre | 150–350 MAD |",
                ],
                [
                    'title'   => 'Facteurs qui influencent le prix',
                    'content' => "**La ville** : Les tarifs à Casablanca et Rabat sont généralement 10–20% plus élevés qu'à Meknès, Oujda ou Beni Mellal.\n\n**L'urgence** : Une intervention en urgence (soir, week-end, jour férié) entraîne une majoration de 30–50%.\n\n**L'accès** : Travaux en hauteur, en sous-sol, ou dans des espaces étroits coûtent plus cher.\n\n**La qualité des matériaux** : Toujours demander si le prix comprend les matériaux, et de quelle marque.\n\n**L'expérience** : Un maître artisan avec 15 ans d'expérience facture légitimement plus qu'un débutant.",
                ],
            ],
            'cta' => [
                'text'  => 'Comparer les artisans et leurs tarifs',
                'url'   => '/professionals',
                'label' => 'Voir les artisans',
            ],
            'related' => [
                'choisir-plombier-casablanca',
                'choisir-electricien-maroc',
            ],
        ],
    ];

    public function index(): \Inertia\Response
    {
        $articles = array_map(fn($a) => [
            'slug'        => $a['slug'],
            'title'       => $a['title'],
            'description' => $a['description'],
            'category'    => $a['category'],
            'city'        => $a['city'],
            'readTime'    => $a['readTime'],
            'date'        => $a['date'],
        ], self::$ARTICLES);

        return Inertia::render('Frontend/GuidesListPage', [
            'articles' => array_values($articles),
        ]);
    }

    public function show(string $slug): \Inertia\Response
    {
        $article = self::$ARTICLES[$slug] ?? null;

        if (! $article) {
            abort(404);
        }

        $relatedArticles = array_map(
            fn($s) => isset(self::$ARTICLES[$s]) ? [
                'slug'     => self::$ARTICLES[$s]['slug'],
                'title'    => self::$ARTICLES[$s]['title'],
                'category' => self::$ARTICLES[$s]['category'],
                'readTime' => self::$ARTICLES[$s]['readTime'],
            ] : null,
            $article['related'] ?? []
        );

        return Inertia::render('Frontend/GuidePage', [
            'article'        => $article,
            'relatedArticles' => array_filter(array_values($relatedArticles)),
            'canonical'      => config('app.url') . "/guides/{$slug}",
        ]);
    }

    public static function allSlugs(): array
    {
        return array_keys(self::$ARTICLES);
    }
}
