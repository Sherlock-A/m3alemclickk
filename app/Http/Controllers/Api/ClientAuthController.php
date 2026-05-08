<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class ClientAuthController extends Controller
{
    public function __construct(private MailService $mail) {}
    // ─── Connexion ────────────────────────────────────────────────────────────

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email', 'max:254'],
            'password' => ['required', 'string', 'max:128'],
        ]);

        $user = User::where('email', $data['email'])
                    ->where('role', 'client')
                    ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440);

        return response()
            ->json([
                'token' => $token,
                'user'  => $user->only(['id', 'name', 'email', 'role']),
            ])
            ->cookie('jwt_client', $token, $ttl, '/', null, true, true, false, 'Strict');
    }

    // ─── Inscription ──────────────────────────────────────────────────────────

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:100', 'regex:/^[^<>{}\/\\\\]+$/u'],
            'email'    => ['required', 'email', 'max:254', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:128', 'confirmed'],
            'phone'    => ['nullable', 'string', 'max:20'],
            'city'     => ['nullable', 'string', 'max:100'],
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => 'client',
        ]);

        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440);

        return response()
            ->json([
                'token'   => $token,
                'user'    => $user->only(['id', 'name', 'email', 'role']),
                'message' => 'Compte créé avec succès.',
            ], 201)
            ->cookie('jwt_client', $token, $ttl, '/', null, true, true, false, 'Strict');
    }

    // ─── Déconnexion ──────────────────────────────────────────────────────────

    public function logout()
    {
        try { JWTAuth::parseToken()->invalidate(); } catch (\Throwable) {}

        return response()
            ->json(['message' => 'Déconnecté avec succès.'])
            ->cookie('jwt_client', '', -1, '/', null, true, true, false, 'Strict');
    }

    // ─── Mot de passe oublié ──────────────────────────────────────────────────

    public function forgotPassword(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $data['email'])->where('role', 'client')->first();

        if (! $user) {
            return response()->json(['message' => 'Code envoyé si cet email est enregistré.']);
        }

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        Cache::put('pwd_reset_' . md5($data['email']), [
            'code'    => $code,
            'user_id' => $user->id,
        ], now()->addMinutes(10));

        $this->mail->sendVerificationCode(
            $user->email,
            $user->name,
            $code,
            now()->setTimezone('Africa/Casablanca')->format('H:i')
        );

        return response()->json(['message' => 'Code envoyé si cet email est enregistré.']);
    }

    // ─── Réinitialisation du mot de passe ─────────────────────────────────────

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'code'     => ['required', 'string', 'size:6'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $cached = Cache::get('pwd_reset_' . md5($data['email']));

        if (! $cached || $cached['code'] !== $data['code']) {
            return response()->json(['message' => 'Code invalide ou expiré.'], 422);
        }

        $user = User::find($cached['user_id']);

        if (! $user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->update(['password' => $data['password']]);

        Cache::forget('pwd_reset_' . md5($data['email']));

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }

    // ─── Utilisateur courant ──────────────────────────────────────────────────

    public function me()
    {
        return response()->json([
            'user' => auth()->user()->only(['id', 'name', 'email', 'phone', 'city', 'role']),
        ]);
    }

    // ─── Mise à jour du profil client ─────────────────────────────────────────

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'  => ['sometimes', 'string', 'max:100', 'regex:/^[^<>{}\/\\\\]+$/u'],
            'phone' => ['nullable', 'string', 'max:25'],
            'city'  => ['nullable', 'string', 'max:100'],
        ]);

        $user->update($data);

        return response()->json([
            'success' => true,
            'user'    => $user->fresh()->only(['id', 'name', 'email', 'phone', 'city', 'role']),
        ]);
    }
}
