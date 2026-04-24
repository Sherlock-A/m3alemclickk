<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Throwable;

class JwtAuthenticate
{
    public function handle(Request $request, Closure $next, ?string $role = null): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (Throwable) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($role && $user->role !== $role) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
