<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Supprime les accents et passe en minuscule.
     * Méthode publique réutilisable par les tests et autres contrôleurs.
     */
    public static function normalizeSearchTerm(string $input): string
    {
        $from = ['é','è','ê','ë','à','â','ä','ô','ö','ù','û','ü','î','ï','ç',
                 'É','È','Ê','Ë','À','Â','Ä','Ô','Ö','Ù','Û','Ü','Î','Ï','Ç'];
        $to   = ['e','e','e','e','a','a','a','o','o','u','u','u','i','i','c',
                 'e','e','e','e','a','a','a','o','o','u','u','u','i','i','c'];
        return mb_strtolower(str_replace($from, $to, $input), 'UTF-8');
    }

    /**
     * Mapping catégorie normalisée → racine de recherche.
     * Permet : "plomberie" → trouve plombiers, "electricite" → trouve électriciens, etc.
     */
    private static array $synonymMap = [
        'plomberie'     => 'plomb',
        'electricite'   => 'electri',
        'menage'        => 'menag',
        'demenagement'  => 'demena',
        'demenageur'    => 'demena',
        'maconnerie'    => 'macon',
        'serrurerie'    => 'serrur',
        'jardinage'     => 'jardin',
        'menuiserie'    => 'menuisi',
        'peinture'      => 'peintr',
        'soudure'       => 'soud',
        'carrelage'     => 'carrel',
        'vitrerie'      => 'vitr',
        'chauffage'     => 'chauff',
        'coiffure'      => 'coiff',
        'photographie'  => 'photo',
        'decoration'    => 'decor',
        'charpenterie'  => 'charpen',
        'informatique'  => 'informat',
        'nettoyage'     => 'nettoy',
        'climatisation' => 'clim',
        // synonymes métier → même racine
        'plombier'         => 'plomb',
        'electricien'      => 'electri',
        'femme de menage'  => 'menag',
        'femme menage'     => 'menag',
        'femme de manage'  => 'menag',
        'aide menagere'    => 'menag',
        'demenageur'       => 'demena',
        'macon'            => 'macon',
        'serrurier'        => 'serrur',
        'jardinier'        => 'jardin',
        'menuisier'        => 'menuisi',
        'peintre'          => 'peintr',
        'soudeur'          => 'soud',
        'carreleur'        => 'carrel',
        'vitrier'          => 'vitr',
        'chauffagiste'     => 'chauff',
        'coiffeur'         => 'coiff',
        'coiffeuse'        => 'coiff',
        'photographe'      => 'photo',
        'decorateur'       => 'decor',
        'charpentier'      => 'charpen',
        'informaticien'    => 'informat',
        'nettoyeur'        => 'nettoy',
        'climatiseur'      => 'clim',
    ];

    /**
     * GET /api/search?q=...  — point d'entrée unifié avec normalisation
     *
     * Accepte aussi ?search=... pour compatibilité avec les anciens clients.
     */
    public function search(Request $request): JsonResponse
    {
        $raw = trim((string) $request->input('q', $request->input('search', '')));

        if ($raw !== '') {
            $normalized = self::normalizeSearchTerm($raw);

            // 1. Correspondance exacte de la phrase complète
            if (isset(self::$synonymMap[$normalized])) {
                $root = self::$synonymMap[$normalized];
            } else {
                // 2. Chercher dans les mots individuels (requête multi-mots)
                $words = preg_split('/\s+/', $normalized);
                $root  = $normalized; // fallback
                foreach ($words as $word) {
                    if (isset(self::$synonymMap[$word])) {
                        $root = self::$synonymMap[$word];
                        break;
                    }
                }
            }

            $request->merge(['search' => $root]);
        }

        return (new ProfessionalController())->index($request);
    }

    /**
     * GET /api/search-suggestions?q=...  — autocomplétion des métiers
     */
    public function suggestions(Request $request): JsonResponse
    {
        return (new ProfessionController())->autocomplete($request);
    }
}
