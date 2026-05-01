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

        // CSP — skipped on local (Vite HMR uses dynamic ports) and on raw API calls
        if (! $request->is('api/*') && ! app()->environment('local')) {
            $nonce = base64_encode(random_bytes(16));
            $request->attributes->set('csp_nonce', $nonce);

            $response->headers->set(
                'Content-Security-Policy',
                implode('; ', [
                    "default-src 'self'",
                    // nonce-based; 'unsafe-inline' is ignored by modern browsers when nonce is present
                    "script-src 'self' 'nonce-{$nonce}' 'unsafe-inline'",
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                    "font-src 'self' https://fonts.gstatic.com data:",
                    "img-src 'self' data: https: blob: https://api.qrserver.com https://images.unsplash.com",
                    "worker-src 'self' blob:",
                    "frame-src https://www.openstreetmap.org",
                    "connect-src 'self' https://nominatim.openstreetmap.org https://accounts.google.com",
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
