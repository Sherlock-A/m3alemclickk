<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleAndGeo
{
    public function handle(Request $request, Closure $next): Response
    {
        $supported = ['fr', 'ar', 'en'];
        $locale = session('locale')
            ?? $request->query('lang')
            ?? $request->cookie('lang')
            ?? $this->localeFromIp($request)
            ?? config('app.locale');

        if (! in_array($locale, $supported, true)) {
            $locale = config('app.locale');
        }

        app()->setLocale($locale);

        $request->attributes->set('geo', [
            'ip' => $request->ip(),
            'country' => $request->header('CF-IPCountry', 'MA'),
            'city' => $request->header('X-City', 'Casablanca'),
            'locale' => $locale,
            'rtl' => in_array($locale, ['ar', 'tzm'], true),
        ]);

        $response = $next($request);
        $response->headers->set('Content-Language', $locale);

        if (method_exists($response, 'cookie')) {
            $response->cookie('lang', $locale, 60 * 24 * 30);
        }

        return $response;
    }

    protected function localeFromIp(Request $request): ?string
    {
        $country = $request->header('CF-IPCountry', 'MA');
        if ($country === 'MA') {
            return $request->header('X-Locale', 'fr');
        }

        return 'en';
    }
}
