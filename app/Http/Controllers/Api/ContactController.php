<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\Tracking;
use App\Services\MailService;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function __construct(private MailService $mail) {}

    // ─── Formulaire de contact public ────────────────────────────────────────
    public function sendMessage(Request $request)
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:100'],
            'email'   => ['required', 'email', 'max:254'],
            'subject' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $this->mail->sendContactMessage(
            $data['name'],
            $data['email'],
            $data['subject'],
            $data['message'],
        );

        return response()->json(['message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.']);
    }

    public function whatsapp(Request $request, int $id)
    {
        $professional = Professional::findOrFail($id);
        $professional->increment('whatsapp_clicks');

        $clientName = strip_tags(trim($request->string('name')->toString()));
        $clientNeed = strip_tags(trim($request->string('need')->toString()));

        Tracking::create([
            'professional_id' => $professional->id,
            'type' => 'whatsapp_click',
            'ip' => $request->ip(),
            'city' => $request->attributes->get('geo.city', 'Casablanca'),
            'meta' => array_filter([
                'source'       => 'redirect',
                'client_name'  => $clientName ?: null,
                'client_need'  => $clientNeed ?: null,
            ]),
        ]);

        if ($clientName) {
            $need = $clientNeed ? " J'ai besoin de : {$clientNeed}." : '';
            $msg  = "Salam {$professional->name},{$need} Je m'appelle {$clientName} et j'ai trouvé votre profil sur Jobly. Pouvez-vous me faire un devis ? Merci !";
        } else {
            $msg = "Salam, j'ai trouvé votre profil sur Jobly et j'aimerais vous contacter pour un devis. Merci !";
        }

        return redirect()->away('https://wa.me/'.preg_replace('/\D/', '', $professional->phone).'?text='.urlencode($msg));
    }

    public function call(Request $request, int $id)
    {
        $professional = Professional::findOrFail($id);
        $professional->increment('calls');

        Tracking::create([
            'professional_id' => $professional->id,
            'type' => 'call',
            'ip' => $request->ip(),
            'city' => $request->attributes->get('geo.city', 'Casablanca'),
            'meta' => ['source' => 'api'],
        ]);

        return redirect()->away('tel:'.$professional->phone);
    }
}
