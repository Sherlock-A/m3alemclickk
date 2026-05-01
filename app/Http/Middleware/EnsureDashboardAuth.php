<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Server-side JWT guard for dashboard routes.
 * Usage: ->middleware('dashboard.auth:admin')
 *        ->middleware('dashboard.auth:professional')
 *        ->middleware('dashboard.auth:client')
 */
class EnsureDashboardAuth
{
    private array $cookieMap = [
        'jwt_admin'  => 'admin',
        'jwt_pro'    => 'professional',
        'jwt_client' => 'client',
    ];

    public function handle(Request $request, Closure $next, string ...$allowedRoles): Response
    {
        foreach ($this->cookieMap as $cookieName => $role) {
            if (!empty($allowedRoles) && !in_array($role, $allowedRoles, true)) {
                continue;
            }

            $token = $request->cookie($cookieName);
            if (!$token) continue;

            try {
                $request->headers->set('Authorization', 'Bearer ' . $token);
                $user = JWTAuth::parseToken()->authenticate();

                if ($user && $user->role === $role) {
                    return $next($request);
                }
            } catch (\Throwable) {
                return redirect('/login')
                    ->cookie($cookieName, '', -1, '/', null, true, true, false, 'Strict');
            }
        }

        return redirect('/login');
    }
}
