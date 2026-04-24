<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ in_array(app()->getLocale(), ['ar', 'tzm']) ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {{-- Inertia will inject <title> and <meta> via <Head> components --}}
    @inertiaHead
    {{-- Fallback title + description if no Inertia Head renders --}}
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{{ url()->current() }}">
    {{-- Google OAuth Client ID --}}
    <script>window.__GOOGLE_CLIENT_ID__ = "{{ config('services.google.client_id', '') }}";</script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
    @inertia
</body>
</html>
