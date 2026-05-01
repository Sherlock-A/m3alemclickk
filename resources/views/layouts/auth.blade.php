<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ ($title ?? 'Connexion') . ' — Jobly' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50 flex flex-col">

    {{-- Language switcher top-right --}}
    <div class="absolute top-4 right-4 z-10" x-data="{ open: false }">
        <button @click="open = !open"
                class="flex items-center gap-1 text-xs text-slate-500 hover:text-orange-500 border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white/80 backdrop-blur transition">
            @if(app()->getLocale() === 'ar') 🇲🇦 AR
            @elseif(app()->getLocale() === 'en') 🇬🇧 EN
            @else 🇫🇷 FR @endif
        </button>
        <div x-show="open" @click.away="open = false"
             class="absolute right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 min-w-[130px] py-1">
            <a href="{{ route('language.switch', 'fr') }}" class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700">🇫🇷 Français</a>
            <a href="{{ route('language.switch', 'ar') }}" class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700">🇲🇦 العربية</a>
            <a href="{{ route('language.switch', 'en') }}" class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 text-slate-700">🇬🇧 English</a>
        </div>
    </div>

    {{-- Centered card --}}
    <div class="flex-1 flex items-center justify-center px-4 py-12">
        <div class="w-full max-w-md">
            {{-- Logo --}}
            <div class="text-center mb-8">
                <a href="{{ route('home') }}" class="inline-flex items-center gap-2 text-2xl font-black">
                    <span>🔧</span>
                    Jobly
                </a>
            </div>

            {{-- Card --}}
            <div class="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                {{ $slot }}
            </div>

            {{-- Back to home --}}
            <p class="text-center mt-6 text-sm text-slate-400">
                <a href="{{ route('home') }}" class="hover:text-orange-500 transition">← {{ __('home') }}</a>
            </p>
        </div>
    </div>

    @livewireScripts
</body>
</html>
