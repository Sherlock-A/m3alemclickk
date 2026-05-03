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

        // Global API limiter — high limit, keyed by user ID or IP
        // On Railway (shared proxy), IP-based limits block everyone; use generous limit
        RateLimiter::for('api', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(600)->by($request->user()->id)
                : Limit::perMinute(300)->by($request->ip());
        });

        RateLimiter::for('tracking', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });

        // Login rate limit by email — avoids Railway shared-proxy false positives
        RateLimiter::for('login', function (Request $request) {
            $key = strtolower(trim($request->input('email', $request->input('identifier', 'unknown'))));
            return Limit::perMinute(20)->by('login:' . $key);
        });
    }
}
