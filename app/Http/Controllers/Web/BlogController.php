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

        'serrurier-maroc-guide' => [
            'slug'        => 'serrurier-maroc-guide',
            'title'       => "Trouver un serrurier fiable au Maroc en 2026",
            'description' => "Guide complet pour choisir un serrurier au Maroc : urgences, tarifs, ouverture de porte et comment éviter les faux serruriers.",
            'category'    => 'Serrurerie',
            'city'        => null,
            'readTime'    => 5,
            'date'        => '2026-05-25',
            'intro'       => "Urgence serrure, clé perdue, serrure bloquée — la serrurerie est l'un des métiers où les arnaques sont les plus fréquentes, surtout en urgence. Voici comment trouver un serrurier honnête au Maroc.",
            'sections'    => [
                [
                    'title'   => "1. Types d'interventions en serrurerie",
                    'content' => "**Urgences courantes :**\n- Ouverture de porte claquée (clé oubliée à l'intérieur)\n- Ouverture de porte bloquée (serrure cassée ou grippée)\n- Clé cassée dans la serrure\n- Serrure forcée après tentative de cambriolage\n\n**Travaux planifiés :**\n- Remplacement de serrure (upgrade sécurité)\n- Installation de verrous supplémentaires\n- Blindage de porte\n- Copie de clé (certaines serrures à protections spéciales)\n\n*Règle d'or : en urgence, vous êtes en position de faiblesse. C'est là que les arnaques sont les plus fréquentes. Préparez-vous en amont.*",
                ],
                [
                    'title'   => "2. Tarifs indicatifs au Maroc (2026)",
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Ouverture de porte (copie de clé possible) | 200–400 MAD |\n| Ouverture de porte (serrure à remplacer) | 300–600 MAD |\n| Remplacement serrure standard | 300–700 MAD |\n| Serrure 3 points (haute sécurité) | 600–1 500 MAD |\n| Blindage de porte | 1 500–4 000 MAD |\n| Copie de clé simple | 20–50 MAD |\n| Copie de clé sécurisée | 80–200 MAD |\n| Majoration urgence nuit/week-end | +50–100% |\n\n*Hors matériaux si remplacement de serrure.*",
                ],
                [
                    'title'   => "3. Comment repérer un faux serrurier",
                    'content' => "**Les signaux d'alarme :**\n\n❌ Annonce un prix très bas au téléphone (50–100 MAD) puis facture 5× plus cher sur place\n❌ Refuse de donner un devis avant d'intervenir\n❌ Détruit la serrure \"obligatoirement\" alors que l'ouverture était possible sans dégâts\n❌ Présente une facture manuscrite sans identité d'entreprise\n❌ Insiste pour être payé immédiatement en cash\n❌ Son numéro est un numéro de téléphone portable inconnu (pas une entreprise locale)\n\n**Bons signes :**\n✅ Donne un fourchette de prix claire au téléphone\n✅ Présente une carte de visite ou un devis écrit\n✅ Essaie d'abord d'ouvrir sans dégâts (crochetage)\n✅ Disponible sur Jobly avec des avis clients vérifiés",
                ],
                [
                    'title'   => "4. Ce que vous pouvez faire vous-même",
                    'content' => "Avant d'appeler un serrurier, vérifiez :\n\n- **Porte claquée** : y a-t-il une fenêtre ou un autre accès non verrouillé ?\n- **Clé cassée** : si le bout dépasse, des pinces fines peuvent parfois l'extraire\n- **Serrure grippée** : une goutte d'huile de lubrification (type WD-40) peut suffire\n- **Verrou de sûreté** : vérifiez que vous n'avez pas activé par erreur un verrou intérieur\n\n*Si vous devez appeler : prenez le numéro d'un serrurier de confiance AVANT d'en avoir besoin. En urgence à 23h, vous aurez moins de recul.*",
                ],
                [
                    'title'   => "5. Améliorer la sécurité de votre logement",
                    'content' => "**Investissements recommandés (par priorité) :**\n\n1. **Serrure 3 points** (environ 800–1 200 MAD) : le standard pour une sécurité sérieuse au Maroc\n2. **Verrou de sûreté supplémentaire** (200–400 MAD) : simple et efficace\n3. **Judas digital** (200–400 MAD) : voir qui sonne sans ouvrir\n4. **Blindage de porte** (2 000–4 000 MAD) : uniquement si zone à risque ou appartement de valeur\n\n**Conseils pratiques :**\n- Ne laissez jamais votre clé sous le paillasson ou dans une cachette évidente\n- Gardez le contact d'un serrurier de confiance dans votre téléphone\n- Faites copier vos clés uniquement chez un serrurier connu (certaines serrures sécurisées interdisent la copie sans autorisation)\n\n*Sur Jobly, les serruriers sont vérifiés et leurs tarifs sont consultables avant de les contacter.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un serrurier vérifié au Maroc",
                'url'   => '/professionals?profession=Serrurier',
                'label' => 'Voir les serruriers',
            ],
            'related' => [
                'prix-artisan-maroc-2026',
                'choisir-plombier-casablanca',
            ],
        ],

        'electricien-casablanca' => [
            'slug'        => 'electricien-casablanca',
            'title'       => "Électricien à Casablanca : guide et tarifs 2026",
            'description' => "Comment trouver un électricien qualifié à Casablanca : tarifs 2026 par quartier, urgences électriques, travaux courants et comment éviter les arnaques dans la métropole.",
            'category'    => 'Électricité',
            'city'        => 'Casablanca',
            'readTime'    => 5,
            'date'        => '2026-05-25',
            'intro'       => "Casablanca, avec ses 4 millions d'habitants et ses immeubles d'âges très variés, présente des besoins électriques spécifiques. Voici comment trouver un électricien fiable dans la métropole économique du Maroc.",
            'sections'    => [
                [
                    'title'   => "1. Tarifs à Casablanca en 2026",
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Diagnostic panne électrique | 100–200 MAD |\n| Remplacement prise / interrupteur | 80–180 MAD |\n| Pose d'un luminaire | 120–250 MAD |\n| Mise aux normes tableau électrique | 500–1 000 MAD |\n| Installation climatisation (circuit dédié) | 400–800 MAD |\n| Rénovation électrique complète appartement | 4 000–10 000 MAD |\n| Urgence (soir, week-end) | +40–60% |\n\n*Les tarifs à Maarif, Gauthier, Anfa et Hay Riad sont généralement 10–20% plus élevés qu'à Hay Hassani, Sidi Moumen ou Ain Sebaa.*",
                ],
                [
                    'title'   => "2. Problèmes électriques fréquents à Casablanca",
                    'content' => "**Immeubles anciens (Médina, Derb Sultan, Roches Noires) :**\n- Installations vétustes sans mise à la terre\n- Câblage en aluminium (dangereux, doit être remplacé)\n- Tableaux électriques sous-dimensionnés (pas prévu pour la clim, lave-vaisselle, etc.)\n\n**Résidences modernes (Californie, Bouskoura, CIL) :**\n- Disjoncteurs qui sautent à cause de climatisations mal dimensionnées\n- Problèmes de mise à la terre dans les salles de bain\n- Câblage de mauvaise qualité dans certaines résidences récentes (promoteurs peu scrupuleux)\n\n**Conseils :**\n- Si vous emménagez, faites faire un diagnostic complet de l'installation\n- Vérifiez que votre tableau a un disjoncteur différentiel (sécurité personnes)\n- Signalez toute odeur de brûlé à un professionnel immédiatement",
                ],
                [
                    'title'   => "3. Urgences électriques : que faire",
                    'content' => "**Disjoncteur général qui saute :**\n1. Débranchez tous les appareils de la pièce concernée\n2. Remettez le disjoncteur — s'il resaute, l'appareil fautif est encore branché\n3. Testez appareil par appareil pour identifier le coupable\n4. Si ça continue sans appareil branché : appelez un électricien\n\n**Court-circuit ou odeur de brûlé :**\n1. Coupez le disjoncteur général immédiatement\n2. N'intervenez pas vous-même\n3. Ouvrez les fenêtres\n4. Appelez un électricien d'urgence via Jobly\n\n**Électrocution (contact électrique) :**\n1. Coupez d'abord le courant — ne touchez pas la personne avant\n2. Appelez le 15 (SAMU) ou le 19\n3. Si la personne est inconsciente : appliquer les premiers secours",
                ],
                [
                    'title'   => "4. Choisir son électricien à Casablanca",
                    'content' => "**Ce qu'il faut vérifier :**\n- Travaille-t-il dans votre quartier ? (certains refusent de venir en Médina ou à Sidi Moumen)\n- A-t-il de l'expérience avec votre type d'immeuble (ancien, neuf, villa) ?\n- Peut-il intervenir le jour même ou le lendemain ?\n\n**Questions clés à poser :**\n- Quel est votre tarif de déplacement à Casablanca ?\n- Faites-vous la mise à la terre ?\n- Garantissez-vous votre travail ? Sur quelle durée ?\n- Pouvez-vous me remettre un devis avant d'intervenir ?\n\n**Où trouver un bon électricien à Casablanca :**\n- Sur Jobly : filtrez par ville \"Casablanca\" et profession \"Électricien\"\n- Consultez les avis récents (moins de 3 mois) — les professionnels évoluent\n- Demandez un devis comparatif à 2–3 électriciens",
                ],
                [
                    'title'   => "5. Travaux de rénovation électrique",
                    'content' => "Si vous rénovez votre appartement à Casablanca, voici les étapes recommandées pour l'électricité :\n\n**Phase planning :**\n- Listez tous vos besoins (nombre de prises, points lumineux, circuits spéciaux)\n- Consultez un électricien AVANT les travaux de maçonnerie/peinture\n\n**Phase exécution :**\n1. Passage des gaines dans les murs (avant enduit)\n2. Câblage et distribution dans le tableau\n3. Pose des prises et interrupteurs (après enduit)\n4. Connexion du tableau et test général\n5. Mise à la terre et test de continuité\n\n**Coût d'une rénovation électrique complète à Casablanca :**\n- Studio (< 50 m²) : 2 500–5 000 MAD\n- F3 (80–90 m²) : 5 000–10 000 MAD\n- Villa (150–200 m²) : 12 000–25 000 MAD\n\n*Demandez toujours un schéma électrique du tableau à la fin des travaux.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un électricien vérifié à Casablanca",
                'url'   => '/professionnels/casablanca/electricite',
                'label' => 'Voir les électriciens de Casablanca',
            ],
            'related' => [
                'choisir-electricien-maroc',
                'climatisation-maroc-guide',
            ],
        ],

        'plombier-marrakech' => [
            'slug'        => 'plombier-marrakech',
            'title'       => "Plombier à Marrakech : tarifs et conseils 2026",
            'description' => "Comment trouver un plombier fiable à Marrakech : tarifs actualisés, problèmes spécifiques aux riads et villas, urgences et conseils pratiques.",
            'category'    => 'Plomberie',
            'city'        => 'Marrakech',
            'readTime'    => 5,
            'date'        => '2026-05-25',
            'intro'       => "Marrakech présente des défis plomberie uniques : riads avec installations centenaires, villas de luxe avec piscines, forte chaleur estivale qui sollicite les chauffe-eaux. Voici comment trouver le bon plombier dans la Ville Ocre.",
            'sections'    => [
                [
                    'title'   => "1. Tarifs des plombiers à Marrakech (2026)",
                    'content' => "| Prestation | Prix indicatif |\n|-----------|---------------|\n| Fuite robinet | 150–300 MAD |\n| Débouchage évier / WC | 200–450 MAD |\n| Remplacement mécanisme WC | 150–280 MAD |\n| Installation point d'eau | 300–600 MAD |\n| Remplacement chauffe-eau | 400–900 MAD (hors matériel) |\n| Intervention chauffe-eau solaire | 300–700 MAD |\n| Urgence soir / week-end | +40–60% |\n\n*Les tarifs sont similaires à Casablanca. Les villas de Palmeraie et les hôtels peuvent payer jusqu'à 30% de plus pour un service réactif et de qualité.*",
                ],
                [
                    'title'   => "2. Spécificités de Marrakech",
                    'content' => "**Riads de la médina :**\n- Tuyauteries souvent centenaires, mélange de plomb et cuivre\n- Pas d'accès camion → matériel portatif obligatoire\n- Cours intérieures complexes → devis de visite avant intervention\n- Risque de rouille et tartre élevé (eau de Marrakech calcaire)\n\n**Villas et résidences (Palmeraie, Agdal, Guéliz) :**\n- Souvent des chauffe-eaux solaires (panneaux sur toit) → spécialité locale\n- Piscines : risques de fuites sur le circuit hydraulique\n- Jardins avec arrosage automatique : vérifiez les robinets de zone régulièrement\n\n**Maisons traditionnelles :**\n- Fosses septiques fréquentes (connexion réseau pas toujours faite)\n- Problèmes de débouchage annuels recommandés\n- Eau de puits dans certains quartiers → calcaire intense",
                ],
                [
                    'title'   => "3. Chauffe-eaux solaires : problèmes courants",
                    'content' => "Marrakech étant une des villes les plus ensoleillées du Maroc, les chauffe-eaux solaires sont très répandus. Problèmes courants :\n\n**En été :**\n- Eau trop chaude → prévoir un mitigeur thermique (90–150 MAD)\n- Pression excessive → soupape de sécurité à vérifier\n\n**En hiver :**\n- Chauffe-eau d'appoint électrique qui ne fonctionne plus → résistance à remplacer\n- Gel du fluide caloporteur (nuits froides) → vidanger et recharger en antigel\n\n**Entretien annuel recommandé :**\n- Vérification du circuit solaire (fuites, pression)\n- Nettoyage des capteurs (poussière de Marrakech)\n- Vérification du ballon (tartre, anode)\n\n*Un technicien spécialisé en solaire thermique facture généralement 200–500 MAD pour un entretien complet.*",
                ],
                [
                    'title'   => "4. Trouver un plombier fiable à Marrakech",
                    'content' => "**Vérifications essentielles :**\n- Intervient-il en médina ? (certains refusent à cause de l'accès difficile)\n- A-t-il de l'expérience avec les chauffe-eaux solaires ?\n- Peut-il se déplacer en zone Palmeraie ou Agdal ?\n\n**Questions importantes :**\n- Quel est votre tarif de déplacement (en médina vs. Guéliz) ?\n- Avez-vous de l'expérience avec les installations de riad ?\n- Proposez-vous un contrat d'entretien annuel ?\n\n**Pour les locations saisonnières (Airbnb, etc.) :**\n- Avoir un plombier de confiance joignable rapidement est indispensable\n- Certains pros Jobly proposent une disponibilité prioritaire pour les gérants de propriétés\n- Entretenez la relation : payez vite, donnez des avis, fidélisez-vous un bon artisan",
                ],
                [
                    'title'   => "5. Eau et calcaire à Marrakech : conseils durables",
                    'content' => "L'eau de Marrakech est parmi les plus calcaires du Maroc. Cela accélère l'usure de toute la plomberie.\n\n**Protections recommandées :**\n- **Adoucisseur d'eau** (1 500–5 000 MAD) : essentiel dans les villas avec équipements haut de gamme\n- **Filtre anticalcaire magnétique** (200–500 MAD) : solution économique pour les appartements\n- **Détartrant régulier** pour les robinets, pommes de douche et chauffe-eau\n\n**Signes d'un problème calcaire :**\n- Pression qui baisse progressivement dans la douche\n- Chauffe-eau qui prend de plus en plus de temps à chauffer\n- Taches blanches sur les robinets et la robinetterie\n- Son de \"craquement\" dans le chauffe-eau (dépôt de calcaire)\n\n*Sur Jobly, consultez les avis des clients à Marrakech avant de choisir votre plombier.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un plombier vérifié à Marrakech",
                'url'   => '/professionnels/marrakech/plomberie',
                'label' => 'Voir les plombiers de Marrakech',
            ],
            'related' => [
                'choisir-plombier-casablanca',
                'jardinage-marrakech',
            ],
        ],

        'carreleur-maroc-guide' => [
            'slug'        => 'carreleur-maroc-guide',
            'title'       => "Trouver un carreleur au Maroc : guide complet 2026",
            'description' => "Guide pour choisir un carreleur qualifié au Maroc : tarifs de pose, types de carrelage, questions clés et erreurs à éviter pour vos travaux de carrelage.",
            'category'    => 'Maçonnerie',
            'city'        => null,
            'readTime'    => 5,
            'date'        => '2026-05-25',
            'intro'       => "Le carrelage est un choix à long terme : une pose mal réalisée se voit immédiatement et dure des décennies. Voici comment choisir un carreleur compétent au Maroc et obtenir un résultat irréprochable.",
            'sections'    => [
                [
                    'title'   => "1. Types de carrelage et utilisations",
                    'content' => "**Carrelage sol :**\n- **Grès cérame** (le plus résistant) : idéal pour les salons, cuisines et extérieurs\n- **Marbre marocain** (beldi) : traditionnel et élégant, entretien délicat\n- **Carreaux de ciment** (zellige moderne) : tendance, bonnes finitions\n- **Grès rustique** : antidérapant, idéal pour les terrasses\n\n**Carrelage mural (faïence) :**\n- **Faïence standard** : cuisine, salle de bain, douche\n- **Zellige artisanal** : spécialité marocaine, style traditionnel\n- **Grand format (80×80, 120×60)** : effet moderne minimaliste\n\n**Conseil** : La taille du carrelage doit être proportionnelle à la pièce. Un grand carrelage dans un couloir étroit agrandit l'espace ; un petit carrelage dans un grand salon le rapetisse.",
                ],
                [
                    'title'   => "2. Tarifs de pose au Maroc (2026)",
                    'content' => "| Type de pose | Prix main-d'œuvre |\n|-------------|-------------------|\n| Carrelage sol standard | 80–150 MAD/m² |\n| Carrelage sol grand format (> 60×60) | 120–200 MAD/m² |\n| Faïence murale standard | 100–180 MAD/m² |\n| Zellige artisanal | 200–400 MAD/m² |\n| Marbre beldi | 150–300 MAD/m² |\n| Depose d'ancien carrelage | 50–100 MAD/m² |\n| Ragréage (préparation du sol) | 30–60 MAD/m² |\n\n*Hors matériaux. Rajoutez 20–30% pour Casablanca et Rabat. Le zellige et le marbre nécessitent des artisans expérimentés → ne lésinez pas sur la qualité.*",
                ],
                [
                    'title'   => "3. Comment évaluer la qualité d'un carreleur",
                    'content' => "**Ce qu'il faut observer :**\n- **Les joints** : réguliers, alignés, sans espace ni écart variable\n- **L'aplomb** : les carreaux sont-ils parfaitement plats ? Testez en posant une règle\n- **Les coupes** : propres, précises, sans ébréchures visibles\n- **Le rendement** : un carreleur expérimenté pose 8–12 m²/jour en sol standard\n\n**Demandez à voir des réalisations :**\n- Visitez un chantier en cours ou récemment terminé\n- Regardez particulièrement les angles et les départs (autour des WC, vasques)\n- Vérifiez les raccords entre deux pièces (couloir → salon)\n\n**Questions clés :**\n- Utilisez-vous un croisillon (pour joints réguliers) ?\n- Faites-vous un calepinage (plan de pose) avant de commencer ?\n- Comment gérez-vous les chutes et pertes de carrelage ?",
                ],
                [
                    'title'   => "4. Ce qu'il faut préparer avant la pose",
                    'content' => "**Préparation du support (essentielle) :**\n- Le sol doit être propre, sec et plan (tolérance : 3 mm sur 2 m)\n- Si l'ancien carrelage est en mauvais état → dépose obligatoire\n- Ragréage si le sol n'est pas plan\n- Imperméabilisation (étanchéité) obligatoire dans les douches et salles de bain\n\n**Avant de commander le carrelage :**\n- Mesurez précisément et ajoutez 10–15% pour les chutes et casses\n- Commandez tout d'un seul lot (les nuances de couleur varient entre lots)\n- Choisissez le format ET la couleur des joints avant la pose\n\n**Ce que doit inclure le devis :**\n- Surface à carreler (m²) précise\n- Type de colle et joint utilisés\n- Préparation du support incluse ou non\n- Traitement des plinthes et finitions",
                ],
                [
                    'title'   => "5. Erreurs fréquentes à éviter",
                    'content' => "**Erreurs des clients :**\n\n❌ **Choisir sur le prix uniquement** — une différence de 20 MAD/m² peut cacher une absence d'étanchéité dans la douche (moisissures dans 2 ans)\n\n❌ **Acheter le carrelage avant le devis** — le carreleur calcule les pertes selon le plan de pose, pas vous\n\n❌ **Imposer un délai trop court** — un carrelage posé à la hâte (sans respecter le temps de séchage de la colle) se décollera\n\n❌ **Négliger l'étanchéité** — dans une douche, l'étanchéité sous le carrelage est obligatoire, pas optionnelle\n\n❌ **Payer 100% à l'avance** — maximum 30–40% d'acompte, solde à la fin\n\n**Conseil final :** Marchandez le prix sur les matériaux plutôt que sur la main-d'œuvre. Une pose de qualité protège votre investissement carrelage pendant 20 ans.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un carreleur vérifié au Maroc",
                'url'   => '/professionals?profession=Carreleur',
                'label' => 'Voir les carreleurs',
            ],
            'related' => [
                'maconnerie-maroc-guide',
                'prix-artisan-maroc-2026',
            ],
        ],

        'peintre-casablanca' => [
            'slug'        => 'peintre-casablanca',
            'title'       => "Peintre à Casablanca : tarifs et conseils 2026",
            'description' => "Comment trouver un peintre fiable à Casablanca : tarifs 2026 par quartier, types de peinture adaptés au climat casablancais et erreurs à éviter.",
            'category'    => 'Peinture',
            'city'        => 'Casablanca',
            'readTime'    => 5,
            'date'        => '2026-05-25',
            'intro'       => "Casablanca, première ville du Maroc, concentre une demande massive en travaux de peinture — appartements à rénover, locaux commerciaux, façades à ravaler. Voici comment trouver le bon peintre dans la métropole.",
            'sections'    => [
                [
                    'title'   => "1. Tarifs des peintres à Casablanca (2026)",
                    'content' => "| Type de travaux | Prix indicatif |\n|----------------|---------------|\n| Peinture murale intérieure (2 couches) | 20–40 MAD/m² |\n| Peinture plafond | 25–45 MAD/m² |\n| Enduit + peinture (3 couches) | 45–80 MAD/m² |\n| Peinture façade extérieure | 35–70 MAD/m² |\n| Local commercial (murs + plafond) | 25–50 MAD/m² |\n| Tadelakt (douche, cuisine) | 150–350 MAD/m² |\n\n*Tarifs plus élevés dans les quartiers Maarif, Gauthier, Anfa et Hay Riad (+15–25%). Médina et Hay Hassani : tarifs courants.*",
                ],
                [
                    'title'   => "2. Spécificités du climat casablancais",
                    'content' => "Casablanca a un climat atlantique humide qui impacte directement le choix de la peinture :\n\n**Façades :**\n- Choisissez obligatoirement une peinture **façade respirante** (classe II minimum)\n- La peinture acrylique standard ne tient pas plus de 3–4 ans face à l'humidité atlantique\n- Vérifiez l'état des fissures avant de peindre (reprendre avec enduit de rebouchage)\n\n**Intérieurs :**\n- Cuisine et salle de bain : peinture **satinée** obligatoire (résistante à l'humidité)\n- Pièces de vie : peinture **mate lavable** recommandée\n- Sous-sol ou caves : peinture **anti-humidité** (traitement préalable si traces)\n\n**Moisissures :**\nCasablanca étant humide, les moisissures sont fréquentes. Si vous en avez, un traitement fongicide doit précéder la peinture — un peintre qui peint par-dessus sans traitement ne règle rien.",
                ],
                [
                    'title'   => "3. Comment choisir son peintre à Casablanca",
                    'content' => "**Vérifications essentielles :**\n- Travaille-t-il dans votre quartier ? (certains refusent la Médina ou les banlieues éloignées)\n- A-t-il de l'expérience avec les façades ou le tadelakt si c'est votre besoin ?\n- Peut-il commencer en semaine (évitez les peintres qui travaillent uniquement le week-end)\n\n**Questions clés :**\n- Quelle marque de peinture utilisez-vous ? (Valentine, Tollens, StoColor — pas de marques génériques inconnues)\n- Le prix comprend-il le lessivage et l'impression ?\n- Protégez-vous les sols et fenêtres ?\n- Combien de jours pour mon appartement de X m² ?\n\n**Red flags :**\n❌ Refuse de préciser la marque de peinture\n❌ Devis verbal seulement\n❌ Prix trop bas (< 15 MAD/m² murs : c'est une couche unique sans préparation)",
                ],
                [
                    'title'   => "4. Rénovation vs. rafraîchissement",
                    'content' => "**Rafraîchissement (1–2 couches sur existant propre) :**\n- Idéal si la peinture est en bon état, juste vieillie\n- 1–2 jours pour un F3\n- Prix : 15–30 MAD/m²\n\n**Rénovation complète (grattage + enduit + peinture) :**\n- Nécessaire si fissures, décollements, taches de nicotine, humidité\n- 3–5 jours pour un F3\n- Prix : 40–80 MAD/m²\n\n**Avant de commander :**\n- Vérifiez l'état exact des murs avec le peintre lors de la visite de devis\n- Ne vous contentez pas d'un devis par téléphone pour les travaux importants\n- Si vous avez un doute sur l'humidité : demandez un diagnostic avant peinture\n\n*Un peintre sérieux refuse de peindre sur une surface non préparée — c'est bon signe.*",
                ],
                [
                    'title'   => "5. Travaux en logement occupé vs. vide",
                    'content' => "**Logement vide (idéal) :**\n- Pas de protection de meubles → travail plus rapide et plus propre\n- Peintre peut travailler en toute pièce sans contrainte\n- Prix identique mais résultat souvent meilleur\n\n**Logement occupé :**\n- Protection obligatoire de tous les meubles et sols\n- Travail pièce par pièce (délai plus long)\n- Ventilez bien pendant et après (24–48h pour séchage complet)\n- Évitez les enfants en bas âge pendant les travaux (vapeurs de solvants)\n\n**Conseils pratiques à Casablanca :**\n- Évitez de peindre pendant les mois de forte humidité (décembre–mars) si possible\n- Si vous avez un balcon donnant sur rue : la façade est sous responsabilité du syndic, pas la vôtre\n- Préparez votre appartement (déménager ce que vous pouvez) pour gagner du temps et de l'argent\n\n*Jobly vous permet de comparer 2–3 peintres à Casablanca et de lire leurs avis avant de choisir.*",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un peintre vérifié à Casablanca",
                'url'   => '/professionnels/casablanca/peinture',
                'label' => 'Voir les peintres de Casablanca',
            ],
            'related' => [
                'peintre-maroc-guide',
                'peintre-casablanca',
            ],
        ],

        'climatiseur-casablanca' => [
            'slug'        => 'climatiseur-casablanca',
            'title'       => "Climatiseur à Casablanca : installation et réparation 2026",
            'description' => "Tout savoir sur l'installation et la réparation de climatiseurs à Casablanca : marques, tarifs, entretien annuel et techniciens vérifiés.",
            'category'    => 'Climatisation',
            'city'        => 'Casablanca',
            'readTime'    => 6,
            'date'        => '2026-05-20',
            'sections'    => [
                [
                    'title'   => "1. Quel climatiseur choisir à Casablanca",
                    'content' => "**Les marques fiables sur le marché marocain :**\n- Gree, Midea, Samsung, LG, Daikin (haut de gamme)\n- Modèle Inverter : économise 30–40% d'énergie vs. non-inverter\n\n**Capacités recommandées :**\n- Chambre (15–20 m²) : 9 000 BTU\n- Salon (25–35 m²) : 12 000–18 000 BTU\n- Plateau ou open space : 24 000 BTU minimum\n\nÀ Casablanca, le climat atlantique humide rend la climatisation réversible (chaud/froid) particulièrement intéressante.",
                ],
                [
                    'title'   => "2. Tarifs d'installation à Casablanca en 2026",
                    'content' => "**Prix d'installation standard (matériel non inclus) :**\n- Split 9 000 BTU : 800–1 200 MAD\n- Split 12 000–18 000 BTU : 1 000–1 500 MAD\n- Cassette de plafond : 2 000–3 500 MAD\n- Gainable : 4 000–8 000 MAD\n\n**Inclus dans l'installation :** pose des unités, liaison frigorifique, mise en service, percée des murs.\n\n**Non inclus :** câblage électrique dédié (300–500 MAD en plus si absent).",
                ],
                [
                    'title'   => "3. Entretien annuel : pourquoi et combien",
                    'content' => "Un climatiseur non entretenu perd 20–30% d'efficacité par an.\n\n**Entretien annuel basique :**\n- Nettoyage des filtres (tous les 3 mois par l'utilisateur)\n- Nettoyage complet (serpentin, bac, ventilateur) : 300–500 MAD\n- Vérification du niveau de gaz : 200–400 MAD si recharge\n\n**Signes d'urgence :**\n- Eau qui coule à l'intérieur (bouchon de condensats)\n- Bruit inhabituel (palier moteur ou manque de gaz)\n- L'appareil ne refroidit plus (fuite de gaz probable)",
                ],
                [
                    'title'   => "4. Réparations fréquentes et leurs coûts",
                    'content' => "**Pannes fréquentes à Casablanca :**\n\n| Panne | Coût approximatif |\n|-------|------------------|\n| Recharge gaz R32 | 400–700 MAD |\n| Carte électronique | 800–1 500 MAD |\n| Moteur ventilateur | 500–900 MAD |\n| Bac condensats bouché | 200–400 MAD |\n| Télécommande de remplacement | 100–300 MAD |\n\nSi la réparation dépasse 60% du prix d'un appareil neuf : envisagez le remplacement.",
                ],
                [
                    'title'   => "5. Comment choisir un bon technicien climatiseur",
                    'content' => "**À vérifier avant de confier votre appareil :**\n- Intervient-il dans votre quartier de Casablanca ?\n- Utilise-t-il des pièces d'origine ?\n- Propose-t-il une garantie sur l'intervention ?\n\n**Red flags :**\n❌ Prix d'installation < 700 MAD tout inclus\n❌ Refus de devis écrit pour une réparation\n❌ Ne teste pas l'appareil après intervention\n\nSur Jobly, les techniciens en climatisation sont vérifiés et notés par leurs clients.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un technicien climatiseur à Casablanca",
                'url'   => '/professionnels/casablanca/climatisation',
                'label' => 'Voir les techniciens climatiseur',
            ],
            'related' => [
                'climatisation-maroc-guide',
                'choisir-electricien-maroc',
            ],
        ],

        'electricien-rabat-guide' => [
            'slug'        => 'electricien-rabat-guide',
            'title'       => "Électricien à Rabat : tarifs et conseils 2026",
            'description' => "Guide complet pour trouver un électricien fiable à Rabat : tarifs des interventions, normes électriques marocaines, et artisans vérifiés.",
            'category'    => 'Électricité',
            'city'        => 'Rabat',
            'readTime'    => 5,
            'date'        => '2026-05-21',
            'sections'    => [
                [
                    'title'   => "1. Tarifs des électriciens à Rabat en 2026",
                    'content' => "**Interventions courantes :**\n\n| Prestation | Tarif indicatif |\n|-----------|----------------|\n| Déplacement + diagnostic | 150–250 MAD |\n| Remplacement prise/interrupteur | 100–200 MAD |\n| Installation tableau électrique | 1 500–4 000 MAD |\n| Mise aux normes appartement | 3 000–8 000 MAD |\n| Pose luminaire/plafonnier | 150–300 MAD |\n| Installation chauffe-eau électrique | 300–600 MAD |\n\nCes tarifs s'entendent main d'œuvre uniquement pour Rabat intra-muros.",
                ],
                [
                    'title'   => "2. Normes électriques à respecter au Maroc",
                    'content' => "**Les normes marocaines (NM 07.5.110) exigent :**\n- Prise de terre obligatoire dans les pièces humides (cuisine, salle de bain)\n- Disjoncteur différentiel 30mA sur les circuits salle de bain et cuisine\n- Section des fils adaptée à la puissance : 1,5 mm² éclairage, 2,5 mm² prises, 6 mm² four/chauffe-eau\n\n**Un appartement non mis aux normes risque :**\n- Refus de l'assurance en cas d'incendie d'origine électrique\n- Risque d'électrocution (surtout pour les enfants)\n- Compteur ONEE refusé lors d'une location ou vente",
                ],
                [
                    'title'   => "3. Problèmes électriques fréquents à Rabat",
                    'content' => "**Les pannes les plus courantes :**\n- Disjoncteur qui saute : surcharge de circuit ou court-circuit (ne réarmez pas sans diagnostic)\n- Prises sans terre dans les anciennes médinas et appartements des années 70–80\n- Câblage vieillissant dans les immeubles de l'époque coloniale (agdal, Hassan, Océan)\n- Problèmes d'humidité dans les sous-sols (caves, parking souterrain)\n\n**À Rabat, les vieux appartements du Quartier des Ministères** nécessitent souvent une mise aux normes complète — prévoir entre 5 000 et 12 000 MAD.",
                ],
                [
                    'title'   => "4. Questions à poser avant de recruter un électricien",
                    'content' => "**Avant de signer un devis :**\n- Le devis distingue-t-il bien la main d'œuvre du matériel ?\n- L'électricien travaille-t-il seul ou avec un apprenti ?\n- Peut-il fournir une attestation de conformité après travaux ?\n- A-t-il de l'expérience sur le type de travaux concerné (neuf vs. rénovation) ?\n\n**Ce que doit inclure un devis sérieux :**\n- Descriptif précis des travaux\n- Références du matériel utilisé (marque, section)\n- Délai d'intervention estimé\n- Conditions de paiement (jamais 100% en avance)",
                ],
                [
                    'title'   => "5. Urgence électrique à Rabat : que faire",
                    'content' => "**En cas de panne électrique totale :**\n1. Vérifiez le tableau de distribution (disjoncteur principal sauté ?)\n2. Vérifiez si vos voisins sont également touchés (problème ONEE ?)\n3. Appelez un électricien d'urgence si le problème vient de votre installation\n\n**En cas de court-circuit avec odeur de brûlé :**\n- Coupez le disjoncteur général immédiatement\n- N'utilisez aucun appareil avant l'intervention d'un électricien\n\nSur Jobly, filtrez les électriciens **Disponibles maintenant** à Rabat pour une intervention rapide.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un électricien à Rabat",
                'url'   => '/professionnels/rabat/electricite',
                'label' => 'Voir les électriciens de Rabat',
            ],
            'related' => [
                'choisir-electricien-maroc',
                'plombier-rabat-guide',
            ],
        ],

        'peintre-marrakech' => [
            'slug'        => 'peintre-marrakech',
            'title'       => "Peintre à Marrakech : trouver le meilleur en 2026",
            'description' => "Guide pour choisir un peintre à Marrakech : tarifs, tadelakt, enduits décoratifs, spécificités du climat chaud et artisans vérifiés.",
            'category'    => 'Peinture',
            'city'        => 'Marrakech',
            'readTime'    => 6,
            'date'        => '2026-05-21',
            'sections'    => [
                [
                    'title'   => "1. Prix des peintres à Marrakech en 2026",
                    'content' => "**Tarifs indicatifs à Marrakech :**\n\n| Type de travaux | Prix au m² |\n|----------------|------------|\n| Peinture intérieure (2 couches) | 20–40 MAD |\n| Peinture façade extérieure | 35–60 MAD |\n| Tadelakt (enduit décoratif) | 150–350 MAD |\n| Béton ciré | 120–250 MAD |\n| Chaux aérienne traditionnelle | 60–120 MAD |\n\nLes artisans de Marrakech sont souvent spécialisés dans les finitions traditionnelles (tadelakt, zellij enduit), ce qui justifie des tarifs plus élevés que la moyenne nationale.",
                ],
                [
                    'title'   => "2. Spécificités du climat de Marrakech pour la peinture",
                    'content' => "Marrakech a un climat semi-aride chaud avec des étés très secs (jusqu'à 45°C). Cela impacte directement les choix de peinture :\n\n**Façades :**\n- Peinture **siliconate** ou **minérale** recommandée (résiste aux UV mieux que l'acrylique)\n- Évitez les couleurs foncées sur façades exposées au sud/ouest (absorption de chaleur)\n- La chaux traditionnelle reste un excellent choix pour les riads (respire, thermo-régule)\n\n**Intérieurs :**\n- En été, les appartements s'échauffent vite : peinture réfléchissante ou couleurs claires recommandées\n- Salle de bain : tadelakt marocain traditionnel est imperméable et décoratif",
                ],
                [
                    'title'   => "3. Tadelakt et enduits décoratifs : ce qu'il faut savoir",
                    'content' => "Le tadelakt est une technique marrakchie traditionnelle. Voici ce qu'il faut savoir avant de commander :\n\n**Ce que c'est :**\n- Enduit à base de chaux savonnée, poli à la pierre\n- Imperméable naturellement — parfait pour les salles de bain et hammams\n- Dure 20–30 ans si bien posé\n\n**Ce que ça coûte :**\n- 150 à 350 MAD/m² selon complexité et artisan\n- Compter 3–5 couches d'application sur 3–5 jours de séchage\n\n**Attention :**\n- Réparation difficile en cas de choc ou fissure\n- Nécessite un artisan vraiment expérimenté — vérifiez des photos de réalisations avant de commander",
                ],
                [
                    'title'   => "4. Peinture pour riads et maisons traditionnelles",
                    'content' => "**Les riads ont des contraintes spécifiques :**\n- Murs en pisé (terre comprimée) : incompatibles avec la peinture plastique — utilisez la chaux uniquement\n- Boiseries (portes, moucharabieh, zouak) : peinture glycéro spéciale bois, jamais acrylique\n- Enduits à la chaux : ne s'associent qu'avec d'autres produits chaux\n\n**Peintre polyvalent vs. peintre maâlem :**\nPour un riad traditionnel, préférez un *maâlem* (maître-artisan) spécialisé en finitions marocaines plutôt qu'un peintre généraliste. La différence de qualité est majeure.",
                ],
                [
                    'title'   => "5. Comment trouver un bon peintre à Marrakech",
                    'content' => "**Questions clés avant de recruter :**\n- A-t-il de l'expérience avec le tadelakt ou la chaux ?\n- Peut-il vous montrer des photos de réalisations similaires ?\n- Travaille-t-il dans votre quartier ? (Guéliz, Médina, Palmeraie ont des dynamiques différentes)\n- Le prix inclut-il la préparation des supports ?\n\n**Red flags :**\n❌ Peintre qui propose d'appliquer de la peinture acrylique sur des murs en pisé\n❌ Devis au téléphone sans visite du chantier\n❌ Prix trop bas pour du tadelakt (< 100 MAD/m² : mauvaise qualité garantie)",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un peintre à Marrakech",
                'url'   => '/professionnels/marrakech/peinture',
                'label' => 'Voir les peintres de Marrakech',
            ],
            'related' => [
                'peintre-maroc-guide',
                'jardinage-marrakech',
            ],
        ],

        'demenagement-rabat' => [
            'slug'        => 'demenagement-rabat',
            'title'       => "Déménagement à Rabat : guide et prix 2026",
            'description' => "Guide complet pour déménager à Rabat ou depuis Rabat : prix des déménageurs, astuces d'organisation, ce qu'il faut vérifier avant de signer.",
            'category'    => 'Déménagement',
            'city'        => 'Rabat',
            'readTime'    => 6,
            'date'        => '2026-05-22',
            'sections'    => [
                [
                    'title'   => "1. Tarifs des déménageurs à Rabat en 2026",
                    'content' => "**Prix indicatifs selon la taille du logement :**\n\n| Logement | Déménagement local (Rabat) | Rabat → Casablanca |\n|----------|--------------------------|--------------------|\n| Studio | 800–1 500 MAD | 1 500–2 500 MAD |\n| F2 (2 pièces) | 1 200–2 200 MAD | 2 000–3 500 MAD |\n| F3 (3 pièces) | 1 800–3 500 MAD | 3 000–5 000 MAD |\n| F4 et + | 2 500–5 000 MAD | 4 000–7 000 MAD |\n\nCes prix incluent généralement la main d'œuvre et le camion. L'emballage est souvent en supplément (150–400 MAD).",
                ],
                [
                    'title'   => "2. Spécificités des déménagements à Rabat",
                    'content' => "**Quartiers avec contraintes particulières :**\n- **Médina et Kasbah des Oudayas** : rues étroites, camions de plus de 3,5T impossibles → prévoir véhicule léger + allers-retours\n- **Hassan, Agdal, Hay Riad** : stationnement limité le matin — arrivez tôt ou obtenez une autorisation provisoire\n- **Salé et Bettana** : prévoir le coût du franchissement du pont ou de la navette\n\n**Horaires recommandés :**\n- Évitez 7h30–9h00 et 17h00–19h00 (embouteillages entre Rabat et Salé)\n- Le vendredi matin est généralement plus fluide",
                ],
                [
                    'title'   => "3. Comment comparer les devis de déménageurs",
                    'content' => "**Un bon devis de déménagement doit préciser :**\n- Nombre de déménageurs (minimum 2 pour un F3)\n- Capacité du camion en m³\n- Couverture en cas de casse (assurance ou non ?)\n- Prix de l'emballage si demandé\n- Délai de livraison si garde-meuble nécessaire\n\n**Méfiez-vous des devis trop bas :**\nUn déménagement à 600 MAD pour un F3 signifie souvent 1 seul déménageur inexpérimenté, pas d'assurance, et des allers-retours interminables.\n\nDemandez toujours une confirmation écrite du prix total avant le jour J.",
                ],
                [
                    'title'   => "4. Organisation d'un déménagement réussi",
                    'content' => "**J-30 avant le déménagement :**\n- Obtenez 3 devis comparatifs\n- Commandez vos cartons (20–40 selon logement)\n- Déclarez le changement d'adresse à la poste\n\n**J-7 :**\n- Commencez par les affaires peu utilisées (livres, décoration)\n- Étiquetez chaque carton (pièce de destination + contenu fragile)\n\n**Jour J :**\n- Faites un état des lieux de l'ancien logement avant le départ\n- Vérifiez que rien n'est oublié dans les placards hauts et la cave\n- Comptez vos cartons à l'arrivée\n\n**J+7 :**\n- Vérifiez l'état du mobilier — signalez toute casse dans les 48h",
                ],
                [
                    'title'   => "5. Choisir un déménageur fiable à Rabat",
                    'content' => "**Vérifications essentielles :**\n- L'entreprise est-elle déclarée ? (évitez les particuliers sans référence)\n- Propose-t-elle une assurance casse ? (même partielle)\n- A-t-elle des avis clients vérifiés ?\n\n**Pour les déménagements vers l'étranger :**\n- Prévoyez 3–4 semaines de délai\n- Demandez une liste de colisage pour la douane\n- Renseignez-vous sur les droits de douane du pays de destination\n\nSur Jobly, les déménageurs à Rabat sont évalués par des clients réels — comparez leurs notes avant de choisir.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un déménageur à Rabat",
                'url'   => '/professionnels/rabat/demenagement',
                'label' => 'Voir les déménageurs de Rabat',
            ],
            'related' => [
                'demenagement-casablanca',
                'plombier-rabat-guide',
            ],
        ],

        'jardinier-casablanca' => [
            'slug'        => 'jardinier-casablanca',
            'title'       => "Jardinier à Casablanca : entretien jardin 2026",
            'description' => "Trouver un jardinier à Casablanca : tarifs d'entretien, travaux de création, arrosage automatique et jardins méditerranéens adaptés au climat atlantic.",
            'category'    => 'Jardinage',
            'city'        => 'Casablanca',
            'readTime'    => 5,
            'date'        => '2026-05-22',
            'sections'    => [
                [
                    'title'   => "1. Prix des jardiniers à Casablanca en 2026",
                    'content' => "**Tarifs d'entretien régulier :**\n\n| Prestation | Tarif indicatif |\n|-----------|----------------|\n| Tonte pelouse (forfait visite) | 150–300 MAD |\n| Taille haies et arbustes | 200–500 MAD |\n| Entretien mensuel (petit jardin) | 400–800 MAD/mois |\n| Entretien mensuel (grand jardin) | 800–2 000 MAD/mois |\n| Création gazon (semis ou plaquage) | 40–80 MAD/m² |\n| Pose système d'arrosage automatique | 1 500–5 000 MAD |\n\nLes prix varient selon la surface, la complexité et le quartier (Anfa, Ain Diab, Bouskoura ont des jardins plus grands).",
                ],
                [
                    'title'   => "2. Plantes adaptées au climat de Casablanca",
                    'content' => "Le climat atlantique de Casablanca est doux (11–25°C) avec peu de gel et une pluviométrie modérée. Des plantes idéales :\n\n**Arbustes et haies :**\n- Bougainvillée (résistante, fleurit en été)\n- Oleander (laurier-rose) — attention, toxique pour les enfants\n- Pittosporum et photinia (haies structurées)\n- Jasmin (parfumé, rapide)\n\n**Gazon :**\n- Ray-grass anglais (résiste à la chaleur modérée)\n- Bermuda (résiste à la sécheresse estivale, moins vert en hiver)\n- Kikuyu (croissance rapide, demande peu d'eau)\n\n**Potager :**\n- Tomates, poivrons, courgettes en été\n- Carottes, choux, laitues d'octobre à mai",
                ],
                [
                    'title'   => "3. Entretien saisonnier du jardin casablancais",
                    'content' => "**Printemps (mars–mai) :**\n- Taille de forme des arbustes avant la pousse\n- Semis de gazon ou remplacement des zones mortes\n- Installation ou vérification de l'arrosage automatique\n\n**Été (juin–septembre) :**\n- Arrosage intensifié (tôt le matin ou le soir)\n- Tonte fréquente (toutes les 2–3 semaines)\n- Paillage pour conserver l'humidité du sol\n\n**Automne (octobre–novembre) :**\n- Plantation d'arbustes et arbres (bonne saison pour le sol)\n- Taille des rosiers et fruitiers\n\n**Hiver (décembre–février) :**\n- Réduction de l'arrosage\n- Protection des plantes sensibles au froid (rares gels à Casa, mais ça arrive)",
                ],
                [
                    'title'   => "4. Arrosage automatique : vaut-il l'investissement ?",
                    'content' => "À Casablanca, l'été sec et chaud justifie pleinement l'arrosage automatique pour un jardin de plus de 50 m².\n\n**Avantages :**\n- Économie d'eau de 30–50% (arrosage précis aux racines)\n- Jardin entretenu même pendant les vacances d'été\n- Gain de temps considérable\n\n**Coûts d'installation :**\n- Petit jardin (50–100 m²) : 1 500–3 000 MAD\n- Jardin moyen (100–300 m²) : 3 000–7 000 MAD\n- Grand jardin avec multiple zones : 7 000–15 000 MAD\n\n**Retour sur investissement :** environ 2–3 saisons avec l'économie d'eau et du temps de jardinage.",
                ],
                [
                    'title'   => "5. Choisir un bon jardinier à Casablanca",
                    'content' => "**Questions clés avant de recruter :**\n- Intervient-il régulièrement dans votre quartier ?\n- A-t-il de l'expérience avec les pelouses en climat atlantique ?\n- Apporte-t-il son propre matériel (tondeuse, taille-haie) ?\n- Peut-il proposer un contrat d'entretien mensuel avec planning ?\n\n**Red flags :**\n❌ Jardinier qui arrose en plein midi (évaporation immédiate)\n❌ Taille agressive des arbres fruitiers en dehors de la saison correcte\n❌ Pas de connaissance des espèces locales marocaines\n\nSur Jobly, les jardiniers à Casablanca sont vérifiés et notés. Comparez leurs profils avant de choisir.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un jardinier à Casablanca",
                'url'   => '/professionnels/casablanca/jardinage',
                'label' => 'Voir les jardiniers de Casablanca',
            ],
            'related' => [
                'jardinage-marrakech',
                'femme-de-menage-casablanca',
            ],
        ],

        'menuisier-casablanca' => [
            'slug'        => 'menuisier-casablanca',
            'title'       => "Menuisier à Casablanca : bois, aluminium, PVC 2026",
            'description' => "Guide pour trouver un menuisier à Casablanca : tarifs des portes et fenêtres, comparatif bois vs aluminium vs PVC, et artisans vérifiés.",
            'category'    => 'Menuiserie',
            'city'        => 'Casablanca',
            'readTime'    => 6,
            'date'        => '2026-05-23',
            'sections'    => [
                [
                    'title'   => "1. Tarifs des menuisiers à Casablanca en 2026",
                    'content' => "**Prix indicatifs :**\n\n| Prestation | Tarif indicatif |\n|-----------|----------------|\n| Porte intérieure bois (pose) | 300–600 MAD |\n| Fenêtre aluminium (fourniture + pose) | 1 500–4 000 MAD |\n| Porte d'entrée blindée (fourniture + pose) | 3 000–8 000 MAD |\n| Placard sur mesure (par ml) | 800–2 500 MAD/ml |\n| Parquet stratifié (pose seule) | 40–80 MAD/m² |\n| Vérandas et pergolas alu | 5 000–20 000 MAD |\n\nCes prix varient selon la marque des matériaux et la complexité de la pose.",
                ],
                [
                    'title'   => "2. Bois, aluminium ou PVC : quel choix pour Casablanca ?",
                    'content' => "**Aluminium (recommandé pour Casablanca) :**\n- Résiste à l'humidité atlantique (pas de gonflement ni de pourriture)\n- Excellent pour les façades (double vitrage, isolation thermique)\n- Durée de vie 30–50 ans\n- Entretien quasi nul\n- Prix moyen à élevé\n\n**PVC :**\n- Bon isolant thermique et phonique\n- Moins cher que l'aluminium\n- Moins résistant aux impacts (façades exposées)\n- Durée de vie 20–30 ans\n\n**Bois :**\n- Esthétique chaleureux, idéal pour les intérieurs\n- À Casablanca : nécessite traitement antifongique régulier (humidité atlantique)\n- Coût d'entretien plus élevé que l'alu ou le PVC\n- Parfait pour les meubles sur mesure et escaliers",
                ],
                [
                    'title'   => "3. Fenêtres et portes : double vitrage ou simple ?",
                    'content' => "**À Casablanca, le double vitrage est recommandé pour :**\n- Les appartements donnant sur des rues passantes (isolation phonique)\n- Les façades exposées à l'ouest ou au nord (isolation thermique en hiver)\n- Les logements en altitude (Ain Diab, Californie) où le vent atlantique est fort\n\n**Le double vitrage vaut-il l'investissement ?**\n- Surcoût : +300–800 MAD par fenêtre vs. simple vitrage\n- Économie sur la climatisation et le chauffage : 15–25%\n- Retour sur investissement : 3–5 ans pour les appartements bien exposés\n\n**Simple vitrage suffisant pour :**\n- Fenêtres intérieures (donnant sur patio ou couloir)\n- Zones peu exposées au bruit et au vent",
                ],
                [
                    'title'   => "4. Placards et rangements sur mesure",
                    'content' => "**Les meubles sur mesure à Casablanca :**\nUn menuisier casablancais peut réaliser vos placards, cuisines et dressings sur mesure à des prix souvent inférieurs aux grandes enseignes.\n\n**Délais typiques :**\n- Placard simple (1 semaine de fabrication)\n- Cuisine complète (2–4 semaines)\n- Dressing complexe avec miroirs (2–3 semaines)\n\n**Matériaux courants :**\n- MDF mélaminé (économique, bon rendu)\n- Contreplaqué bois (plus solide, plus cher)\n- Bois massif (haut de gamme, sur demande)\n\n**Garantie :** Un bon menuisier garantit sa fabrication 1–2 ans — demandez-le par écrit.",
                ],
                [
                    'title'   => "5. Comment choisir son menuisier à Casablanca",
                    'content' => "**Vérifications essentielles :**\n- A-t-il de l'expérience avec le matériau de votre choix (alu, bois, PVC) ?\n- Peut-il fournir des photos de réalisations récentes ?\n- Le devis inclut-il la fourniture ET la pose ?\n- Propose-t-il une garantie après installation ?\n\n**Red flags :**\n❌ Menuisier qui ne prend pas de mesures précises sur place\n❌ Devis sans détail des matériaux utilisés\n❌ Prix trop bas pour de l'aluminium (risque de profilés de mauvaise qualité)\n\nSur Jobly, comparez les menuisiers de Casablanca avec leurs notes et avis clients avant de choisir.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un menuisier à Casablanca",
                'url'   => '/professionnels/casablanca/menuiserie',
                'label' => 'Voir les menuisiers de Casablanca',
            ],
            'related' => [
                'menuiserie-bois-maroc',
                'carreleur-maroc-guide',
            ],
        ],

        'plombier-fes-guide' => [
            'slug'        => 'plombier-fes-guide',
            'title'       => "Plombier à Fès : tarifs et conseils 2026",
            'description' => "Trouvez un plombier fiable à Fès : prix des interventions, conseils pour éviter les arnaques et artisans vérifiés disponibles rapidement.",
            'category'    => 'Plomberie',
            'city'        => 'Fès',
            'readTime'    => 5,
            'date'        => '2026-05-26',
            'sections'    => [
                [
                    'title'   => "1. Prix d'un plombier à Fès en 2026",
                    'content' => "Les tarifs des plombiers à Fès sont légèrement inférieurs à ceux de Casablanca :\n\n- **Fuite robinet** : 120–250 MAD\n- **Débouchage WC** : 180–400 MAD\n- **Remplacement chauffe-eau** : 350–700 MAD (hors matériel)\n- **Détection de fuite cachée** : 300–600 MAD\n- **Installation salle de bain complète** : 1 500–4 000 MAD\n\nUne majorité des plombiers de Fès travaille en zone médina et en périphérie (Saïss, Route d'Imouzzer).",
                ],
                [
                    'title'   => "2. Spécificités des canalisations à Fès",
                    'content' => "La médina de Fès possède un réseau de canalisations ancien, parfois centenaire. Les interventions en médina sont souvent plus complexes :\n\n- Tuyaux en plomb ou en fonte dans les anciennes constructions\n- Accès difficile pour le matériel professionnel (ruelles étroites)\n- Canalisations partagées entre plusieurs propriétés (riads mitoyens)\n\n**Conseil :** pour les riads et demeures historiques, choisissez un plombier ayant une expérience en médina — c'est une spécialité. Demandez-lui s'il a déjà travaillé dans la médina.",
                ],
                [
                    'title'   => "3. Urgences plomberie à Fès",
                    'content' => "En cas de fuite importante ou d'inondation :\n\n1. **Coupez l'eau** au robinet principal (souvent dans le hall ou à l'entrée du logement)\n2. **Appelez un plombier d'urgence** — sur Jobly, filtrez par « Disponible maintenant » pour trouver un artisan réactif\n3. **Photographiez les dégâts** avant toute intervention (pour votre assurance)\n\n**Délai moyen d'intervention à Fès :** 30–90 minutes pour les quartiers principaux (Ville Nouvelle, Agdal, Narjis), plus long pour la médina en heure de pointe.",
                ],
                [
                    'title'   => "4. Questions à poser avant de choisir",
                    'content' => "Avant de confier votre installation à un plombier à Fès, posez ces questions :\n\n- Travaillez-vous en médina ? (si applicable)\n- Le devis inclut-il les pièces de rechange ?\n- Proposez-vous une garantie après intervention ?\n- Avez-vous une assurance responsabilité civile professionnelle ?\n\nUn artisan qui hésite à répondre à ces questions mérite d'être remplacé par un concurrent.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un plombier à Fès",
                'url'   => '/professionnels/fes/plomberie',
                'label' => 'Voir les plombiers de Fès',
            ],
            'related' => [
                'choisir-plombier-casablanca',
                'plombier-marrakech',
            ],
        ],

        'femme-menage-casablanca-guide' => [
            'slug'        => 'femme-menage-casablanca-guide',
            'title'       => "Femme de ménage à Casablanca : tarifs et conseils 2026",
            'description' => "Comment trouver une aide ménagère fiable à Casablanca : prix à l'heure, à la journée, ou au mois, ce qu'il faut vérifier et les meilleures pratiques.",
            'category'    => 'Ménage',
            'city'        => 'Casablanca',
            'readTime'    => 5,
            'date'        => '2026-05-26',
            'sections'    => [
                [
                    'title'   => "1. Tarifs d'une femme de ménage à Casablanca",
                    'content' => "Les prix varient selon la formule choisie :\n\n| Formule | Tarif moyen |\n|---------|------------|\n| À l'heure (ponctuel) | 80–150 MAD/h |\n| Journée complète (8h) | 250–450 MAD |\n| Passage hebdomadaire | 300–500 MAD/passage |\n| Aide mensuelle (4×/mois) | 1 000–1 800 MAD |\n| Femme de ménage à temps plein | 2 500–4 000 MAD/mois |\n\n*Note :* les quartiers haut de gamme (Anfa, CIL, Palmier) pratiquent généralement des tarifs supérieurs de 15–25%.",
                ],
                [
                    'title'   => "2. Ponctuelle ou régulière : quelle formule choisir ?",
                    'content' => "**Intervention ponctuelle :** idéale pour un grand ménage de printemps, après une fête ou avant un déménagement. Comptez 4–8 heures pour un appartement de taille standard (80–100 m²).\n\n**Aide régulière :** recommandée si vous avez des enfants ou un rythme de travail chargé. Une aide hebdomadaire de 3–4 heures maintient le logement propre sans accumulation.\n\n**Temps plein :** pour les familles nombreuses ou les villas (200 m² et plus). La femme de ménage peut également s'occuper de la cuisine et du linge.",
                ],
                [
                    'title'   => "3. Ce qu'il faut vérifier avant l'embauche",
                    'content' => "**Vérifications essentielles :**\n- A-t-elle des références vérifiables (anciens employeurs) ?\n- Est-elle ponctuelle et autonome dans son travail ?\n- Apporte-t-elle ses propres produits ou faut-il les fournir ?\n\n**Questions pratiques :**\n- Avez-vous des allergies aux produits d'entretien ?\n- Pouvez-vous gérer les escaliers / terrasse / jardin ?\n- Êtes-vous disponible le week-end ?\n\nSur Jobly, les aides ménagères ont un profil vérifié avec notes et commentaires de clients précédents.",
                ],
                [
                    'title'   => "4. Formalités : déclarée ou non ?",
                    'content' => "Au Maroc, une femme de ménage travaillant régulièrement dans un foyer doit idéalement être déclarée à la CNSS (Caisse Nationale de Sécurité Sociale). En pratique :\n\n- La déclaration CNSS coûte environ 15% du salaire brut (part employeur)\n- Elle protège la travailleuse (accidents de travail, retraite)\n- Elle vous protège en cas de litige\n\nPour les interventions ponctuelles (moins de 3 fois par mois), la déclaration est moins fréquente mais reste recommandée.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver une aide ménagère à Casablanca",
                'url'   => '/professionnels/casablanca/menage',
                'label' => 'Voir les aides ménagères',
            ],
            'related' => [
                'femme-de-menage-casablanca',
                'femme-menage-rabat',
            ],
        ],

        'electricien-marrakech-guide' => [
            'slug'        => 'electricien-marrakech-guide',
            'title'       => "Électricien à Marrakech : tarifs et conseils 2026",
            'description' => "Trouver un électricien à Marrakech : prix des interventions électriques, réglementation, et artisans vérifiés disponibles rapidement dans l'Ochre City.",
            'category'    => 'Électricité',
            'city'        => 'Marrakech',
            'readTime'    => 5,
            'date'        => '2026-05-26',
            'sections'    => [
                [
                    'title'   => "1. Tarifs des électriciens à Marrakech en 2026",
                    'content' => "Les tarifs à Marrakech sont comparables à ceux de Casablanca, avec quelques nuances selon le quartier :\n\n- **Dépannage simple (prise, interrupteur)** : 120–280 MAD\n- **Remplacement tableau électrique** : 800–2 500 MAD\n- **Installation climatisation (câblage)** : 400–900 MAD\n- **Mise aux normes appartement** : 1 500–4 000 MAD\n- **Installation panneau solaire (câblage)** : 1 000–3 000 MAD\n\nLes zones touristiques (Guéliz, Hivernage, Palmeraie) ont tendance à pratiquer des tarifs supérieurs de 20–30%.",
                ],
                [
                    'title'   => "2. Spécificités électriques à Marrakech",
                    'content' => "Marrakech présente des défis électriques particuliers liés à son climat :\n\n**Chaleur extrême (40–48°C en été) :**\n- Surcharge des circuits due aux climatiseurs\n- Câbles qui vieillissent plus vite (chaleur accélère la dégradation des isolants)\n- Risque accru de courts-circuits en été\n\n**Médina :**\n- Installations souvent vieilles de 30–50 ans\n- Câblages en aluminium (vs cuivre dans les constructions modernes)\n- Travaux plus complexes et longs qu'en Ville Nouvelle\n\n**Recommandation :** faites réviser votre installation électrique tous les 5 ans si votre logement a plus de 20 ans.",
                ],
                [
                    'title'   => "3. Climatisation et électricité à Marrakech",
                    'content' => "L'installation d'une climatisation à Marrakech nécessite un électricien qualifié pour :\n\n1. **Vérifier la capacité du tableau électrique** (un split 12 000 BTU consomme 1 200–1 500W)\n2. **Créer un circuit dédié** (câble 2,5 mm² minimum)\n3. **Poser un disjoncteur différentiel** pour la protection\n4. **Respecter la distance extérieur/intérieur** pour l'unité extérieure\n\nNe jamais brancher un climatiseur sur une simple prise murale existante — risque de surchauffe et d'incendie.\n\n**Prix installation électrique clim :** 400–900 MAD selon la puissance et la longueur des câbles.",
                ],
                [
                    'title'   => "4. Comment choisir son électricien à Marrakech",
                    'content' => "**Signes d'un bon électricien :**\n✅ Utilise un multimètre pour tester l'installation avant et après\n✅ Explique clairement ce qu'il fait et pourquoi\n✅ Remet un bon d'intervention avec les travaux effectués\n✅ Dispose d'une assurance responsabilité civile professionnelle\n\n**Red flags :**\n❌ Travaille sans coupe-circuit\n❌ Ne mesure pas les câbles (taille à la volée)\n❌ Refuse de faire un test final\n❌ Devis verbal uniquement",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un électricien à Marrakech",
                'url'   => '/professionnels/marrakech/electricite',
                'label' => 'Voir les électriciens de Marrakech',
            ],
            'related' => [
                'electricien-casablanca',
                'electricien-rabat-guide',
            ],
        ],

        'carreleur-casablanca-guide' => [
            'slug'        => 'carreleur-casablanca-guide',
            'title'       => "Carreleur à Casablanca : tarifs pose et conseils 2026",
            'description' => "Tout sur la pose de carrelage à Casablanca : prix au m², types de carreaux, durée des travaux et comment choisir un carreleur fiable.",
            'category'    => 'Carrelage',
            'city'        => 'Casablanca',
            'readTime'    => 5,
            'date'        => '2026-05-26',
            'sections'    => [
                [
                    'title'   => "1. Prix de la pose de carrelage à Casablanca",
                    'content' => "Les tarifs varient selon le type de pose et la surface :\n\n| Type de pose | Prix main-d'œuvre |\n|-------------|------------------|\n| Carrelage sol standard (< 60×60 cm) | 80–130 MAD/m² |\n| Grand format (> 60×60 cm) | 120–180 MAD/m² |\n| Carrelage mural (cuisine/salle de bain) | 90–150 MAD/m² |\n| Pose en diagonale | +20–30% |\n| Dépose ancienne carrelage | 30–60 MAD/m² |\n| Ragréage sol avant pose | 40–80 MAD/m² |\n\n*Ces prix n'incluent pas les carreaux eux-mêmes ni les colles et joints.*",
                ],
                [
                    'title'   => "2. Quel carrelage choisir à Casablanca ?",
                    'content' => "**Pour les salons et couloirs :**\n- Grès cérame poli (brillant) : 40–120 MAD/m² en magasin\n- Grand format (80×80 ou 120×60) : effet contemporain, très tendance à Casablanca\n- Imitation marbre ou bois : populaire dans les appartements haut de gamme\n\n**Pour les salles de bain et cuisines :**\n- Carreaux muraux 30×60 : bon rapport qualité/prix, pose rapide\n- Mosaïque : effet décoratif, plus cher à poser (+30%)\n- Carreaux de ciment : tendance, fragile si mal entretenu\n\n**Pour les terrasses et extérieurs :**\n- Grès antidérapant (R10 ou R11) — obligatoire pour éviter les chutes\n- Résistant au gel si votre terrasse est exposée\n- Évitez les carreaux polis en extérieur (dangereux mouillés)",
                ],
                [
                    'title'   => "3. Durée des travaux et organisation",
                    'content' => "**Estimation du temps de travaux :**\n- Pièce de 15 m² : 1–2 jours (hors séchage)\n- Appartement complet (70 m²) : 4–7 jours ouvrables\n- Séchage complet avant nettoyage : 24–48h minimum\n- Séchage avant joints : 24h minimum\n\n**Pendant les travaux :**\n- Prévoyez une solution de repli (hôtel ou famille) si la salle de bain est indisponible\n- Protégez les meubles et les murs environnants\n- Assurez-vous que les pièces sont bien ventilées (colles peuvent dégager des vapeurs)\n\n**Commandez 10% de carreaux en plus** que la surface mesurée — pour les coupes et les casses.",
                ],
                [
                    'title'   => "4. Ce qu'un bon carreleur doit faire",
                    'content' => "**Avant la pose :**\n✅ Mesurer précisément la surface et calculer la quantité\n✅ Vérifier la planéité du sol (avec niveau à bulle)\n✅ Préparer le support (ragréage si nécessaire)\n✅ Centrer le calepinage (pas de petites bandes visibles aux angles)\n\n**Pendant la pose :**\n✅ Utiliser des croisillons pour des joints réguliers\n✅ Vérifier la planéité ligne par ligne\n✅ Laisser sécher correctement avant de marcher dessus\n\n**Après la pose :**\n✅ Réaliser les joints proprement (sans excès)\n✅ Nettoyage complet des résidus de joint\n✅ Silicone aux jonctions mur/sol dans la salle de bain",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un carreleur à Casablanca",
                'url'   => '/professionnels/casablanca/carrelage',
                'label' => 'Voir les carreleurs de Casablanca',
            ],
            'related' => [
                'carreleur-maroc-guide',
                'peintre-casablanca',
            ],
        ],

        'artisan-tanger-guide' => [
            'slug'        => 'artisan-tanger-guide',
            'title'       => "Artisans à Tanger : trouver un professionnel fiable en 2026",
            'description' => "Guide complet pour trouver des artisans vérifiés à Tanger : plombiers, électriciens, peintres et plus — tarifs locaux et conseils pratiques.",
            'category'    => 'Général',
            'city'        => 'Tanger',
            'readTime'    => 6,
            'date'        => '2026-05-26',
            'sections'    => [
                [
                    'title'   => "1. Le marché de l'artisanat à Tanger",
                    'content' => "Tanger connaît un boom immobilier sans précédent depuis 2015 (Tanger Med, investissements étrangers, TGV Casablanca-Tanger). Cette croissance a généré une forte demande en artisans de tous corps de métiers.\n\n**Métiers les plus demandés à Tanger :**\n- Plombiers (forte croissance des nouveaux immeubles)\n- Électriciens (rénovations et climatisation)\n- Peintres (appartements neufs et rénovations)\n- Carreleurs (finitions de logements neufs)\n- Femmes de ménage (expatriés et familles aisées)\n\n**Prix à Tanger vs Casablanca :** en moyenne 10–20% moins élevés, sauf dans les zones huppées (Malabata, Marchane, Achakar).",
                ],
                [
                    'title'   => "2. Tarifs des artisans à Tanger",
                    'content' => "**Prix indicatifs à Tanger en 2026 :**\n\n| Métier | Intervention courante | Prix |\n|--------|----------------------|------|\n| Plombier | Fuite / débouchage | 150–350 MAD |\n| Électricien | Dépannage électrique | 130–300 MAD |\n| Peintre | Chambre (15 m²) | 400–800 MAD |\n| Carreleur | Pose au m² | 70–120 MAD/m² |\n| Femme de ménage | À l'heure | 70–120 MAD/h |\n| Maçon | Journée | 300–500 MAD/jour |\n| Menuisier | Porte intérieure | 250–500 MAD |",
                ],
                [
                    'title'   => "3. Quartiers de Tanger : où trouver des artisans ?",
                    'content' => "Les artisans de Tanger se concentrent dans certaines zones :\n\n**Ville Nouvelle (Beni Makada, Mghogha) :** La plupart des entreprises d'artisanat sont installées ici. Délais d'intervention courts.\n\n**Médina et Kasbah :** Travaux plus complexes (bâtiments anciens, accès difficile). Choisissez un artisan ayant une expérience en médina.\n\n**Cap Spartel / Achakar / Malabata :** Villas et résidences de standing. Les artisans pratiquent des tarifs plus élevés dans ces zones.\n\n**Tanger Med (Zone industrielle) :** Peu de demande résidentielle, concentrée sur les locaux commerciaux.",
                ],
                [
                    'title'   => "4. Conseils pour trouver un artisan fiable à Tanger",
                    'content' => "**Ne faites pas confiance aux rabatteurs :** À Tanger, des intermédiaires proposent parfois des artisans non qualifiés avec des marges importantes. Passez directement par une plateforme vérifiée ou par recommandation.\n\n**Vérifiez l'identité :** demandez toujours la CIN et un numéro de téléphone stable. Un artisan qui refuse est un signal d'alerte.\n\n**Méfiez-vous des « touristes » de la construction :** Tanger attire des travailleurs d'autres régions (Fès, Tétouan) pas toujours qualifiés. Privilégiez les artisans locaux avec des références à Tanger.\n\n**Exigez un devis écrit**, même pour une intervention simple — c'est la norme pour les professionnels sérieux.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un artisan à Tanger",
                'url'   => '/professionnels/tanger/plomberie',
                'label' => 'Voir les artisans de Tanger',
            ],
            'related' => [
                'choisir-plombier-casablanca',
                'electricien-casablanca',
            ],
        ],

        'peintre-rabat-guide' => [
            'slug'        => 'peintre-rabat-guide',
            'title'       => "Peintre à Rabat : tarifs et conseils pour vos travaux 2026",
            'description' => "Tout sur les travaux de peinture à Rabat : prix au m², types de peinture recommandés pour le climat atlantique, et peintres vérifiés disponibles rapidement.",
            'category'    => 'Peinture',
            'city'        => 'Rabat',
            'readTime'    => 5,
            'date'        => '2026-05-26',
            'sections'    => [
                [
                    'title'   => "1. Tarifs des peintres à Rabat en 2026",
                    'content' => "Les tarifs des peintres à Rabat sont parmi les plus compétitifs du Maroc :\n\n| Prestation | Tarif indicatif |\n|-----------|----------------|\n| Peinture murs intérieurs (main-d'œuvre) | 20–45 MAD/m² |\n| Peinture plafond | 25–50 MAD/m² |\n| Peinture façade extérieure | 30–60 MAD/m² |\n| Chambre complète (15 m², 2 couches) | 350–700 MAD |\n| Appartement 70 m² (murs + plafonds) | 2 000–4 500 MAD |\n| Enduit décoratif (tadelakt, stucco) | 80–200 MAD/m² |\n\nCes prix incluent la main-d'œuvre uniquement — la peinture est généralement à la charge du client.",
                ],
                [
                    'title'   => "2. Quel type de peinture pour Rabat ?",
                    'content' => "Le climat de Rabat (humidité atlantique, pluies hivernales) impose des contraintes particulières :\n\n**Intérieur :**\n- **Peinture acrylique mate** : idéale pour les chambres et salons (non lavable, bonne couvrance)\n- **Peinture acrylique satin/velours** : recommandée pour les cuisines et salles de bain (résiste à la vapeur)\n- **Peinture glycéro** : pour les boiseries, portes et radiateurs\n\n**Extérieur (façades à Rabat) :**\n- Peinture imperméable de façade obligatoire\n- Teinte anti-moisissures recommandée (l'humidité atlantique favorise les moisissures sur les façades nord)\n- Primaire accrochage si façade ancienne ou en mauvais état\n\n**Finitions artisanales :**\n- **Tadelakt** : enduit imperméable typiquement marocain — idéal pour hammam et douche\n- **Gypse peint (jebs)** : utilisé pour les corniches et moulures décoratives",
                ],
                [
                    'title'   => "3. Durée des travaux et conseils d'organisation",
                    'content' => "**Estimation du temps :**\n- Chambre (15 m²) : 1 jour (préparation + 2 couches)\n- Appartement standard (70–90 m²) : 3–5 jours ouvrables\n- Façade (150 m²) : 4–7 jours (selon état et accessibilité)\n\n**Avant les travaux :**\n- Protégez les sols avec des bâches\n- Retirez les meubles ou regroupez-les au centre\n- Masquez les prises, interrupteurs et plinthes avec du ruban\n\n**Conditions idéales :**\n- Température entre 10°C et 30°C (évitez les jours de pluie ou de vent fort)\n- Bonne ventilation pour le séchage (ouvrez les fenêtres)\n- Ne pas chauffer la pièce pendant le séchage (crée des bulles)",
                ],
                [
                    'title'   => "4. Comment choisir son peintre à Rabat",
                    'content' => "**Les bons signes :**\n✅ Prépare correctement les surfaces (ponçage, rebouchage des trous)\n✅ Applique une couche d'impression (primaire) si nécessaire\n✅ Respecte le temps de séchage entre les couches\n✅ Nettoie son chantier à la fin\n✅ Utilise des pinceaux et rouleaux de qualité (pas de traces visibles)\n\n**Ce qu'il faut éviter :**\n❌ Peintre qui n'applique qu'une seule couche « pour aller plus vite »\n❌ Dilution excessive de la peinture (rendu terne et protection réduite)\n❌ Pas de protection des sols et meubles\n❌ Devis uniquement à l'oral\n\nSur Jobly, comparez les peintres de Rabat selon leurs avis et leur spécialité.",
                ],
            ],
            'cta' => [
                'text'  => "Trouver un peintre à Rabat",
                'url'   => '/professionnels/rabat/peinture',
                'label' => 'Voir les peintres de Rabat',
            ],
            'related' => [
                'peintre-casablanca',
                'peintre-marrakech',
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
