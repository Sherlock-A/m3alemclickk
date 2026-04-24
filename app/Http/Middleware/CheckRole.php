<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Role guard for web (Inertia) routes — complements the JWT middleware used
 * on API routes. Reads the role from the authenticated user resolved by JWT.
 *
 * Usage:  Route::middleware('role:admin')
 *         Route::middleware('role:professional,client')   (any of the listed roles)
 */
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user() ?? auth()->user();

        if (! $user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            return redirect()->route('client.login');
        }

        if (! empty($roles) && ! in_array($user->role, $roles, true)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Accès refusé.'], 403);
            }

            abort(403, 'Accès refusé.');
        }

        return $next($request);
    }
}
