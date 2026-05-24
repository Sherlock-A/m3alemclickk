<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PushSubscription;
use Illuminate\Http\Request;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;

class PushController extends Controller
{
    public function vapidPublicKey(): \Illuminate\Http\JsonResponse
    {
        return response()->json(['publicKey' => config('services.webpush.public_key')]);
    }

    public function subscribe(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate([
            'endpoint'         => ['required', 'string', 'max:2000'],
            'keys.p256dh'      => ['required', 'string'],
            'keys.auth'        => ['required', 'string'],
            'content_encoding' => ['nullable', 'string', 'in:aesgcm,aes128gcm'],
        ]);

        PushSubscription::updateOrCreate(
            ['user_id' => $request->user()->id, 'endpoint' => $data['endpoint']],
            [
                'public_key'       => $data['keys']['p256dh'],
                'auth_token'       => $data['keys']['auth'],
                'content_encoding' => $data['content_encoding'] ?? 'aesgcm',
            ]
        );

        return response()->json(['success' => true]);
    }

    public function unsubscribe(Request $request): \Illuminate\Http\JsonResponse
    {
        $data = $request->validate(['endpoint' => ['required', 'string', 'max:2000']]);

        PushSubscription::where('user_id', $request->user()->id)
            ->where('endpoint', $data['endpoint'])
            ->delete();

        return response()->json(['success' => true]);
    }

    // ── Static helper: send push to all subscriptions of a user ───────────────
    public static function sendToUser(int $userId, string $title, string $body, string $url = '/'): void
    {
        $subs = PushSubscription::where('user_id', $userId)->get();
        if ($subs->isEmpty()) return;

        $auth = [
            'VAPID' => [
                'subject'    => config('services.webpush.subject'),
                'publicKey'  => config('services.webpush.public_key'),
                'privateKey' => config('services.webpush.private_key'),
            ],
        ];

        $webPush = new WebPush($auth);
        $webPush->setReuseVAPIDHeaders(true);

        $payload = json_encode(compact('title', 'body', 'url'));

        foreach ($subs as $sub) {
            $subscription = Subscription::create([
                'endpoint'        => $sub->endpoint,
                'publicKey'       => $sub->public_key,
                'authToken'       => $sub->auth_token,
                'contentEncoding' => $sub->content_encoding,
            ]);
            $webPush->queueNotification($subscription, $payload);
        }

        foreach ($webPush->flush() as $report) {
            if ($report->isSubscriptionExpired()) {
                PushSubscription::where('endpoint', $report->getRequest()->getUri()->__toString())->delete();
            }
        }
    }
}
