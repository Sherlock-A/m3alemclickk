<?php

use App\Http\Middleware\CheckRole;
use App\Http\Middleware\JwtAuthenticate;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\SetLocaleAndGeo;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*', headers: \Illuminate\Http\Request::HEADER_X_FORWARDED_FOR | \Illuminate\Http\Request::HEADER_X_FORWARDED_PROTO | \Illuminate\Http\Request::HEADER_X_FORWARDED_PORT | \Illuminate\Http\Request::HEADER_X_FORWARDED_HOST);

        // JWT cookies are set by API routes (no EncryptCookies) as raw JWT strings.
        // Exclude them so web-route EncryptCookies doesn't null them out on read.
        $middleware->encryptCookies(except: [
            'jwt_admin',
            'jwt_pro',
            'jwt_client',
        ]);

        $middleware->web(append: [
            SetLocaleAndGeo::class,
            SecurityHeaders::class,
        ]);

        $middleware->api(prepend: [
            SetLocaleAndGeo::class,
            SecurityHeaders::class,
        ]);

        // Remove the default global throttle:api — it uses IP-based limiting which
        // blocks all users on Railway (shared proxy IP). Per-route throttles handle limits.
        $middleware->api(remove: [
            \Illuminate\Routing\Middleware\ThrottleRequests::class,
        ]);

        $middleware->alias([
            'jwt'            => JwtAuthenticate::class,
            'admin'          => \App\Http\Middleware\EnsureAdmin::class,
            'role'           => CheckRole::class,
            'dashboard.auth' => \App\Http\Middleware\EnsureDashboardAuth::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
