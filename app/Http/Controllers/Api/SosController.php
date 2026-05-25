<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\PushController;
use App\Jobs\SendMailJob;
use App\Models\Professional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SosController extends Controller
{
    public function send(Request $request): \Illuminate\Http\JsonResponse
    {
        // Rate limit: 3 SOS requests per IP per hour
        $key = 'sos_' . $request->ip();
        if (Cache::get($key, 0) >= 3) {
            return response()->json(['message' => 'Trop de demandes. Réessayez dans une heure.'], 429);
        }
        Cache::put($key, (Cache::get($key, 0) + 1), now()->addHour());

        $data = $request->validate([
            'city'        => ['required', 'string', 'max:100'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'message'     => ['nullable', 'string', 'max:300'],
            'client_name' => ['nullable', 'string', 'max:100'],
        ]);

        $city        = strip_tags(trim($data['city']));
        $message     = isset($data['message']) ? strip_tags(trim($data['message'])) : null;
        $clientName  = isset($data['client_name']) ? strip_tags(trim($data['client_name'])) : 'Un client';

        // Find available pros in city (and optionally category)
        $query = Professional::with('user')
            ->approved()
            ->where('is_available', true)
            ->whereRaw('LOWER(main_city) LIKE ?', [mb_strtolower($city, 'UTF-8')]);

        if (! empty($data['category_id'])) {
            $query->where('category_id', $data['category_id']);
        }

        $pros = $query->limit(20)->get();

        $notified = 0;

        foreach ($pros as $pro) {
            $proUser = $pro->user;
            if (! $proUser) continue;

            $urgentText = $message
                ? "Message : {$message}"
                : "Un client cherche un {$pro->profession} disponible maintenant.";

            // Push notification
            try {
                PushController::sendToUser(
                    $proUser->id,
                    "🚨 SOS Urgent — {$city}",
                    "{$clientName} a besoin de vous maintenant ! {$urgentText}",
                    '/dashboard/professional',
                );
            } catch (\Throwable) {}

            // Email
            if ($proUser->email) {
                $mailer = config('mail.default', 'log');
                $dashboardUrl = config('app.url') . '/dashboard/professional';
                SendMailJob::dispatch(
                    $mailer,
                    'emails.sos-alert',
                    compact('pro', 'clientName', 'city', 'message', 'dashboardUrl'),
                    $proUser->email,
                    $pro->name,
                    "🚨 SOS Urgent à {$city} — Répondez maintenant !",
                );
            }

            $notified++;
        }

        return response()->json([
            'success'  => true,
            'notified' => $notified,
            'message'  => $notified > 0
                ? "{$notified} artisan" . ($notified > 1 ? 's' : '') . " alerté" . ($notified > 1 ? 's' : '') . " à {$city} !"
                : "Aucun artisan disponible à {$city} pour le moment. Essayez une ville voisine.",
        ]);
    }
}
