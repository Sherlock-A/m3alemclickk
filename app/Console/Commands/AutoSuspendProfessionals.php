<?php

namespace App\Console\Commands;

use App\Models\Professional;
use App\Services\MailService;
use Illuminate\Console\Command;

class AutoSuspendProfessionals extends Command
{
    protected $signature   = 'pros:auto-suspend';
    protected $description = 'Suspend professionals with rating < 3.0 and 10+ approved reviews';

    public function handle(MailService $mail): void
    {
        $pros = Professional::withCount(['reviews as approved_reviews_count' => fn ($q) => $q->where('approved', true)])
            ->having('approved_reviews_count', '>=', 10)
            ->where('rating', '<', 3.0)
            ->whereHas('user', fn ($q) => $q->where('status', 'active'))
            ->with('user')
            ->get();

        foreach ($pros as $pro) {
            if ($pro->user) {
                $pro->user->update(['status' => 'suspended']);
                $mail->sendProAutoSuspended(
                    $pro->user->email,
                    $pro->user->name,
                    round((float) $pro->rating, 1)
                );
                $this->line("Suspended: {$pro->user->name} (rating {$pro->rating})");
            }
        }

        $this->info("Done — {$pros->count()} professional(s) suspended.");
    }
}
