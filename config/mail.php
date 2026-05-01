<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    | log   → emails dans storage/logs/laravel.log (développement, aucun setup)
    | resend → Resend.com API (prod, 3000/mois gratuits, 1 clé API)
    | smtp  → Gmail SMTP avec App Password (500/jour gratuits)
    */

    'default' => env('MAIL_MAILER', 'log'),

    'mailers' => [

        // ── Mode log (dev, aucune config requise) ─────────────────────────────
        'log' => [
            'transport' => 'log',
            'channel'   => env('MAIL_LOG_CHANNEL'),
        ],

        // ── Resend.com (prod recommandée — 3000/mois gratuits) ────────────────
        // 1. Créer compte sur https://resend.com
        // 2. Ajouter un domaine ou utiliser "onboarding@resend.dev" pour tester
        // 3. API Keys → Create → copier dans RESEND_API_KEY
        'resend' => [
            'transport' => 'resend',
        ],

        // ── Gmail SMTP (alternative — 500/jour gratuits) ──────────────────────
        // 1. Activer 2FA sur votre compte Google
        // 2. https://myaccount.google.com/apppasswords
        // 3. Créer mot de passe pour "Autre application" → nom "M3allemClick"
        // 4. Copier le mot de passe 16 caractères dans GMAIL_APP_PASSWORD
        'gmail' => [
            'transport'  => 'smtp',
            'host'       => 'smtp.gmail.com',
            'port'       => 587,
            'encryption' => 'tls',
            'username'   => env('GMAIL_ADDRESS'),
            'password'   => env('GMAIL_APP_PASSWORD'),
            'timeout'    => null,
        ],

        // ── Mailtrap sandbox (tests SMTP réels) ───────────────────────────────
        'mailtrap' => [
            'transport'  => 'smtp',
            'host'       => 'sandbox.smtp.mailtrap.io',
            'port'       => 2525,
            'encryption' => 'tls',
            'username'   => env('MAILTRAP_USERNAME'),
            'password'   => env('MAILTRAP_PASSWORD'),
            'timeout'    => null,
        ],

    ],

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'noreply@m3allemclick.ma'),
        'name'    => env('MAIL_FROM_NAME', 'M3allemClick'),
    ],

];
