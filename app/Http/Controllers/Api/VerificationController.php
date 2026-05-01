<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class VerificationController extends Controller
{
    private const TTL     = 10;  // minutes
    private const MAX_TRY = 5;   // tentatives max

    public function __construct(private MailService $mail) {}

    // ── Envoyer un code OTP ──────────────────────────────────────────────────

    public function sendCode(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $user = User::findOrFail($data['user_id']);

        // Anti-spam : max 3 envois par 10 minutes
        $spamKey = "verify_spam_{$user->id}";
        $sends   = Cache::get($spamKey, 0);
        if ($sends >= 3) {
            return response()->json([
                'message' => 'Trop de demandes. Attendez quelques minutes.',
            ], 429);
        }
        Cache::put($spamKey, $sends + 1, now()->addMinutes(10));

        // Générer un code 6 chiffres
        $code    = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $sentAt  = now()->setTimezone('Africa/Casablanca')->format('H:i');

        Cache::put("verify_code_{$user->id}", [
            'code'  => $code,
            'tries' => 0,
        ], now()->addMinutes(self::TTL));

        $result = $this->mail->sendVerificationCode($user->email, $user->name, $code, $sentAt);

        $response = [
            'sent'    => true,
            'message' => "Code envoyé à {$this->maskEmail($user->email)}",
            'preview' => $this->maskEmail($user->email),
        ];

        // En mode local : afficher le code pour faciliter les tests
        if (app()->environment('local')) {
            $response['dev_code'] = $code;
            if (! $result['ok']) {
                $response['dev_note'] = "Email non envoyé (mode log) — utilisez dev_code pour tester";
            }
        } elseif (! $result['ok']) {
            return response()->json([
                'message' => 'Impossible d\'envoyer l\'email. Réessayez dans quelques instants.',
            ], 500);
        }

        return response()->json($response);
    }

    // ── Vérifier le code soumis ───────────────────────────────────────────────

    public function checkCode(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'code'    => ['required', 'string', 'size:6'],
        ]);

        $user     = User::findOrFail($data['user_id']);
        $cacheKey = "verify_code_{$user->id}";
        $stored   = Cache::get($cacheKey);

        if (! $stored) {
            return response()->json([
                'message' => 'Code expiré ou introuvable. Cliquez sur "Renvoyer le code".',
            ], 422);
        }

        if ($stored['tries'] >= self::MAX_TRY) {
            Cache::forget($cacheKey);
            return response()->json([
                'message' => 'Trop de tentatives. Demandez un nouveau code.',
            ], 429);
        }

        if ($stored['code'] !== $data['code']) {
            $stored['tries']++;
            Cache::put($cacheKey, $stored, now()->addMinutes(self::TTL));
            $left = self::MAX_TRY - $stored['tries'];
            return response()->json([
                'message' => "Code incorrect — {$left} tentative(s) restante(s).",
            ], 422);
        }

        // ✅ Code correct
        Cache::forget($cacheKey);
        Cache::forget("verify_spam_{$user->id}");
        $user->update(['email_verified_at' => now()]);

        return response()->json([
            'verified' => true,
            'message'  => 'Compte vérifié avec succès !',
        ]);
    }

    // ── Renvoyer le code ─────────────────────────────────────────────────────

    public function resendCode(Request $request)
    {
        // Réinitialise le spam counter pour permettre le renvoi
        $data = $request->validate(['user_id' => ['required', 'integer', 'exists:users,id']]);
        Cache::forget("verify_spam_{$data['user_id']}");

        return $this->sendCode($request);
    }

    // ── Masquage email (ex: o***i@gmail.com) ─────────────────────────────────

    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email, 2);
        $masked = substr($local, 0, 1)
            . str_repeat('*', max(2, strlen($local) - 2))
            . substr($local, -1);
        return "{$masked}@{$domain}";
    }
}
