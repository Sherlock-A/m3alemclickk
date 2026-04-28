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
    <meta name="apple-mobile-web-app-title" content="M3allemClick">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">

    {{-- Open Graph defaults --}}
    <meta property="og:site_name" content="M3allemClick">
    <meta property="og:locale" content="fr_MA">

    {{-- Google OAuth Client ID --}}
    <script>window.__GOOGLE_CLIENT_ID__ = "{{ config('services.google.client_id', '') }}";</script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    {{-- PWA Service Worker registration --}}
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/sw.js').catch(function () {});
        });
      }
    </script>
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
    @inertia
</body>
</html>
