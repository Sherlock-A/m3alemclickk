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

        'maconnerie-maroc-guide' => [
            'slug'        => 'maconnerie-maroc-guide',
            'title'       => "Trouver un maçon qualifié au Maroc en 2026",
            'description' => "Guide complet pour choisir un maçon fiable au Maroc : qualifications, tarifs, questions à poser et erreurs à éviter pour vos travaux de maçonnerie.",
            'category'    => 'Maçonnerie',
            'city'        => null,
            'readTime'    => 6,
            'date'        => '2026-05-20',
            'intro'       => "La maçonnerie est l'un des corps de métier les plus demandés au Maroc — et l'un des plus complexes à évaluer. Un bon maçon peut transformer un logement ; un mauvais peut causer des dégâts structurels coûteux. Voici comment faire le bon choix.",
            'sections'    => [
                [
                    'title'   => "1. Les spécialités de la maçonnerie",
                    'content' => "La maçonnerie regroupe plusieurs métiers distincts :\n\n**Gros œuvre :**\n- **Maçon** : construction de murs, dalles, fondations\n- **Coffreur** : pose des coffrages pour le béton armé\n- **Ferrailleur** : assemblage des armatures en acier\n\n**Second œuvre :**\n- **Carreleur** : pose de carrelage et faïence\n- **Enduiseur** : application d'enduits, crépis\n- **Façadier** : travaux de ravalement\n\n*Conseil : avant de contacter un artisan, identifiez précisément le type de travaux dont vous avez besoin — cela vous permettra de cibler le bon profil.*",
                ],
                [
                    'title'   => "2. Tarifs indicatifs 2026",
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Pose carrelage sol | 80–150 MAD/m² |\n| Pose faïence murale | 100–200 MAD/m² |\n| Construction mur parpaing | 300–600 MAD/m² |\n| Enduit intérieur | 50–100 MAD/m² |\n| Ravalement façade | 70–150 MAD/m² |\n| Démolition cloison | 200–500 MAD |\n| Réparation fissure | 150–400 MAD |\n\n*Hors matériaux. Tarifs plus élevés à Casablanca et Rabat (+15–20%).*",
                ],
                [
                    'title'   => "3. Comment évaluer la qualité d'un maçon",
                    'content' => "**Demandez à voir des réalisations récentes :**\n- Finitions des joints de carrelage (réguliers, propres)\n- Aplomb des murs et angles à 90°\n- Absence de fissures dans les enduits\n\n**Testez sa connaissance technique :**\n- Quel type de ciment pour ce travail ?\n- Comment traitez-vous les joints de dilatation ?\n- Utilisez-vous un niveau laser ou à bulle ?\n\n**Vérifiez son organisation :**\n- Arrive-t-il à l'heure au rendez-vous d'évaluation ?\n- Mesure-t-il correctement avant de chiffrer ?\n- Vous remet-il un devis détaillé par écrit ?",
                ],
                [
                    'title'   => "4. Devis et contrat : ce qu'il faut vérifier",
                    'content' => "Un devis de maçonnerie sérieux doit préciser :\n\n- La surface exacte à traiter (m²)\n- Le type de matériaux (marque du ciment, type de carrelage si fourni)\n- La main-d'œuvre et les matériaux séparément\n- Le délai de réalisation\n- Les conditions de nettoyage du chantier\n- La garantie décennale (obligatoire pour le gros œuvre)\n\n**Red flags :**\n- Devis global sans détail des postes\n- Refus de séparer main-d'œuvre et matériaux\n- Demande de 100% d'acompte avant démarrage\n- Pas de délai précis",
                ],
                [
                    'title'   => "5. Précautions spécifiques au Maroc",
                    'content' => "**Avant de commencer :**\n- Pour tout travail structurel (murs porteurs, fondations, dalles), demandez un avis à un ingénieur structure\n- Vérifiez que les travaux ne nécessitent pas de permis de construire (travaux > 50 m² en général)\n- Assurez-vous que le maçon connaît les normes parasismiques locales\n\n**Pendant le chantier :**\n- Visitez régulièrement le chantier pour valider l'avancement\n- Ne payez que par tranches liées aux étapes (fondations, élévation, finitions)\n- Photographiez chaque étape pour avoir une trace\n\n*Sur Jobly, les maçons sont vérifiés et notés par leurs clients. Consultez les avis avant de choisir.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un maçon vérifié au Maroc",
                'url'   => '/professionals?profession=Maçon',
                'label' => 'Voir les maçons',
            ],
            'related' => [
                'prix-artisan-maroc-2026',
                'choisir-plombier-casablanca',
            ],
        ],

        'menuiserie-bois-maroc' => [
            'slug'        => 'menuiserie-bois-maroc',
            'title'       => "Choisir un menuisier bois au Maroc : guide 2026",
            'description' => "Tout savoir pour choisir un menuisier bois qualifié au Maroc : spécialités, tarifs, questions clés et comment évaluer la qualité d'un artisan.",
            'category'    => 'Menuiserie',
            'city'        => null,
            'readTime'    => 5,
            'date'        => '2026-05-22',
            'intro'       => "La menuiserie bois est un art qui demande technique et savoir-faire. Que vous ayez besoin de portes, fenêtres, placards ou d'une cuisine sur mesure, choisir le bon menuisier fait toute la différence.",
            'sections'    => [
                [
                    'title'   => "1. Les différents types de menuisiers",
                    'content' => "**Menuisier d'atelier (ébéniste) :**\n- Fabrique des meubles et agencements sur mesure\n- Travaille principalement en atelier\n- Adapté pour : cuisines, dressings, bibliothèques, tables\n\n**Menuisier poseur :**\n- Installe des éléments préfabriqués\n- Travaille principalement sur chantier\n- Adapté pour : pose de portes, fenêtres, parquet, plafonds\n\n**Menuisier aluminium / PVC :**\n- Spécialiste des ouvertures modernes\n- Adapté pour : fenêtres double-vitrage, volets roulants, vérandas\n\n*Au Maroc, beaucoup de menuisiers maîtrisent à la fois le bois massif et le bois reconstitué (MDF, contreplaqué). Précisez votre besoin avant de contacter.*",
                ],
                [
                    'title'   => "2. Tarifs de la menuiserie au Maroc (2026)",
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Pose porte intérieure | 200–400 MAD |\n| Fabrication porte bois sur mesure | 800–2 000 MAD |\n| Placard 1 porte sur mesure | 600–1 500 MAD |\n| Dressing complet (3m linéaires) | 3 000–8 000 MAD |\n| Cuisine équipée MDF | 8 000–25 000 MAD |\n| Parquet stratifié (pose) | 60–100 MAD/m² |\n| Fenêtre bois double-vitrage | 800–2 000 MAD |\n| Escalier bois sur mesure | 4 000–12 000 MAD |\n\n*Hors matériaux. Les prix varient selon la qualité du bois (pin, chêne, hêtre) et la complexité des finitions.*",
                ],
                [
                    'title'   => "3. Comment évaluer la qualité du travail",
                    'content' => "**En atelier ou sur des réalisations :**\n- Observez la régularité des assemblages (joints serrés, sans espace visible)\n- Testez les ouvrants : portes et tiroirs doivent glisser sans accroc\n- Vérifiez la finition : ponçage uniforme, peinture ou vernis sans coulures\n\n**Questions à poser :**\n- Quel type de bois utilisez-vous ? (bois massif vs. MDF/contreplaqué)\n- Les quincailleries sont-elles de marque ? (charnières, glissières, poignées)\n- Quelle est la garantie sur votre travail ?\n- Pouvez-vous me montrer des photos de réalisations similaires ?",
                ],
                [
                    'title'   => "4. Bois massif vs. MDF : que choisir ?",
                    'content' => "| Critère | Bois massif | MDF / Contreplaqué |\n|---------|-------------|-------------------|\n| Durabilité | 30–50 ans | 10–20 ans |\n| Prix | Élevé | Abordable |\n| Résistance humidité | Moyenne | Faible (sauf traité) |\n| Aspect naturel | ✓ Chaleureux | Variable selon finition |\n| Personnalisation | Totale | Limitée |\n\n**Recommandation pour le Maroc :**\n- Cuisine, salle de bain → MDF hydrofuge ou PVC (humidité)\n- Chambre, salon → Bois massif ou MDF de qualité\n- Escalier, parquet → Bois massif obligatoire",
                ],
                [
                    'title'   => "5. Délais et planification du chantier",
                    'content' => "La menuiserie sur mesure prend du temps. Anticipez :\n\n**Délais moyens au Maroc :**\n- Porte simple → 3–7 jours\n- Placard sur mesure → 1–2 semaines\n- Cuisine équipée → 3–6 semaines\n- Dressing complet → 2–4 semaines\n\n**Conseils pratiques :**\n- Validez les plans et dimensions AVANT la fabrication (les erreurs sont coûteuses)\n- Prévoyez une visite de prise de mesures précises\n- Ne payez le solde qu'après livraison et vérification complète\n- Demandez que les finitions soient faites après pose (ponçage, vernis) pour un résultat professionnel\n\n*Sur Jobly, consultez le portfolio du menuisier avant de le contacter — les photos parlent mieux que les mots.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un menuisier vérifié au Maroc",
                'url'   => '/professionals?profession=Menuisier',
                'label' => 'Voir les menuisiers',
            ],
            'related' => [
                'prix-artisan-maroc-2026',
                'peintre-maroc-guide',
            ],
        ],

        'demenagement-casablanca' => [
            'slug'        => 'demenagement-casablanca',
            'title'       => "Déménagement à Casablanca : guide complet 2026",
            'description' => "Comment organiser votre déménagement à Casablanca : choisir un déménageur fiable, tarifs, checklist et conseils pour éviter les mauvaises surprises.",
            'category'    => 'Déménagement',
            'city'        => 'Casablanca',
            'readTime'    => 6,
            'date'        => '2026-05-22',
            'intro'       => "Déménager à Casablanca peut vite tourner au cauchemar sans une bonne préparation. Entre les embouteillages, les immeubles sans ascenseur et les déménageurs peu scrupuleux, mieux vaut être bien informé. Ce guide vous donne toutes les clés.",
            'sections'    => [
                [
                    'title'   => "1. Tarifs des déménageurs à Casablanca (2026)",
                    'content' => "Les prix dépendent de la distance, du volume et de l'accès :\n\n| Type de déménagement | Prix indicatif |\n|---------------------|---------------|\n| Studio (< 40 m²) même quartier | 500–800 MAD |\n| F2 (40–60 m²) même quartier | 800–1 500 MAD |\n| F3 (60–90 m²) même quartier | 1 500–3 000 MAD |\n| F4 (90–120 m²) même quartier | 2 500–5 000 MAD |\n| Déménagement inter-quartiers | +200–500 MAD |\n| Emballage inclus | +30–50% |\n| Monte-meuble (étages élevés) | +300–800 MAD |\n\n*Les prix varient selon le nombre de déménageurs (généralement 2 à 4 personnes).*",
                ],
                [
                    'title'   => "2. Comment choisir un déménageur fiable",
                    'content' => "**Vérifications essentielles :**\n- L'entreprise dispose-t-elle d'un véhicule adapté (camionnette ou camion avec hayon) ?\n- Propose-t-elle une assurance marchandises ?\n- Le prix inclut-il l'emballage des objets fragiles ?\n- Y a-t-il un représentant qui supervise (pas juste des manœuvres) ?\n\n**Questions clés à poser :**\n- Combien de déménageurs pour mon volume ?\n- Avez-vous du matériel de protection (couvertures, sangles, cartons) ?\n- Que se passe-t-il en cas de dommage sur un meuble ?\n- Le tarif est-il fixe ou calculé au temps passé ?",
                ],
                [
                    'title'   => "3. Checklist préparation : J-15 à J-1",
                    'content' => "**J-15 :**\n- Contactez 2–3 déménageurs, comparez les devis\n- Réservez le déménageur retenu avec un acompte de 20–30%\n- Commandez les cartons si emballage auto\n\n**J-7 :**\n- Commencez l'emballage des objets non courants (livres, déco, vêtements hors-saison)\n- Démontez les meubles complexes\n- Informez vos voisins et demandez l'accès aux ascenseurs/monte-charges\n\n**J-1 :**\n- Préparez un carton \"urgence\" (médicaments, documents, chargeurs)\n- Videz et débranchez le réfrigérateur\n- Réservez un parking devant chaque logement",
                ],
                [
                    'title'   => "4. Spécificités de Casablanca",
                    'content' => "**Quartiers à circulation difficile :**\n- Médina, Derb Sultan, Hay Hassani : rues étroites → prévoir une petite camionnette\n- Maarif, Gauthier, Racine : stationnement difficile → venez tôt le matin\n- Ain Diab, Anfa : accès réglementé le week-end dans certaines résidences\n\n**Immeubles sans ascenseur :**\nCasablanca compte de nombreux immeubles R+4 ou R+5 sans ascenseur. Signalez-le au déménageur en amont — le tarif peut augmenter de 15–30%.\n\n**Horaires recommandés :**\n- Évitez les heures de pointe (7h–9h et 17h–19h)\n- Le vendredi matin est idéal (moins de circulation)\n- Le week-end en milieu de matinée est aussi une bonne option",
                ],
                [
                    'title'   => "5. Pièges à éviter",
                    'content' => "**Les arnaques fréquentes :**\n\n❌ **Le devis verbal** : toujours exiger un tarif écrit — certains gonflent la facture une fois les meubles dans le camion\n\n❌ **Le paiement à l'avance total** : maximum 30% d'acompte, solde à la fin\n\n❌ **L'absence d'assurance** : si un déménageur casse votre TV sans assurance, vous n'avez aucun recours\n\n❌ **Les sous-traitants non annoncés** : certaines \"entreprises\" sous-traitent sans informer le client — le niveau de soin chute drastiquement\n\n❌ **La camionnette trop petite** : un déménageur qui sous-estime le volume = 2 allers-retours = double le temps et le prix\n\n*Sur Jobly, contactez directement des déménageurs vérifiés avec avis clients réels.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un déménageur vérifié à Casablanca",
                'url'   => '/professionnels/casablanca',
                'label' => 'Voir les déménageurs',
            ],
            'related' => [
                'prix-artisan-maroc-2026',
                'femme-de-menage-casablanca',
            ],
        ],

        'jardinage-marrakech' => [
            'slug'        => 'jardinage-marrakech',
            'title'       => "Trouver un jardinier à Marrakech en 2026",
            'description' => "Guide pour trouver un jardinier fiable à Marrakech : tarifs, services proposés, entretien adapté au climat marocain et conseils pour votre jardin ou espace vert.",
            'category'    => 'Jardinage',
            'city'        => 'Marrakech',
            'readTime'    => 5,
            'date'        => '2026-05-22',
            'intro'       => "Le climat de Marrakech — chaud et sec l'été, doux l'hiver — demande une approche spécifique du jardinage. Que vous ayez une villa avec jardin, une terrasse ou un riad avec patio, voici comment trouver le bon jardinier.",
            'sections'    => [
                [
                    'title'   => "1. Services proposés par les jardiniers à Marrakech",
                    'content' => "**Entretien régulier :**\n- Tonte de pelouse\n- Taille des haies et arbustes\n- Arrosage et gestion de l'arrosage automatique\n- Désherbage et traitement des mauvaises herbes\n\n**Création et aménagement :**\n- Création de jardin (conception, plantation, gazon)\n- Aménagement de terrasse ou patio\n- Création de potager\n- Pose de système d'arrosage automatique\n\n**Spécialités Marrakech :**\n- Entretien de palmiers (taille, traitement contre le charançon rouge)\n- Aménagement de jardins marocains traditionnels (cyprès, rosiers, buis taillés)\n- Gestion de la piscine entourée de végétation",
                ],
                [
                    'title'   => "2. Tarifs à Marrakech (2026)",
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Entretien mensuel (petit jardin < 100 m²) | 300–600 MAD |\n| Entretien mensuel (grand jardin 100–500 m²) | 600–1 500 MAD |\n| Taille de haie | 100–300 MAD |\n| Taille de palmier | 150–500 MAD (selon hauteur) |\n| Création de jardin (conception) | 1 500–5 000 MAD |\n| Pose arrosage automatique | 2 000–8 000 MAD |\n| Nettoyage unique (grand jardin) | 400–1 000 MAD |\n\n*Prix plus élevés pour les villas de Palmeraie et riads de la médina (accès difficile).*",
                ],
                [
                    'title'   => "3. Plantes adaptées au climat de Marrakech",
                    'content' => "Un bon jardinier marrakechi connaît les plantes adaptées au climat semi-aride local :\n\n**Résistantes à la chaleur et à la sécheresse :**\n- Bougainvillée (idéale pour les murs et tonnelles)\n- Laurier-rose (oleander)\n- Agave et cactus\n- Cyprès méditerranéen\n- Hibiscus\n\n**Pour les espaces ombragés et riads :**\n- Jasmin (parfum incontournable)\n- Menthe (pour thé à la menthe)\n- Géranium\n- Ficus\n\n**Pour la pelouse :**\n- Gazon bermuda (résistant chaleur)\n- Gazon kikuyu (pousse rapide)\n\n*Évitez les plantes européennes gourmandes en eau — elles souffrent en été marrakechi.*",
                ],
                [
                    'title'   => "4. Questions à poser à votre jardinier",
                    'content' => "**Compétence technique :**\n- Connaissez-vous le charançon rouge du palmier et comment le prévenir ?\n- Quel programme d'arrosage recommandez-vous pour l'été ?\n- Utilisez-vous des produits phytosanitaires homologués ?\n\n**Organisation :**\n- Venez-vous avec votre matériel (tondeuse, taille-haie, souffleur) ?\n- Êtes-vous disponible pour des interventions d'urgence après une tempête de sable ?\n- Proposez-vous un contrat d'entretien mensuel avec forfait fixe ?\n\n**Références :**\n- Avez-vous des clients dans mon quartier (Palmeraie, Guéliz, Hivernage) ?\n- Pouvez-vous me montrer des jardins que vous entretenez régulièrement ?",
                ],
                [
                    'title'   => "5. Spécificités des riads et propriétés de Marrakech",
                    'content' => "**Riads de la médina :**\n- Le patio central est souvent restreint et nécessite des plantes en pot\n- L'arrosage manuel est généralement nécessaire (pas d'arrosage automatique possible)\n- Faites appel à un jardinier habitué aux riads — les contraintes d'espace sont spécifiques\n\n**Villas de Palmeraie :**\n- Grandes surfaces nécessitant un entretien hebdomadaire ou bihebdomadaire\n- Arrosage automatique quasi-indispensable l'été (consommation d'eau importante)\n- Attention aux palmiers : inspection annuelle recommandée pour le charançon rouge\n\n**Agences de location :**\nSi vous louez votre propriété sur Airbnb ou Booking, un jardinier régulier est indispensable. Certains proposent des contrats avec disponibilité garantie entre chaque location.\n\n*Jobly liste des jardiniers vérifiés à Marrakech — consultez les avis et portfolios avant de contacter.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un jardinier vérifié à Marrakech",
                'url'   => '/professionnels/marrakech',
                'label' => 'Voir les jardiniers',
            ],
            'related' => [
                'prix-artisan-maroc-2026',
                'climatisation-maroc-guide',
            ],
        ],

        'plombier-rabat-guide' => [
            'slug'        => 'plombier-rabat-guide',
            'title'       => "Plombier à Rabat : tarifs et conseils 2026",
            'description' => "Guide complet pour trouver un plombier fiable à Rabat : tarifs actualisés 2026, vérifications essentielles et conseils pour éviter les arnaques dans la capitale.",
            'category'    => 'Plomberie',
            'city'        => 'Rabat',
            'readTime'    => 5,
            'date'        => '2026-05-23',
            'intro'       => "Trouver un plombier de confiance à Rabat peut être délicat, entre les quartiers aux vieilles canalisations (Médina, Agdal historique) et les résidences modernes de Hay Riad et Souissi. Ce guide vous aide à faire le bon choix.",
            'sections'    => [
                [
                    'title'   => "1. Tarifs des plombiers à Rabat (2026)",
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Fuite robinet | 150–300 MAD |\n| Débouchage évier / WC | 200–400 MAD |\n| Remplacement joint/mécanisme WC | 150–250 MAD |\n| Installation lavabo / évier | 300–600 MAD |\n| Remplacement chauffe-eau | 400–800 MAD (hors matériel) |\n| Fuite sous carrelage | 500–1 500 MAD |\n| Urgence soir/week-end | +50% sur le tarif normal |\n\n*Les tarifs à Rabat sont légèrement inférieurs à Casablanca (5–10%). Hay Riad et Souissi peuvent être plus chers.*",
                ],
                [
                    'title'   => "2. Problèmes spécifiques à Rabat",
                    'content' => "**Médina et vieux quartiers (Oudayas, Kasbah) :**\n- Canalisations anciennes en plomb ou en fonte → attention à la corrosion\n- Pression d'eau irrégulière → prévoir un surpresseur si nécessaire\n- Accès difficile pour les camions de débouchage → privilégiez les plombiers avec matériel portable\n\n**Résidences modernes (Hay Riad, Souissi) :**\n- Installations récentes mais parfois mal réalisées\n- Problèmes de pression dus aux chauffe-eaux solaires (courants dans ces quartiers)\n- Vérifiez la compatibilité des robinetteries avec la pression locale\n\n**Agdal / Hassan :**\n- Immeubles mixtes (anciens et récents) → diagnostics plus complexes\n- Fuites fréquentes dans les colonnes montantes des immeubles anciens",
                ],
                [
                    'title'   => "3. Choisir le bon plombier",
                    'content' => "**Vérifications avant d'appeler :**\n- Le plombier est-il joignable sur un numéro marocain stable ?\n- A-t-il des avis clients récents (moins de 6 mois) ?\n- Peut-il donner un premier avis par photos (via WhatsApp) avant de se déplacer ?\n\n**Questions à poser :**\n- Intervenez-vous dans mon quartier ? (certains refusent la Médina ou l'Agdal)\n- Quel est votre tarif de déplacement ?\n- Garantissez-vous votre intervention ?\n- Pouvez-vous établir un devis avant de commencer ?",
                ],
                [
                    'title'   => "4. Urgences plomberie à Rabat",
                    'content' => "**En cas de fuite urgente :**\n1. **Coupez l'eau** au compteur général (situé à l'entrée ou dans la cage d'escalier)\n2. Si l'eau coule d'un plafond ou mur → prévenez immédiatement votre voisin du dessus\n3. Photographiez les dégâts pour l'assurance\n4. Contactez un plombier disponible maintenant via Jobly (filtrez par disponibilité)\n\n**Numéros utiles Rabat :**\n- REDAL (eau) : signalement fuites réseau public\n- Syndic de résidence : pour les problèmes de colonne commune\n\n*Note : Les fuites dans les parties communes (colonnes montantes, toits) relèvent du syndic — pas à votre charge.*",
                ],
                [
                    'title'   => "5. Entretien préventif recommandé",
                    'content' => "Évitez les urgences coûteuses avec un entretien régulier :\n\n**Tous les 6 mois :**\n- Vérifiez les joints des robinets (changez-les si vous entendez une goutte)\n- Détartrez le pommeau de douche et les aérateurs de robinets\n- Inspectez les siphons sous les éviers\n\n**Tous les 2 ans :**\n- Vérifiez le chauffe-eau (anode, sécurité de pression)\n- Inspectez les raccords visibles (sous l'évier, derrière le WC)\n\n**Avant chaque hiver :**\n- Si chauffe-eau solaire : vérifiez le fluide caloporteur\n- Isolez les canalisations exposées aux balcons ou terrasses\n\n*Un plombier Jobly peut réaliser une inspection complète pour 150–300 MAD — c'est souvent moins cher qu'une urgence.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un plombier vérifié à Rabat",
                'url'   => '/professionnels/rabat/plomberie',
                'label' => 'Voir les plombiers de Rabat',
            ],
            'related' => [
                'choisir-plombier-casablanca',
                'prix-artisan-maroc-2026',
            ],
        ],

        'femme-menage-rabat' => [
            'slug'        => 'femme-menage-rabat',
            'title'       => "Aide ménagère à Rabat : comment trouver la bonne",
            'description' => "Guide pratique pour trouver une aide ménagère fiable à Rabat : tarifs 2026, questions essentielles, quartiers et conseils pour une relation de confiance durable.",
            'category'    => 'Ménage',
            'city'        => 'Rabat',
            'readTime'    => 5,
            'date'        => '2026-05-23',
            'intro'       => "Rabat, ville administrative et résidentielle, compte une forte demande en services ménagers. Fonctionnaires, diplomates, familles d'expatriés — tout le monde cherche une aide ménagère de confiance. Voici comment ne pas se tromper.",
            'sections'    => [
                [
                    'title'   => "1. Tarifs à Rabat en 2026",
                    'content' => "| Prestation | Tarif indicatif |\n|-----------|----------------|\n| Ménage ponctuel (demi-journée, 4h) | 150–250 MAD |\n| Ménage ponctuel (journée, 8h) | 250–400 MAD |\n| Forfait hebdomadaire (1×/semaine) | 600–1 200 MAD/mois |\n| Forfait bihebdomadaire (2×/semaine) | 1 000–2 000 MAD/mois |\n| Grand ménage (appartement T3) | 350–600 MAD |\n| Repassage seul (2–3h) | 100–180 MAD |\n\n*Tarifs légèrement supérieurs dans les quartiers Hay Riad, Souissi, et pour les résidences diplomatiques.*",
                ],
                [
                    'title'   => "2. Spécificités de Rabat",
                    'content' => "**Quartiers résidentiels huppés (Hay Riad, Souissi) :**\n- Demande forte → certaines aides ménagères ont plusieurs clients et sont très demandées\n- Recommandez-vous d'une ambassade ou d'une administration → vos chances d'avoir un bon profil augmentent\n\n**Quartiers médina et Agdal :**\n- Tarifs légèrement inférieurs\n- Profils souvent recommandés par les voisins (réseau de confiance fort)\n\n**Familles d'expatriés :**\n- Préférence pour les profils bilingues (arabe + français)\n- Parfois besoin de garde d'enfants combiné au ménage\n- Budget généralement plus élevé, attentes de ponctualité très strictes",
                ],
                [
                    'title'   => "3. Questions essentielles à poser",
                    'content' => "**Lors du premier contact :**\n- Avez-vous des références vérifiables à Rabat ?\n- Êtes-vous disponible aux jours et heures souhaités ?\n- Quelle est votre expérience avec les enfants ou animaux ?\n- Parlez-vous français ? (important pour les familles expatriées)\n\n**À la première rencontre :**\n- Faites un tour complet du logement en listant les tâches\n- Testez la communication : comprend-elle ce que vous demandez ?\n- Observez si elle pose des questions pertinentes ou commence sans comprendre\n\n*Conseil : commencez toujours par une mission test payée avant tout engagement régulier.*",
                ],
                [
                    'title'   => "4. Mettre en place une relation durable",
                    'content' => "**Les bases d'une collaboration réussie :**\n\n1. **Soyez clair sur les attentes** : liste de tâches écrite la première fois\n2. **Soyez ponctuel** dans vos paiements — c'est la base du respect mutuel\n3. **Donnez un retour** après les premières prestations : ce qui est bien, ce qui peut être amélioré\n4. **Anticipez les absences** : prévenez au moins 48h à l'avance\n5. **Respectez les horaires** : si elle arrive à 9h, ne la faites pas attendre à la porte\n\n**Gérez les absences :**\n- Définissez à l'avance la politique pour les jours fériés marocains\n- Établissez une règle pour les remplacements en cas de maladie",
                ],
                [
                    'title'   => "5. Aspects légaux et protection",
                    'content' => "**Déclaration CNSS :**\nEn théorie, toute aide ménagère employée plus de 6h/semaine doit être déclarée à la CNSS. En pratique, peu de particuliers le font, mais cela protège les deux parties.\n\n**Pour votre sécurité :**\n- Demandez une photocopie de la CIN dès le début\n- Notez par écrit la remise des clés avec sa signature\n- Ne laissez pas d'objets de valeur visibles lors des premières prestations\n\n**Pour sa sécurité :**\n- Payez à la date convenue, sans délai\n- Ne demandez pas des tâches non convenues sans accord préalable\n- Respectez les horaires de pause\n\n*Sur Jobly, les professionnels de service à domicile sont vérifiés et notés — une garantie de sérieux supplémentaire.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver une aide ménagère vérifiée à Rabat",
                'url'   => '/professionnels/rabat',
                'label' => 'Voir les professionnels de Rabat',
            ],
            'related' => [
                'femme-de-menage-casablanca',
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
