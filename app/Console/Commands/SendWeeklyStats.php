<?php

namespace App\Console\Commands;

use App\Models\Professional;
use App\Models\Tracking;
use App\Services\MailService;
use Illuminate\Console\Command;

class SendWeeklyStats extends Command
{
    protected $signature   = 'pros:send-weekly-stats';
    protected $description = 'Send weekly performance stats email to all active professionals';

    public function handle(MailService $mail): void
    {
        $pros = Professional::approved()
            ->whereHas('user', fn($q) => $q->whereNotNull('email'))
            ->with('user')
            ->get();

        $weekAgo     = now()->subDays(7);
        $dashboardUrl = config('app.url') . '/dashboard/professional';
        $sent        = 0;

        foreach ($pros as $pro) {
            $proUser = $pro->user;
            if (! $proUser?->email) continue;

            $views = Tracking::where('professional_id', $pro->id)
                ->where('type', 'view')
                ->where('created_at', '>=', $weekAgo)
                ->count();

            $whatsappClicks = Tracking::where('professional_id', $pro->id)
                ->whereIn('type', ['whatsapp', 'whatsapp_click'])
                ->where('created_at', '>=', $weekAgo)
                ->count();

            $calls = Tracking::where('professional_id', $pro->id)
                ->where('type', 'call')
                ->where('created_at', '>=', $weekAgo)
                ->count();

            // Only send if there was at least some activity this week
            if ($views + $whatsappClicks + $calls === 0) continue;

            $totalReviews = $pro->reviews()->where('approved', true)->count();

            $mail->sendWeeklyStats(
                proEmail:      $proUser->email,
                proName:       $pro->name,
                views:         $views,
                whatsappClicks: $whatsappClicks,
                calls:         $calls,
                totalReviews:  $totalReviews,
                rating:        (float) $pro->rating,
                dashboardUrl:  $dashboardUrl,
            );

            $sent++;
        }

        $this->info("Weekly stats sent to {$sent} professional(s).");
    }
}
