<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function mockLogin(Request $request)
    {
        // Disabled in production — local dev only
        abort_if(! app()->environment('local'), 403, 'Not available in production.');

        $data = $request->validate([
            'email' => ['required', 'email'],
            'role' => ['required', 'in:admin,professional'],
        ]);

        $user = User::firstOrCreate(
            ['email' => $data['email']],
            [
                'name'     => $data['role'] === 'admin' ? 'Admin Jobly' : 'Professional Demo',
                'password' => \Illuminate\Support\Str::random(32),
                'role'     => $data['role'],
            ]
        );

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    public function checkEmail(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email']]);
        $isAdmin = User::where('email', $data['email'])->where('role', 'admin')->exists();
        return response()->json(['is_admin' => $isAdmin]);
    }

    public function adminLogin(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email', 'max:254'],
            'password' => ['required', 'string', 'max:128'],
        ]);

        $user = User::where('email', $data['email'])
                    ->where('role', 'admin')
                    ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440); // minutes

        return response()
            ->json([
                'token' => $token,
                'user'  => $user->only(['id', 'name', 'email', 'role']),
            ])
            ->cookie('jwt_admin', $token, $ttl, '/', null, true, true, false, 'Strict');
    }

    public function adminLogout(Request $request)
    {
        try { JWTAuth::parseToken()->invalidate(); } catch (\Throwable) {}

        return response()
            ->json(['message' => 'Déconnecté.'])
            ->cookie('jwt_admin', '', -1, '/', null, true, true, false, 'Strict');
    }

    // Returns the currently authenticated actor (any role) from httpOnly cookie
    public function status(Request $request)
    {
        $cookieMap = [
            'jwt_admin'  => ['role' => 'admin',        'dashboard' => '/dashboard/admin',        'label' => 'Dashboard Admin'],
            'jwt_pro'    => ['role' => 'professional',  'dashboard' => '/dashboard/professional', 'label' => 'Mon Dashboard'],
            'jwt_client' => ['role' => 'client',        'dashboard' => '/dashboard/client',       'label' => 'Mon Espace'],
        ];

        foreach ($cookieMap as $cookieName => $meta) {
            $token = $request->cookie($cookieName);
            if (! $token) continue;

            try {
                $request->headers->set('Authorization', 'Bearer ' . $token);
                $user = JWTAuth::parseToken()->authenticate();
                if ($user && $user->role === $meta['role']) {
                    return response()->json([
                        'authenticated' => true,
                        'role'          => $meta['role'],
                        'dashboard'     => $meta['dashboard'],
                        'label'         => $meta['label'],
                        'name'          => $user->name,
                    ]);
                }
            } catch (\Throwable) {
                // Invalid/expired token — clear the stale cookie
                return response()
                    ->json(['authenticated' => false])
                    ->cookie($cookieName, '', -1, '/', null, true, true, false, 'Strict');
            }
        }

        return response()->json(['authenticated' => false]);
    }
}
