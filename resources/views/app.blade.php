<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {{-- Inertia injects <title> and <meta> via <Head> components --}}
    @inertiaHead
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- PWA --}}
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#f97316">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="Jobly">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" href="/icons/icon-192.png">

    {{-- Open Graph defaults --}}
    <meta property="og:site_name" content="Jobly">
    <meta property="og:locale" content="fr_MA">
    <meta property="og:image" content="{{ config('app.url') }}/icons/icon-512.png">
    <meta property="og:image:width" content="512">
    <meta property="og:image:height" content="512">

    {{-- Twitter Card defaults --}}
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@joblyme">
    <meta name="twitter:image" content="{{ config('app.url') }}/icons/icon-512.png">

    {{-- Google OAuth Client ID --}}
    <script nonce="{{ request()->attributes->get('csp_nonce', '') }}">window.__GOOGLE_CLIENT_ID__ = "{{ config('services.google.client_id', '') }}";</script>
    {{-- Fonts: Latin (Jobly brand) + Arabic (Cairo) --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=DM+Sans:wght@400;500&family=Cairo:wght@400;600;700;800&family=Noto+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    {{-- PWA Service Worker registration --}}
    <script nonce="{{ request()->attributes->get('csp_nonce', '') }}">
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
    {{-- Skip to main content (accessibility) --}}
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:rounded-lg focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white focus:font-bold focus:shadow-lg">
        Aller au contenu principal
    </a>
    <div id="main-content">
        @inertia
    </div>
</body>
</html>
