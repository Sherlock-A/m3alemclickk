<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\Tracking;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function whatsapp(Request $request, int $id)
    {
        $professional = Professional::findOrFail($id);
        $professional->increment('whatsapp_clicks');

        Tracking::create([
            'professional_id' => $professional->id,
            'type' => 'whatsapp_click',
            'ip' => $request->ip(),
            'city' => $request->attributes->get('geo.city', 'Casablanca'),
            'meta' => ['source' => 'redirect'],
        ]);

        $msg = 'Salam, j\'ai trouvé votre profil sur M3allemClick et j\'aimerais vous contacter pour un devis. Merci !';
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

        return response()->json([
            'phone' => $professional->phone,
            'link' => 'tel:'.$professional->phone,
        ]);
    }
}
