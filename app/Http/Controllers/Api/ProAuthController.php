<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class ProAuthController extends Controller
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
                    ->where('role', 'professional')
                    ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        if ($user->status === 'pending') {
            return response()->json([
                'message' => 'Votre compte est en attente de validation par notre équipe (24-48h). Vous recevrez un email de confirmation.',
                'status'  => 'pending',
            ], 403);
        }

        if ($user->status === 'refused') {
            return response()->json([
                'message' => 'Votre demande d\'inscription a été refusée.' . ($user->rejection_reason ? ' Motif : ' . $user->rejection_reason : ''),
                'status'  => 'refused',
            ], 403);
        }

        if ($user->status === 'suspended') {
            return response()->json([
                'message' => 'Votre compte a été suspendu. Contactez le support.',
                'status'  => 'suspended',
            ], 403);
        }

        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440);

        return response()
            ->json([
                'token' => $token,
                'user'  => $user->only(['id', 'name', 'email', 'role', 'professional_id', 'status']),
            ])
            ->cookie('jwt_pro', $token, $ttl, '/', null, true, true, false, 'Strict');
    }

    // ─── Inscription ──────────────────────────────────────────────────────────

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'       => ['required', 'string', 'max:100'],
            'email'      => ['required', 'email', 'max:254', 'unique:users,email'],
            'password'   => ['required', 'string', 'min:8', 'max:128', 'confirmed'],
            'phone'      => ['required', 'string', 'max:20'],
            'profession' => ['required', 'string', 'max:100'],
            'main_city'  => ['required', 'string', 'max:100'],
        ]);

        try {
            [$professional, $user] = DB::transaction(function () use ($data) {
                $professional = Professional::create([
                    'name'               => $data['name'],
                    'phone'              => $data['phone'],
                    'profession'         => $data['profession'],
                    'main_city'          => $data['main_city'],
                    'is_available'       => false,
                    'verified'           => false,
                    'rating'             => 0,
                    'views'              => 0,
                    'whatsapp_clicks'    => 0,
                    'calls'              => 0,
                    'completed_missions' => 0,
                ]);

                $user = User::create([
                    'name'            => $data['name'],
                    'email'           => $data['email'],
                    'password'        => $data['password'],
                    'role'            => 'professional',
                    'status'          => 'pending',  // requires admin approval
                    'professional_id' => $professional->id,
                ]);

                return [$professional, $user];
            });
        } catch (\Throwable $e) {
            Log::error('Pro register failed: ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de la création du compte. Veuillez réessayer.'], 500);
        }

        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440);

        // Notifier l'admin par email
        $this->notifyAdmin($professional, $user);

        return response()
            ->json([
                'token'                => $token,
                'user'                 => $user->only(['id', 'name', 'email', 'role', 'professional_id']),
                'needs_verification'   => true,
                'message'              => 'Compte créé. Vérifiez votre email pour activer votre compte.',
            ], 201)
            ->cookie('jwt_pro', $token, $ttl, '/', null, true, true, false, 'Strict');
    }

    private function notifyAdmin(Professional $professional, User $user): void
    {
        $this->mail->sendNewProNotification(
            $professional->name,
            $user->email,
            $professional->phone ?? '',
            $professional->profession,
            $professional->main_city
        );
    }

    // ─── Déconnexion ──────────────────────────────────────────────────────────

    public function logout()
    {
        try { JWTAuth::parseToken()->invalidate(); } catch (\Throwable) {}

        return response()
            ->json(['message' => 'Déconnecté avec succès.'])
            ->cookie('jwt_pro', '', -1, '/', null, true, true, false, 'Strict');
    }

    // ─── Mot de passe oublié ──────────────────────────────────────────────────

    public function forgotPassword(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $data['email'])->where('role', 'professional')->first();

        // Toujours retourner succès (sécurité : ne pas révéler si l'email existe)
        if (! $user) {
            return response()->json([
                'message' => 'Si cet email est enregistré, un lien de réinitialisation a été envoyé.',
            ]);
        }

        // Génère un token sécurisé
        $token = Str::random(64);

        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        // URL de réinitialisation
        $resetUrl = config('app.url')
            . '/pro/reset-password?token=' . $token
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
            'token'                 => ['required', 'string'],
            'email'                 => ['required', 'email'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $record = DB::table('password_reset_tokens')
                    ->where('email', $data['email'])
                    ->first();

        if (! $record || ! Hash::check($data['token'], $record->token)) {
            return response()->json(['message' => 'Token invalide ou expiré.'], 422);
        }

        // Vérifie l'expiration (60 minutes)
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
            return response()->json(['message' => 'Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.'], 422);
        }

        $user = User::where('email', $data['email'])->where('role', 'professional')->first();

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
        $user = auth()->user();

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role', 'professional_id']),
        ]);
    }
}
