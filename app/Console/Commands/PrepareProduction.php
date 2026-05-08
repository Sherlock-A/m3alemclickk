<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class PrepareProduction extends Command
{
    protected $signature   = 'jobly:prepare-production
                                {--verify   : Affiche uniquement les stats sans modifier}
                                {--force    : Saute la confirmation interactive}';

    protected $description = 'Vide toutes les données de test et prépare Jobly pour le lancement en production';

    public function handle(): int
    {
        $this->newLine();
        $this->line('╔══════════════════════════════════════════════════════╗');
        $this->line('║        JOBLY — Préparation Production                ║');
        $this->line('╚══════════════════════════════════════════════════════╝');
        $this->newLine();

        if ($this->option('verify')) {
            $this->info('Mode vérification (--verify) : aucune modification.');
            $this->newLine();
            return $this->showStats();
        }

        // ── Affiche l'état actuel ────────────────────────────────────────────
        $this->warn('ÉTAT ACTUEL DES DONNÉES :');
        $this->showStats();

        // ── Confirmation ────────────────────────────────────────────────────
        if (! $this->option('force')) {
            $this->warn('ATTENTION : Cette action supprime DÉFINITIVEMENT toutes les données de test !');
            $this->line('  • professionals, users (non-admin), reviews, trackings, clients');
            $this->line('  • Cache applicatif');
            $this->line('  • Photos uploadées (storage/app/public/photos/)');
            $this->newLine();

            if (! $this->confirm('Confirmer la suppression des données de test ?', false)) {
                $this->info('Opération annulée.');
                return self::SUCCESS;
            }
        }

        $this->newLine();

        // ── 1. Désactiver les contraintes FK ─────────────────────────────────
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        $this->line('✓ Contraintes FK désactivées');

        // ── 2. Supprimer les données de test ─────────────────────────────────
        $trackings = DB::table('trackings')->count();
        DB::table('trackings')->truncate();
        $this->line("✓ trackings supprimés ({$trackings} lignes)");

        $reviews = DB::table('reviews')->count();
        DB::table('reviews')->truncate();
        $this->line("✓ reviews supprimés ({$reviews} lignes)");

        $clients = DB::table('clients')->count();
        DB::table('clients')->truncate();
        $this->line("✓ clients supprimés ({$clients} lignes)");

        $professionals = DB::table('professionals')->count();
        DB::table('professionals')->truncate();
        $this->line("✓ professionals supprimés ({$professionals} lignes)");

        $users = User::where('role', '!=', 'admin')->count();
        User::where('role', '!=', 'admin')->delete();
        DB::statement('ALTER TABLE users AUTO_INCREMENT = 1');
        $this->line("✓ users (non-admin) supprimés ({$users} comptes)");

        // ── 3. Réactiver les contraintes FK ──────────────────────────────────
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        $this->line('✓ Contraintes FK réactivées');

        // ── 4. Supprimer les photos de test ───────────────────────────────────
        if (Storage::exists('photos')) {
            $photos = count(Storage::files('photos'));
            Storage::deleteDirectory('photos');
            Storage::makeDirectory('photos');
            $this->line("✓ Photos de test supprimées ({$photos} fichiers) — dossier photos/ recréé vide");
        } else {
            Storage::makeDirectory('photos');
            $this->line('✓ Dossier photos/ créé (était absent)');
        }

        // ── 5. Vider les caches ───────────────────────────────────────────────
        DB::table('cache')->truncate();
        DB::table('cache_locks')->truncate();
        $this->callSilent('cache:clear');
        $this->callSilent('config:clear');
        $this->callSilent('route:clear');
        $this->callSilent('view:clear');
        $this->line('✓ Tous les caches vidés (DB + fichiers)');

        // ── 6. Rapport final ──────────────────────────────────────────────────
        $this->newLine();
        $this->info('NETTOYAGE TERMINÉ — État final :');
        $this->showStats();

        $this->newLine();
        $this->line('Prochaines étapes :');
        $this->line('  php artisan db:seed --class=AdminSeeder   # Re-créer le compte admin prod');
        $this->line('  npm run build                              # Build assets production');
        $this->line('  php artisan config:cache                  # Optimiser pour la prod');
        $this->newLine();

        return self::SUCCESS;
    }

    private function showStats(): int
    {
        $rows = [
            ['categories',    DB::table('categories')->count(),    'conservées ✓'],
            ['cities',        DB::table('cities')->count(),        'conservées ✓'],
            ['professionals', DB::table('professionals')->count(), ''],
            ['users',         DB::table('users')->count(),         ''],
            ['reviews',       DB::table('reviews')->count(),       ''],
            ['trackings',     DB::table('trackings')->count(),     ''],
            ['clients',       DB::table('clients')->count(),       ''],
        ];

        $this->table(
            ['Table', 'Lignes', 'Note'],
            $rows
        );

        return self::SUCCESS;
    }
}
