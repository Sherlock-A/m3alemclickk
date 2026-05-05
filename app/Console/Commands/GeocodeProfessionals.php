<?php

namespace App\Console\Commands;

use App\Models\Professional;
use Illuminate\Console\Command;

class GeocodeProfessionals extends Command
{
    protected $signature   = 'pros:geocode-cities {--force : Re-geocode pros that already have coordinates}';
    protected $description = 'Assign lat/lon to professionals based on their main_city';

    // Moroccan city → [lat, lon]  (city name normalised: no accents, lowercase)
    private static array $cities = [
        'casablanca'    => [33.5731,  -7.5898],
        'rabat'         => [34.0209,  -6.8416],
        'fes'           => [34.0181,  -5.0078],
        'fez'           => [34.0181,  -5.0078],
        'marrakech'     => [31.6295,  -7.9811],
        'marrakesh'     => [31.6295,  -7.9811],
        'agadir'        => [30.4278,  -9.5981],
        'tanger'        => [35.7595,  -5.8340],
        'tangier'       => [35.7595,  -5.8340],
        'meknes'        => [33.8731,  -5.5407],
        'oujda'         => [34.6867,  -1.9114],
        'kenitra'       => [34.2610,  -6.5802],
        'tetouan'       => [35.5889,  -5.3626],
        'safi'          => [32.2994,  -9.2372],
        'el jadida'     => [33.2316,  -8.5007],
        'eljadida'      => [33.2316,  -8.5007],
        'beni mellal'   => [32.3373,  -6.3498],
        'benimellal'    => [32.3373,  -6.3498],
        'nador'         => [35.1740,  -2.9287],
        'settat'        => [33.0014,  -7.6194],
        'berrechid'     => [33.2658,  -7.5874],
        'khemisset'     => [33.8244,  -6.0658],
        'mohammedia'    => [33.6861,  -7.3832],
        'khouribga'     => [32.8813,  -6.9063],
        'essaouira'     => [31.5085,  -9.7595],
        'ouarzazate'    => [30.9335,  -6.8932],
        'errachidia'    => [31.9300,  -4.4244],
        'laayoune'      => [27.1253, -13.1625],
        'dakhla'        => [23.6848, -15.9573],
        'sale'          => [34.0531,  -6.7985],
        'temara'        => [33.9272,  -6.9172],
        'ksar el kebir' => [35.0006,  -5.9038],
        'larache'       => [35.1931,  -6.1552],
        'beni ansar'    => [35.2502,  -2.9270],
        'taza'          => [34.2100,  -4.0100],
        'tiznit'        => [29.6974,  -9.7316],
        'taroudant'     => [30.4700,  -8.8760],
        'guelmim'       => [28.9865, -10.0572],
        'ifrane'        => [33.5228,  -5.1073],
        'al hoceima'    => [35.2517,  -3.9372],
        'alhoceima'     => [35.2517,  -3.9372],
    ];

    public static function coordsForCity(string $city): ?array
    {
        $key = self::norm($city);
        if (isset(self::$cities[$key])) {
            return self::$cities[$key];
        }
        // Partial match (e.g. "Fès-Meknès" → "fes")
        foreach (self::$cities as $name => $coords) {
            if (str_contains($key, $name) || str_contains($name, $key)) {
                return $coords;
            }
        }
        return null;
    }

    private static function norm(string $s): string
    {
        $from = ['é','è','ê','ë','à','â','ä','ô','ö','ù','û','ü','î','ï','ç',
                 'É','È','Ê','Ë','À','Â','Ä','Ô','Ö','Ù','Û','Ü','Î','Ï','Ç'];
        $to   = ['e','e','e','e','a','a','a','o','o','u','u','u','i','i','c',
                 'e','e','e','e','a','a','a','o','o','u','u','u','i','i','c'];
        return mb_strtolower(str_replace($from, $to, $s), 'UTF-8');
    }

    public function handle(): int
    {
        $query = Professional::query();
        if (! $this->option('force')) {
            $query->whereNull('latitude')->orWhereNull('longitude');
        }

        $updated = 0;
        $skipped = 0;

        $query->chunk(100, function ($pros) use (&$updated, &$skipped) {
            foreach ($pros as $pro) {
                $coords = self::coordsForCity($pro->main_city);
                if ($coords) {
                    $pro->update(['latitude' => $coords[0], 'longitude' => $coords[1]]);
                    $this->line("  ✓ {$pro->name} ({$pro->main_city}) → {$coords[0]}, {$coords[1]}");
                    $updated++;
                } else {
                    $this->warn("  ? {$pro->name} ({$pro->main_city}) → ville inconnue");
                    $skipped++;
                }
            }
        });

        $this->info("Terminé : {$updated} mis à jour, {$skipped} ignorés.");
        return 0;
    }
}
