<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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
            'name'     => ['required', 'string', 'max:100'],
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
                'token'              => $token,
                'user'               => $user->only(['id', 'name', 'email', 'role']),
                'needs_verification' => true,
                'message'            => 'Compte créé. Vérifiez votre email pour activer votre compte.',
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
            return response()->json([
                'message' => 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        $resetUrl = config('app.url')
            . '/client/reset-password?token=' . $token
            . '&email=' . urlencode($user->email);

        $this->mail->sendPasswordReset(
            $user->email,
            $user->name,
            $resetUrl,
            'Réinitialisation de votre mot de passe — M3allemClick'
        );

        return response()->json([
            'message' => 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.',
        ]);
    }

    // ─── Réinitialisation du mot de passe ─────────────────────────────────────

    public function resetPassword(Request $request)
    {
        $data = $request->validate([
            'token'    => ['required', 'string'],
            'email'    => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $record = DB::table('password_reset_tokens')
                    ->where('email', $data['email'])
                    ->first();

        if (! $record || ! Hash::check($data['token'], $record->token)) {
            return response()->json(['message' => 'Token invalide ou expiré.'], 422);
        }

        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
            return response()->json(['message' => 'Le lien a expiré. Veuillez en demander un nouveau.'], 422);
        }

        $user = User::where('email', $data['email'])->where('role', 'client')->first();

        if (! $user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->update(['password' => $data['password']]);

        DB::table('password_reset_tokens')->where('email', $data['email'])->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.']);
    }

    // ─── Utilisateur courant ──────────────────────────────────────────────────

    public function me()
    {
        return response()->json([
            'user' => auth()->user()->only(['id', 'name', 'email', 'role']),
        ]);
    }
}
