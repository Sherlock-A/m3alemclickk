<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ in_array(app()->getLocale(), ['ar']) ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'Jobly' }}</title>
    <meta name="description" content="{{ $description ?? __('platform_description') }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
    @stack('head')
</head>
<body class="bg-slate-50 min-h-screen antialiased">

{{-- ===== NAVBAR ===== --}}
<nav class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

            {{-- Logo --}}
            <a href="{{ route('home') }}" class="flex items-center gap-2 text-xl font-black">
                <span class="text-2xl">🔧</span>
                Jobly
            </a>

            {{-- Desktop nav --}}
            <div class="hidden md:flex items-center gap-6 text-sm font-medium">
                <a href="{{ route('home') }}"
                   class="text-slate-600 hover:text-orange-500 transition {{ request()->routeIs('home') ? 'text-orange-500' : '' }}">
                    {{ __('home') }}
                </a>
                <a href="{{ route('professionals.index') }}"
                   class="text-slate-600 hover:text-orange-500 transition {{ request()->routeIs('professionals.*') ? 'text-orange-500' : '' }}">
                    {{ __('professionals') }}
                </a>
            </div>

            {{-- Right side --}}
            <div class="flex items-center gap-3">

                {{-- Language switcher --}}
                <div class="relative" x-data="{ open: false }">
                    <button @click="open = !open"
                            class="flex items-center gap-1 text-xs text-slate-600 hover:text-orange-500 border border-slate-200 rounded-lg px-2.5 py-1.5 transition">
                        @if(app()->getLocale() === 'ar') 🇲🇦 AR
                        @elseif(app()->getLocale() === 'en') 🇬🇧 EN
                        @else 🇫🇷 FR @endif
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div x-show="open" @click.away="open = false"
                         class="absolute right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 min-w-[130px] py-1">
                        <a href="{{ route('language.switch', 'fr') }}" class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 {{ app()->getLocale()==='fr'?'text-orange-500 font-semibold':'text-slate-700' }}">🇫🇷 Français</a>
                        <a href="{{ route('language.switch', 'ar') }}" class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 {{ app()->getLocale()==='ar'?'text-orange-500 font-semibold':'text-slate-700' }}">🇲🇦 العربية</a>
                        <a href="{{ route('language.switch', 'en') }}" class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 {{ app()->getLocale()==='en'?'text-orange-500 font-semibold':'text-slate-700' }}">🇬🇧 English</a>
                    </div>
                </div>

                @auth
                    @if(auth()->user()->isAdmin())
                        <div class="relative" x-data="{ open: false }">
                            <button @click="open = !open"
                                    class="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-orange-500 transition">
                                🛠 {{ __('admin') }}
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            <div x-show="open" @click.away="open = false"
                                 class="absolute right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 min-w-[200px] py-1">
                                <a href="{{ route('admin.dashboard') }}" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">📊 {{ __('admin_dashboard') }}</a>
                                <a href="{{ route('admin.approvals') }}" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">✅ {{ __('approvals') }}</a>
                                <a href="{{ route('admin.categories') }}" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">🗂️ {{ __('categories') }}</a>
                                <a href="{{ route('admin.cities') }}" class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">🏙️ {{ __('cities') }}</a>
                            </div>
                        </div>
                    @else
                        <a href="{{ route('pro.dashboard') }}"
                           class="text-sm font-medium text-slate-600 hover:text-orange-500 transition">
                            📊 {{ __('my_dashboard') }}
                        </a>
                    @endif
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button class="text-sm text-slate-500 hover:text-red-500 transition">{{ __('logout') }}</button>
                    </form>
                @else
                    <a href="{{ route('professionals.index') }}"
                       class="hidden sm:inline text-sm font-medium text-slate-600 hover:text-orange-500 transition">
                        🔍 {{ __('find_artisan') }}
                    </a>
                    <a href="{{ route('pro.login') }}"
                       class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm">
                        🔧 {{ __('pro_login') }}
                    </a>
                @endauth
            </div>
        </div>
    </div>
</nav>

{{-- Flash messages --}}
@if(session('status'))
<div class="max-w-2xl mx-auto mt-4 px-4">
    <div class="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm text-center">
        ✅ {{ session('status') }}
    </div>
</div>
@endif

{{-- Main --}}
<main>{{ $slot }}</main>

{{-- Footer --}}
<footer class="bg-slate-900 text-slate-400 mt-20 py-12">
    <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
            <div class="flex items-center gap-2 mb-3">
                <span class="text-xl">🔧</span>
                <span class="text-white font-black text-lg">Jobly</span>
            </div>
            <p class="text-sm leading-relaxed">{{ __('platform_description') }}</p>
        </div>
        <div>
            <h3 class="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{{ __('quick_links') }}</h3>
            <ul class="space-y-2 text-sm">
                <li><a href="{{ route('home') }}" class="hover:text-white transition">{{ __('home') }}</a></li>
                <li><a href="{{ route('professionals.index') }}" class="hover:text-white transition">{{ __('all_professionals') }}</a></li>
                <li><a href="{{ route('pro.login') }}" class="hover:text-white transition">{{ __('pro_login') }}</a></li>
                <li><a href="{{ route('pro.register') }}" class="hover:text-white transition">{{ __('pro_register') }}</a></li>
            </ul>
        </div>
        <div>
            <h3 class="text-white font-semibold mb-3 text-sm uppercase tracking-wide">{{ __('contact') }}</h3>
            <div class="space-y-2 text-sm">
                <p>📧 contact@jobly.ma</p>
                <p>📱 +212 6XX XXX XXX</p>
                <p>🌍 Maroc</p>
            </div>
        </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
        &copy; {{ date('Y') }} Jobly. {{ __('copyright') }}.
    </div>
</footer>

@livewireScripts
@stack('scripts')
</body>
</html>
