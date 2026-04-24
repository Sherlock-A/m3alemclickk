<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    private string $file = 'settings.json';

    private array $defaults = [
        'platform_name'      => 'M3allemClick',
        'contact_email'      => 'contact@m3allemclick.ma',
        'contact_phone'      => '+212 6XX XXX XXX',
        'address'            => 'Casablanca, Maroc',
        'whatsapp_message'   => 'Bonjour, je vous contacte depuis M3allemClick pour votre service.',
        'footer_about'       => 'La plateforme de mise en relation entre clients et artisans au Maroc.',
        'footer_links'       => [
            ['label' => 'Accueil', 'url' => '/'],
            ['label' => 'Professionnels', 'url' => '/professionals'],
            ['label' => 'Inscription pro', 'url' => '/pro/register'],
        ],
        'footer_social'      => [
            'facebook'  => '',
            'instagram' => '',
            'whatsapp'  => '',
        ],
        'footer_copyright'   => '© 2026 M3allemClick. Tous droits réservés.',
    ];

    public function show()
    {
        $settings = $this->load();
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'platform_name'    => ['sometimes', 'string', 'max:100'],
            'contact_email'    => ['sometimes', 'email'],
            'contact_phone'    => ['sometimes', 'string', 'max:30'],
            'address'          => ['sometimes', 'string', 'max:200'],
            'whatsapp_message' => ['sometimes', 'string', 'max:500'],
            'footer_about'     => ['sometimes', 'string', 'max:500'],
            'footer_links'     => ['sometimes', 'array'],
            'footer_social'    => ['sometimes', 'array'],
            'footer_copyright' => ['sometimes', 'string', 'max:200'],
        ]);

        $current = $this->load();
        $merged  = array_merge($current, $data);
        Storage::put($this->file, json_encode($merged, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        return response()->json($merged);
    }

    private function load(): array
    {
        if (! Storage::exists($this->file)) {
            return $this->defaults;
        }
        $json = json_decode(Storage::get($this->file), true);
        return is_array($json) ? array_merge($this->defaults, $json) : $this->defaults;
    }
}
