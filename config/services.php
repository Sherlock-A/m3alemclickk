<?php

return [

    'meta' => [
        'whatsapp_token'  => env('META_WHATSAPP_TOKEN'),
        'phone_number_id' => env('META_PHONE_NUMBER_ID'),
    ],

    'google' => [
        'client_id'     => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect'      => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
    ],

    // Google Gemini — GRATUIT : https://aistudio.google.com/app/apikey
    'gemini' => [
        'key' => env('GEMINI_API_KEY', ''),
    ],

    // Anthropic Claude — payant (optionnel)
    'anthropic' => [
        'key' => env('ANTHROPIC_API_KEY', ''),
    ],

    'webpush' => [
        'public_key'  => env('VAPID_PUBLIC_KEY', ''),
        'private_key' => env('VAPID_PRIVATE_KEY', ''),
        'subject'     => env('VAPID_SUBJECT', 'mailto:contact@jobly.ma'),
    ],

];
