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
                    'title'   => "1. Vérifiez l'identité et les références",
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
            'description' => "Guide pratique pour sélectionner un électricien qualifié au Maroc : habilitations, tarifs, questions à poser et signaux d'alarme à éviter.",
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
                    'title'   => "4. Signaux d'alarme",
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

        'femme-de-menage-casablanca' => [
            'slug'        => 'femme-de-menage-casablanca',
            'title'       => 'Trouver une femme de ménage fiable à Casablanca en 2026',
            'description' => "Comment trouver une femme de ménage de confiance à Casablanca : tarifs, questions essentielles, contrat et ce qu'il faut vérifier avant d'embaucher.",
            'category'    => 'Général',
            'city'        => 'Casablanca',
            'readTime'    => 5,
            'date'        => '2026-05-10',
            'intro'       => "Trouver une femme de ménage fiable à Casablanca demande du temps et de la prudence. Voici un guide pratique pour ne pas se tromper et protéger votre foyer.",
            'sections'    => [
                [
                    'title'   => '1. Définir vos besoins avant de chercher',
                    'content' => "Avant de commencer votre recherche, clarifiez vos attentes :\n\n**Fréquence :**\n- Régulière (1 à 3 fois par semaine)\n- Ponctuelle (grand ménage, fin de chantier)\n- Hebdomadaire\n\n**Tâches :**\n- Nettoyage courant (sols, cuisine, salle de bain)\n- Repassage\n- Cuisine légère\n- Garde d'enfants (nécessite un profil différent)\n\n**Horaires :**\n- Journée / matin / après-midi\n- Présence à domicile ou clés confiées\n\nCes choix influencent directement le tarif et le profil recherché.",
                ],
                [
                    'title'   => '2. Les tarifs à Casablanca en 2026',
                    'content' => "Les prix pratiqués à Casablanca varient selon la prestation et la zone :\n\n| Prestation | Tarif indicatif |\n|---|---|\n| Ménage ponctuel (demi-journée) | 150–250 MAD |\n| Ménage ponctuel (journée) | 250–400 MAD |\n| Forfait hebdomadaire (1×/sem) | 600–1 200 MAD/mois |\n| Grand ménage (logement T3) | 400–700 MAD |\n| Repassage seul (2h) | 100–150 MAD |\n\n*Note : les tarifs peuvent être plus élevés dans les quartiers huppés (Anfa, CIL, Gauthier).*",
                ],
                [
                    'title'   => '3. Questions essentielles à poser',
                    'content' => "**Lors du premier contact :**\n- Avez-vous des références vérifiables ?\n- Avez-vous de l'expérience avec des enfants / animaux ?\n- Êtes-vous disponible aux horaires souhaités ?\n- Avez-vous une carte d'identité nationale ?\n\n**À la première rencontre :**\n- Faites visiter l'appartement et listez les tâches clairement\n- Vérifiez que vous communiquez bien (compréhension mutuelle)\n- Observez la ponctualité et le soin apporté à la présentation\n\n*Conseil :* Commencez toujours par une mission d'essai payée avant de vous engager sur du long terme.",
                ],
                [
                    'title'   => '4. Protégez-vous avec un accord écrit',
                    'content' => "Même pour du travail à domicile informel, un accord simple protège les deux parties :\n\n**Ce qu'il doit contenir :**\n- Jours et horaires d'intervention\n- Liste des tâches\n- Rémunération et mode de paiement\n- Préavis en cas d'arrêt\n- Règles concernant les objets de valeur\n\nSi vous confiez des clés, demandez une photocopie de la CIN et gardez une trace écrite de la remise.",
                ],
                [
                    'title'   => '5. Les pièges à éviter',
                    'content' => "**Erreurs fréquentes des employeurs à Casablanca :**\n\n- **Ne pas vérifier les références** : appelez toujours les anciens employeurs si disponibles\n- **Absence d'accord sur les tâches** : source de conflits fréquents\n- **Changer les conditions après embauche** : ajouter des tâches sans revoir la rémunération crée de la frustration\n- **Ne pas sécuriser ses affaires** : évitez de laisser des objets de valeur en évidence lors des premières missions\n\n*Sur Jobly, les professionnels de service à domicile sont vérifiés et notés par de vrais clients — un gage de sécurité supplémentaire.*",
                ],
            ],
            'cta' => [
                'text'  => 'Trouver une aide ménagère vérifiée à Casablanca',
                'url'   => '/professionnels/casablanca',
                'label' => 'Voir les professionnels',
            ],
            'related' => [
                'choisir-plombier-casablanca',
                'prix-artisan-maroc-2026',
            ],
        ],

        'peintre-maroc-guide' => [
            'slug'        => 'peintre-maroc-guide',
            'title'       => 'Choisir un peintre en bâtiment au Maroc : guide complet 2026',
            'description' => 'Tout ce qu\'il faut savoir pour choisir un peintre professionnel au Maroc : tarifs, types de peintures, questions à poser et erreurs à éviter.',
            'category'    => 'Général',
            'city'        => null,
            'readTime'    => 6,
            'date'        => '2026-05-15',
            'intro'       => "La peinture est l'un des travaux les plus fréquents dans les logements marocains. Mal exécutée, elle peut faire fuir des locataires ou dévaluer un bien. Voici comment choisir le bon peintre.",
            'sections'    => [
                [
                    'title'   => '1. Les différents types de peinture',
                    'content' => "**Peinture intérieure :**\n- **Peinture plastique (mate)** : la plus utilisée, lessivable, idéale pour les murs\n- **Peinture satinée** : plus brillante, résistante à l'humidité, recommandée pour cuisines/SDB\n- **Peinture vinylique** : économique, couvre bien, moins durable\n- **Enduit décoratif (tadelakt, béton ciré)** : effet haut de gamme, prix plus élevé\n\n**Peinture extérieure :**\n- **Peinture façade minérale** : résistante aux UV et aux intempéries, idéale pour le climat marocain\n- **Peinture acrylique extérieure** : flexible, bonne tenue dans le temps",
                ],
                [
                    'title'   => '2. Tarifs de la peinture au Maroc (2026)',
                    'content' => "| Type de prestation | Prix m² (main-d'œuvre) |\n|---|---|\n| Peinture murale intérieure (2 couches) | 15–35 MAD/m² |\n| Peinture plafond | 20–40 MAD/m² |\n| Enduit + peinture (3 couches) | 40–70 MAD/m² |\n| Peinture façade extérieure | 30–60 MAD/m² |\n| Tadelakt / béton ciré | 150–300 MAD/m² |\n\n*Hors matériaux. Pour un appartement de 100m², comptez 3 000–7 000 MAD main d'œuvre + matériaux.*",
                ],
                [
                    'title'   => '3. Ce que doit inclure un bon devis',
                    'content' => "Un peintre sérieux vous remet un devis qui précise :\n\n- La surface à peindre (m²)\n- Le type de peinture et la marque utilisée\n- Le nombre de couches\n- La préparation des surfaces (lessivage, enduit, ponçage)\n- Le délai d'exécution\n- Le prix main-d'œuvre et matériaux séparés\n- Les conditions de garantie\n\n**Red flags :** devis verbal uniquement, refus de préciser la marque de peinture, prix global sans détail.",
                ],
                [
                    'title'   => '4. Questions essentielles à poser',
                    'content' => "**Avant de valider un peintre :**\n- Préparez-vous les surfaces vous-même ou est-ce inclus ?\n- Quelle marque de peinture utilisez-vous ?\n- Qui achète la peinture — vous ou moi ?\n- Que se passe-t-il si des défauts apparaissent dans les 3 mois ?\n- Avez-vous des photos de réalisations récentes ?\n\n*Conseil :* Achetez vous-même la peinture si possible — vous contrôlez la qualité et évitez les marges cachées.",
                ],
                [
                    'title'   => '5. Erreurs fréquentes des clients',
                    'content' => "**Ce que font les clients qui regrettent leur choix :**\n\n❌ Choisir uniquement sur le prix — un devis 30% moins cher peut cacher une peinture bas de gamme\n❌ Ne pas voir les travaux précédents — demandez à visiter un chantier récent\n❌ Payer intégralement à l'avance — maximum 30-40% d'acompte\n❌ Pas de délai convenu — un chantier sans deadline peut durer des semaines\n❌ Confier un appartement vide sans protection — exigez que les sols et fenêtres soient protégés\n\n*Sur Jobly, les peintres sont notés par leurs clients. Lisez les avis avant de contacter.*",
                ],
            ],
            'cta' => [
                'text'  => 'Trouver un peintre vérifié près de chez vous',
                'url'   => '/professionals',
                'label' => 'Voir les peintres',
            ],
            'related' => [
                'prix-artisan-maroc-2026',
                'choisir-plombier-casablanca',
            ],
        ],

        'climatisation-maroc-guide' => [
            'slug'        => 'climatisation-maroc-guide',
            'title'       => 'Installation climatisation au Maroc : guide et tarifs 2026',
            'description' => 'Guide complet pour installer une climatisation au Maroc : choisir le bon modèle, trouver un technicien certifié, tarifs et entretien.',
            'category'    => 'Électricité',
            'city'        => null,
            'readTime'    => 5,
            'date'        => '2026-05-20',
            'intro'       => "Avec des étés de plus en plus chauds au Maroc, la climatisation est devenue indispensable. Mais mal installée, elle peut coûter cher en énergie et en réparations. Voici le guide complet.",
            'sections'    => [
                [
                    'title'   => '1. Choisir la bonne puissance',
                    'content' => "La puissance d'un climatiseur se mesure en BTU (British Thermal Unit) ou en kW :\n\n| Surface de la pièce | Puissance recommandée |\n|---|---|\n| Jusqu'à 15 m² | 9 000 BTU (1 chevaux) |\n| 15–25 m² | 12 000 BTU (1,5 chevaux) |\n| 25–35 m² | 18 000 BTU (2 chevaux) |\n| 35–50 m² | 24 000 BTU (3 chevaux) |\n\n*Note : si votre pièce est très exposée au soleil ou mal isolée, montez d'une puissance.*\n\n**Conseil :** Préférez un modèle **Inverter** — plus silencieux, jusqu'à 40% d'économies d'énergie.",
                ],
                [
                    'title'   => "2. Tarifs d'installation au Maroc (2026)",
                    'content' => "| Prestation | Prix indicatif |\n|---|---|\n| Installation split 9 000 BTU | 600–1 200 MAD |\n| Installation split 12 000 BTU | 700–1 400 MAD |\n| Installation split 18 000–24 000 BTU | 900–1 800 MAD |\n| Passage de câble en goulotte | 100–300 MAD |\n| Entretien annuel (nettoyage + gaz) | 300–600 MAD |\n\n*Hors prix de l'appareil. Un split 1 cheval (LG, Samsung, Midea) coûte 2 000–4 000 MAD selon la gamme.*",
                ],
                [
                    'title'   => '3. Ce que doit savoir faire votre technicien',
                    'content' => "Un technicien climatisation qualifié doit :\n\n- Réaliser une étude de charge thermique (ou au moins poser les bonnes questions)\n- Positionner correctement l'unité intérieure ET extérieure\n- Effectuer un vide (pompage) avant de mettre le gaz\n- Tester l'étanchéité du circuit frigorifique\n- Vérifier les pressions de fonctionnement\n- Respecter les normes électriques (disjoncteur dédié obligatoire)\n\n**Red flag :** un technicien qui installe sans faire de vide préalable met votre appareil en danger.",
                ],
                [
                    'title'   => '4. Entretien et durée de vie',
                    'content' => "**Entretien recommandé :**\n- Nettoyage des filtres : tous les 2 mois (à faire soi-même)\n- Entretien complet par technicien : 1 fois par an avant l'été\n- Recharge en gaz (si fuite) : à vérifier si les performances baissent\n\n**Durée de vie :**\n- Avec bon entretien : 10–15 ans\n- Sans entretien : 5–7 ans maximum\n\n*Conseil : un contrat d'entretien annuel avec votre technicien Jobly vous revient moins cher qu'une panne réparation tardive.*",
                ],
                [
                    'title'   => '5. Questions à poser avant de choisir',
                    'content' => "**À votre technicien :**\n- Quel modèle recommandez-vous pour ma surface et mon exposition ?\n- Faites-vous le vide avant mise en gaz ?\n- Quelle garantie sur l'installation ?\n- Proposez-vous un contrat d'entretien annuel ?\n\n**Avant d'acheter l'appareil :**\n- Classe énergétique A++ minimum\n- Modèle Inverter ou non ?\n- Garantie constructeur (2 ans minimum au Maroc)\n- Pièces de rechange disponibles localement ?",
                ],
            ],
            'cta' => [
                'text'  => 'Trouver un technicien climatisation vérifié',
                'url'   => '/professionals',
                'label' => 'Voir les techniciens',
            ],
            'related' => [
                'choisir-electricien-maroc',
                'prix-artisan-maroc-2026',
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
