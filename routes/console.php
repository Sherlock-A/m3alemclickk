<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// ─── Nettoyage des trackings anciens (> 6 mois) ───────────────────────────────
Schedule::call(function () {
    \App\Models\Tracking::where('created_at', '<', now()->subMonths(6))->delete();
})->weekly()->sundays()->at('03:00');

// ─── Nettoyage des failed_jobs anciens (> 30 jours) ──────────────────────────
Schedule::command('queue:prune-failed --hours=720')->weekly();

// ─── Rapport hebdomadaire aux professionnels actifs ──────────────────────────
Schedule::command('pros:weekly-report')->weekly()->mondays()->at('08:00');

// ─── Traitement de la queue toutes les minutes (si pas de worker dédié) ──────
// Décommentez la ligne ci-dessous uniquement sur un hébergement sans worker process
// Schedule::command('queue:work --stop-when-empty')->everyMinute()->withoutOverlapping();
