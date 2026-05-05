<?php

namespace App\Console\Commands;

use App\Jobs\SendMailJob;
use App\Models\Professional;
use App\Services\MailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class WeeklyProReport extends Command
{
    protected $signature   = 'pros:weekly-report';
    protected $description = 'Send weekly stats report to active professionals';

    public function handle(MailService $mail): void
    {
        $mailer = config('mail.default', 'log');
        $count  = 0;

        Professional::where('status', 'approved')
            ->where('is_available', true)
            ->whereHas('user', fn ($q) => $q->whereNotNull('email'))
            ->with(['user:id,email,name'])
            ->chunkById(50, function ($pros) use ($mail, $mailer, &$count) {
                foreach ($pros as $pro) {
                    $user = $pro->user;
                    if (! $user?->email) continue;

                    // Gather last 7-day stats
                    $since    = now()->subDays(7);
                    $views    = DB::table('trackings')
                        ->where('professional_id', $pro->id)
                        ->where('type', 'view')
                        ->where('created_at', '>=', $since)
                        ->count();
                    $contacts = DB::table('trackings')
                        ->where('professional_id', $pro->id)
                        ->whereIn('type', ['whatsapp', 'call'])
                        ->where('created_at', '>=', $since)
                        ->count();
                    $newQuotes = \App\Models\ContactRequest::where('professional_id', $pro->id)
                        ->where('created_at', '>=', $since)
                        ->count();

                    SendMailJob::dispatch(
                        $mailer,
                        'emails.weekly-pro-report',
                        [
                            'proName'      => $pro->name,
                            'views'        => $views,
                            'contacts'     => $contacts,
                            'newQuotes'    => $newQuotes,
                            'rating'       => $pro->rating ?? 0,
                            'dashboardUrl' => config('app.url') . '/dashboard/professional',
                        ],
                        $user->email,
                        $pro->name,
                        '📊 Votre rapport hebdomadaire M3allemClick',
                    );

                    $count++;
                }
            });

        $this->info("Weekly reports dispatched for {$count} professionals.");
    }
}
