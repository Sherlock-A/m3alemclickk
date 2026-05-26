<?php

namespace App\Console\Commands;

use App\Models\Professional;
use Illuminate\Console\Command;

class GenerateReferralCodes extends Command
{
    protected $signature   = 'pros:generate-referral-codes';
    protected $description = 'Generate missing referral codes for existing professionals';

    public function handle(): void
    {
        $pros = Professional::whereNull('referral_code')->get();

        if ($pros->isEmpty()) {
            $this->info('All professionals already have a referral code.');
            return;
        }

        foreach ($pros as $pro) {
            $letters = strtoupper(preg_replace('/[^a-zA-Z]/', '', $pro->name));
            $prefix  = substr($letters, 0, 5) ?: 'PRO';
            $code    = $prefix . '-' . str_pad((string) rand(1000, 9999), 4, '0', STR_PAD_LEFT);
            while (Professional::where('referral_code', $code)->exists()) {
                $code = $prefix . '-' . str_pad((string) rand(1000, 9999), 4, '0', STR_PAD_LEFT);
            }
            $pro->update(['referral_code' => $code]);
            $this->line("  ✓ {$pro->name} → {$code}");
        }

        $this->info("Generated {$pros->count()} referral code(s).");
    }
}
