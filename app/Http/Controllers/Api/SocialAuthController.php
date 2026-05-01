<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class SocialAuthController extends Controller
{
    // ─── Unified email+password login (auto-detects role) ─────────────────────
    public function unifiedLogin(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email', 'max:254'],
            'password' => ['required', 'string', 'max:128'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        return $this->issueTokenResponse($user);
    }

    // ─── Google redirect ───────────────────────────────────────────────────────
    public function redirectToGoogle()
    {
        $url = Socialite::driver('google')
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    // ─── Google callback ───────────────────────────────────────────────────────
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            return redirect('/login?error=google_failed');
        }

        // Find by google_id, then by email, then create new client
        $user = User::where('google_id', $googleUser->getId())->first()
             ?? User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // Link google_id if not set yet
            if (! $user->google_id) {
                $user->update([
                    'google_id'      => $googleUser->getId(),
                    'google_picture' => $googleUser->getAvatar(),
                ]);
            }
        } else {
            // New user — register as client
            $user = User::create([
                'name'           => $googleUser->getName(),
                'email'          => $googleUser->getEmail(),
                'password'       => Hash::make(str()->random(32)),
                'role'           => 'client',
                'google_id'      => $googleUser->getId(),
                'google_picture' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
            ]);
        }

        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440);

        $cookieName = match ($user->role) {
            'admin'        => 'jwt_admin',
            'professional' => 'jwt_pro',
            default        => 'jwt_client',
        };

        $dashboard = match ($user->role) {
            'admin'        => '/dashboard/admin',
            'professional' => '/dashboard/professional',
            default        => '/dashboard/client',
        };

        return redirect($dashboard)
            ->cookie($cookieName, $token, $ttl, '/', null, false, true, false, 'Lax');
    }

    // ─── Shared: build JWT response + set cookie ───────────────────────────────
    private function issueTokenResponse(User $user)
    {
        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440);

        $cookieName = match ($user->role) {
            'admin'        => 'jwt_admin',
            'professional' => 'jwt_pro',
            default        => 'jwt_client',
        };

        $dashboard = match ($user->role) {
            'admin'        => '/dashboard/admin',
            'professional' => '/dashboard/professional',
            default        => '/dashboard/client',
        };

        return response()
            ->json([
                'token'     => $token,
                'role'      => $user->role,
                'dashboard' => $dashboard,
                'user'      => $user->only(['id', 'name', 'email', 'role']),
            ])
            ->cookie($cookieName, $token, $ttl, '/', null, true, true, false, 'Strict');
    }
}
