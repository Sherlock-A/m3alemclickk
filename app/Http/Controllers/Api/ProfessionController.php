<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfessionController extends Controller
{
    // Répertoire complet des métiers avec variantes et catégories
    private const PROFESSIONS = [
        // Plomberie
        ['label' => 'Plombier',              'category' => 'Plomberie',    'keywords' => ['plomb']],
        ['label' => 'Plombier Sanitaire',    'category' => 'Plomberie',    'keywords' => ['plomb','sanit']],
        ['label' => 'Plombier Chauffagiste', 'category' => 'Plomberie',    'keywords' => ['plomb','chauff']],
        ['label' => 'Plombier Dépannage',    'category' => 'Plomberie',    'keywords' => ['plomb','depann']],
        ['label' => 'Plombier Rénovation',   'category' => 'Plomberie',    'keywords' => ['plomb','renov']],
        // Electricité
        ['label' => 'Électricien',           'category' => 'Electricite',  'keywords' => ['electri']],
        ['label' => 'Électricien Général',   'category' => 'Electricite',  'keywords' => ['electri']],
        ['label' => 'Électricien Bâtiment',  'category' => 'Electricite',  'keywords' => ['electri','batim']],
        ['label' => 'Électricien Industriel','category' => 'Electricite',  'keywords' => ['electri','indus']],
        ['label' => 'Électricien Dépannage', 'category' => 'Electricite',  'keywords' => ['electri','depann']],
        // Peinture
        ['label' => 'Peintre Bâtiment',      'category' => 'Peinture',     'keywords' => ['peintr','batim']],
        ['label' => 'Peintre Décorateur',    'category' => 'Peinture',     'keywords' => ['peintr','decor']],
        ['label' => 'Peintre Intérieur',     'category' => 'Peinture',     'keywords' => ['peintr','inter']],
        ['label' => 'Peintre Façade',        'category' => 'Peinture',     'keywords' => ['peintr','facad']],
        // Climatisation
        ['label' => 'Technicien Climatisation','category' => 'Climatisation','keywords' => ['clim','tech','froid']],
        ['label' => 'Technicien Froid et Clim','category' => 'Climatisation','keywords' => ['clim','froid','tech']],
        ['label' => 'Technicien HVAC',       'category' => 'Climatisation','keywords' => ['hvac','clim','tech']],
        ['label' => 'Installateur Clim',     'category' => 'Climatisation','keywords' => ['clim','instal']],
        // Menuiserie
        ['label' => 'Menuisier Bois',        'category' => 'Menuiserie',   'keywords' => ['menuisi','bois']],
        ['label' => 'Menuisier Aluminium',   'category' => 'Menuiserie',   'keywords' => ['menuisi','alum']],
        ['label' => 'Menuisier PVC',         'category' => 'Menuiserie',   'keywords' => ['menuisi','pvc']],
        ['label' => 'Menuisier Décoration',  'category' => 'Menuiserie',   'keywords' => ['menuisi','decor']],
        ['label' => 'Charpentier Menuisier', 'category' => 'Menuiserie',   'keywords' => ['charpen','menuisi']],
        // Ménage
        ['label' => 'Femme de ménage',       'category' => 'Menage',       'keywords' => ['menage','femme']],
        ['label' => 'Aide ménagère',         'category' => 'Menage',       'keywords' => ['menage','aide']],
        ['label' => 'Service ménage domicile','category' => 'Menage',      'keywords' => ['menage','domicil']],
        // Maçonnerie
        ['label' => 'Maçon',                 'category' => 'Maconnerie',   'keywords' => ['macon']],
        ['label' => 'Maçon Rénovateur',      'category' => 'Maconnerie',   'keywords' => ['macon','renov']],
        ['label' => 'Maçon Constructeur',    'category' => 'Maconnerie',   'keywords' => ['macon','constr']],
        ['label' => 'Carreleur Maçon',       'category' => 'Maconnerie',   'keywords' => ['macon','carrel']],
        // Serrurerie
        ['label' => 'Serrurier',             'category' => 'Serrurerie',   'keywords' => ['serrur']],
        ['label' => 'Serrurier Urgence 24h', 'category' => 'Serrurerie',   'keywords' => ['serrur','urgent']],
        ['label' => 'Serrurier Blindage',    'category' => 'Serrurerie',   'keywords' => ['serrur','blind']],
        // Jardinage
        ['label' => 'Jardinier',             'category' => 'Jardinage',    'keywords' => ['jardin']],
        ['label' => 'Paysagiste Jardinier',  'category' => 'Jardinage',    'keywords' => ['paysag','jardin']],
        ['label' => 'Jardinier Entretien',   'category' => 'Jardinage',    'keywords' => ['jardin','entret']],
        // Informatique
        ['label' => 'Technicien Informatique','category' => 'Informatique','keywords' => ['info','tech']],
        ['label' => 'Technicien Réseau',     'category' => 'Informatique', 'keywords' => ['reseau','tech','info']],
        ['label' => 'Support Informatique',  'category' => 'Informatique', 'keywords' => ['info','support']],
        ['label' => 'Développeur Web',       'category' => 'Informatique', 'keywords' => ['dev','web','info']],
        // Déménagement
        ['label' => 'Déménageur',            'category' => 'Demenagement', 'keywords' => ['demena']],
        ['label' => 'Déménageur Pro',        'category' => 'Demenagement', 'keywords' => ['demena','pro']],
        // Soudure
        ['label' => 'Soudeur',               'category' => 'Soudure',      'keywords' => ['soud']],
        ['label' => 'Soudeur Métalliste',    'category' => 'Soudure',      'keywords' => ['soud','metal']],
        ['label' => 'Ferronnier',            'category' => 'Soudure',      'keywords' => ['ferronn','metal']],
        // Carrelage
        ['label' => 'Carreleur',             'category' => 'Carrelage',    'keywords' => ['carrel']],
        ['label' => 'Carreleur Faïenceur',   'category' => 'Carrelage',    'keywords' => ['carrel','faien']],
        ['label' => 'Carreleur Marbre',      'category' => 'Carrelage',    'keywords' => ['carrel','marbre']],
        // Vitrerie
        ['label' => 'Vitrier',               'category' => 'Vitrerie',     'keywords' => ['vitr']],
        ['label' => 'Vitrier Double Vitrage','category' => 'Vitrerie',     'keywords' => ['vitr','double']],
        // Chauffage
        ['label' => 'Chauffagiste',          'category' => 'Chauffage',    'keywords' => ['chauff']],
        ['label' => 'Tech Chauffage Gaz',    'category' => 'Chauffage',    'keywords' => ['chauff','gaz']],
        ['label' => 'Installateur Chaudière','category' => 'Chauffage',    'keywords' => ['chauff','chaudier']],
        // Décoration
        ['label' => 'Décorateur Intérieur',  'category' => 'Decoration',   'keywords' => ['decor','inter']],
        ['label' => 'Designer Intérieur',    'category' => 'Decoration',   'keywords' => ['design','inter']],
        ['label' => 'Architecte Décorateur', 'category' => 'Decoration',   'keywords' => ['archi','decor']],
        // Nettoyage
        ['label' => 'Agent de Nettoyage',    'category' => 'Nettoyage',    'keywords' => ['nettoy']],
        ['label' => 'Nettoyage Professionnel','category' => 'Nettoyage',   'keywords' => ['nettoy','pro']],
        ['label' => 'Nettoyage Après Chantier','category' => 'Nettoyage',  'keywords' => ['nettoy','chant']],
        // Charpenterie
        ['label' => 'Charpentier Couvreur',  'category' => 'Charpenterie', 'keywords' => ['charpen','couvreur']],
        ['label' => 'Couvreur Zingueur',     'category' => 'Charpenterie', 'keywords' => ['couvreur','zingu']],
        // Coiffure
        ['label' => 'Coiffeur à Domicile',   'category' => 'Coiffure',     'keywords' => ['coiff','domicil']],
        ['label' => 'Coiffeuse Visagiste',   'category' => 'Coiffure',     'keywords' => ['coiff','visag']],
        ['label' => 'Coiffeuse Mariage',     'category' => 'Coiffure',     'keywords' => ['coiff','mariage']],
        ['label' => 'Barbier',               'category' => 'Coiffure',     'keywords' => ['barbier','coiff']],
        // Photographie
        ['label' => 'Photographe Événements','category' => 'Photographie', 'keywords' => ['photo','event']],
        ['label' => 'Photographe Mariages',  'category' => 'Photographie', 'keywords' => ['photo','mariage']],
        ['label' => 'Photographe Studio',    'category' => 'Photographie', 'keywords' => ['photo','studio']],
    ];

    public function autocomplete(Request $request)
    {
        $q = $request->string('q')->trim()->toString();
        if (strlen($q) < 2) {
            return response()->json([]);
        }

        $norm = $this->norm($q);

        $results = [];
        foreach (self::PROFESSIONS as $p) {
            $labelNorm = $this->norm($p['label']);
            $catNorm   = $this->norm($p['category']);
            $score     = 0;

            // Correspondance exacte (priorité maximale)
            if ($labelNorm === $norm) { $score = 100; }
            // Commence par le terme
            elseif (str_starts_with($labelNorm, $norm)) { $score = 80; }
            // Contient le terme dans le label
            elseif (str_contains($labelNorm, $norm)) { $score = 60; }
            // Contient dans la catégorie
            elseif (str_contains($catNorm, $norm)) { $score = 50; }
            // Match sur les keywords
            else {
                foreach ($p['keywords'] as $kw) {
                    if (str_starts_with($norm, $kw) || str_starts_with($kw, $norm)) {
                        $score = 40;
                        break;
                    }
                }
            }

            if ($score > 0) {
                $results[] = [
                    'label'    => $p['label'],
                    'category' => $p['category'],
                    'score'    => $score,
                ];
            }
        }

        // Trier par score desc, alphabétique pour égalité
        usort($results, fn ($a, $b) => $b['score'] <=> $a['score'] ?: strcmp($a['label'], $b['label']));

        return response()->json(array_slice(array_column($results, null), 0, 8));
    }

    private function norm(string $s): string
    {
        $from = ['é','è','ê','ë','à','â','ä','ô','ö','ù','û','ü','î','ï','ç','É','È','Ê','Ë','À','Â','Ä','Ô','Ö','Ù','Û','Ü','Î','Ï','Ç'];
        $to   = ['e','e','e','e','a','a','a','o','o','u','u','u','i','i','c','e','e','e','e','a','a','a','o','o','u','u','u','i','i','c'];
        return mb_strtolower(str_replace($from, $to, $s), 'UTF-8');
    }
}
