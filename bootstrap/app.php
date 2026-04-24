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

        $middleware->web(append: [
            SetLocaleAndGeo::class,
            SecurityHeaders::class,
        ]);

        $middleware->api(prepend: [
            SetLocaleAndGeo::class,
        ]);

        $middleware->alias([
            'jwt'        => JwtAuthenticate::class,
            'admin'      => \App\Http\Middleware\EnsureAdmin::class,
            'role'       => CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
