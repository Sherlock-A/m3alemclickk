<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        // Suppress PHP version fingerprinting at the SAPI level
        header_remove('X-Powered-By');

        // Generate nonce BEFORE rendering so Blade can use it via request()->attributes
        $usesCsp = ! $request->is('api/*') && ! app()->environment('local');
        if ($usesCsp) {
            $nonce = base64_encode(random_bytes(16));
            $request->attributes->set('csp_nonce', $nonce);
        }

        $response = $next($request);

        // Remove X-Powered-By set by PHP or framework at response level
        $response->headers->remove('X-Powered-By');
        $response->headers->remove('Server');

        // Universal headers
        $response->headers->set('X-Content-Type-Options',  'nosniff');
        $response->headers->set('X-Frame-Options',         'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection',        '1; mode=block');
        $response->headers->set('Referrer-Policy',         'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy',      'camera=(), microphone=(), geolocation=(self), payment=(), usb=(), bluetooth=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-site');

        // HSTS (only over HTTPS — Railway/production enforces TLS)
        if ($request->isSecure() || app()->environment('production')) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        // CSP — nonce was generated before rendering so Blade inline scripts carry it
        if ($usesCsp) {
            $response->headers->set(
                'Content-Security-Policy',
                implode('; ', [
                    "default-src 'self'",
                    "script-src 'self' 'nonce-{$nonce}' https://accounts.google.com https://www.gstatic.com",
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                    "font-src 'self' https://fonts.gstatic.com data:",
                    "img-src 'self' data: https: blob:",
                    "worker-src 'self' blob:",
                    "frame-src https://www.openstreetmap.org",
                    "connect-src 'self' https://nominatim.openstreetmap.org https://accounts.google.com https://oauth2.googleapis.com",
                    "object-src 'none'",
                    "base-uri 'self'",
                    "form-action 'self' https://accounts.google.com",
                    "upgrade-insecure-requests",
                ])
            );
        }

        return $response;
    }
}
