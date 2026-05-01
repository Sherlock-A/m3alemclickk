<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Paginator::useTailwind();

        RateLimiter::for('tracking', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        // Login rate limit by email (not IP) — avoids Railway shared-proxy false positives
        RateLimiter::for('login', function (Request $request) {
            $key = strtolower(trim($request->input('email', $request->input('identifier', 'unknown'))));
            return Limit::perMinute(10)->by('login:' . $key);
        });
    }
}
