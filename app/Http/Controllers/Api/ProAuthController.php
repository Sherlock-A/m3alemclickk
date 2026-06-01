<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
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
        // Honey-pot: bots fill this field, humans don't
        if ($request->filled('_hp')) {
            return response()->json(['message' => 'Inscription non autorisée.'], 422);
        }

        $data = $request->validate([
            'name'         => ['required', 'string', 'max:100', 'regex:/^[^<>{}\/\\\\]+$/u'],
            'email'        => ['required', 'email', 'max:254', 'unique:users,email'],
            'password'     => ['required', 'string', 'min:8', 'max:128', 'confirmed'],
            'phone'        => ['required', 'string', 'max:20'],
            'profession'   => ['required', 'string', 'max:100'],
            'main_city'    => ['required', 'string', 'max:100'],
            'category_ids'   => ['nullable', 'array', 'max:3'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'referral_code'  => ['nullable', 'string', 'max:20'],
        ]);

        $categoryIds  = $data['category_ids'] ?? [];
        $referralCode = strtoupper(trim($data['referral_code'] ?? ''));

        try {
            [$professional, $user] = DB::transaction(function () use ($data, $categoryIds, $referralCode) {
                $professional = Professional::create([
                    'name'               => $data['name'],
                    'phone'              => $data['phone'],
                    'profession'         => $data['profession'],
                    'category_id'        => $categoryIds[0] ?? null,
                    'main_city'          => $data['main_city'],
                    'is_available'       => false,
                    'verified'           => false,
                    'rating'             => 0,
                    'views'              => 0,
                    'whatsapp_clicks'    => 0,
                    'calls'              => 0,
                    'completed_missions' => 0,
                ]);

                // Générer un code parrainage unique (optionnel — ignoré si migration pas encore exécutée)
                try {
                    if (Schema::hasColumn('professionals', 'referral_code')) {
                        $letters = strtoupper(preg_replace('/[^a-zA-Z]/', '', $data['name']));
                        $prefix  = substr($letters, 0, 5) ?: 'PRO';
                        $code    = $prefix . '-' . str_pad((string) rand(1000, 9999), 4, '0', STR_PAD_LEFT);
                        while (Professional::where('referral_code', $code)->exists()) {
                            $code = $prefix . '-' . str_pad((string) rand(1000, 9999), 4, '0', STR_PAD_LEFT);
                        }
                        $professional->update(['referral_code' => $code]);

                        // Attribuer le parrain si le code fourni est valide
                        if ($referralCode !== '' && Schema::hasColumn('professionals', 'referred_by')) {
                            $referrer = Professional::where('referral_code', $referralCode)->first();
                            if ($referrer) {
                                $professional->update(['referred_by' => $referrer->id]);
                            }
                        }
                    }
                } catch (\Throwable $refErr) {
                    Log::warning('Referral code generation skipped: ' . $refErr->getMessage());
                }

                if (! empty($categoryIds)) {
                    $professional->categories()->sync($categoryIds);
                }

                $user = User::create([
                    'name'            => $data['name'],
                    'email'           => $data['email'],
                    'password'        => $data['password'],
                    'role'            => 'professional',
                    'status'          => 'pending',
                    'professional_id' => $professional->id,
                ]);

                return [$professional, $user];
            });
        } catch (\Throwable $e) {
            Log::error('Pro register failed: ' . $e->getMessage() . ' | ' . $e->getFile() . ':' . $e->getLine());
            return response()->json(['message' => 'Erreur lors de la création du compte. Veuillez réessayer.'], 500);
        }

        $token = JWTAuth::fromUser($user);
        $ttl   = config('jwt.ttl', 1440);

        // Notifier l'admin par email
        $this->notifyAdmin($professional, $user);

        return response()
            ->json([
                'token'   => $token,
                'user'    => $user->only(['id', 'name', 'email', 'role', 'professional_id']),
                'message' => 'Demande envoyée. Notre équipe examine votre profil sous 24-48h.',
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
        $user = auth()->user();

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role', 'professional_id', 'status']),
        ]);
    }
}
