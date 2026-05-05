<?php

use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProfessionalPageController;
use App\Http\Controllers\Api\SocialAuthController;
use App\Models\Category;
use App\Models\City;
use App\Models\Professional;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Pages publiques ───────────────────────────────────────────────────────────
Route::get('/', HomeController::class)->name('home');
Route::get('/professionals', [ProfessionalPageController::class, 'index'])->name('professionals.index');
Route::get('/professionals/{slug}', [ProfessionalPageController::class, 'show'])->name('professionals.show');

// ─── Pages SEO ville / catégorie (/professionnels/casablanca/plombier) ─────────
Route::get('/professionnels/{city}',           [ProfessionalPageController::class, 'byCity'])->name('professionals.city');
Route::get('/professionnels/{city}/{category}', [ProfessionalPageController::class, 'byCity'])->name('professionals.city.category');
Route::get('/how-it-works', fn () => Inertia::render('Frontend/HowItWorksPage'))->name('how-it-works');
Route::get('/contact',      fn () => Inertia::render('Frontend/ContactPage'))->name('contact');

// ─── Page de connexion unifiée ─────────────────────────────────────────────────
Route::get('/login', fn () => Inertia::render('Auth/UnifiedLoginPage'))->name('login');

// ─── Anciennes URLs → redirection vers /login ──────────────────────────────────
Route::redirect('/client/login', '/login', 301)->name('client.login');
Route::redirect('/admin/login',  '/login', 301)->name('admin.login');
Route::redirect('/pro/login',    '/login', 301)->name('pro.login');

// ─── Google OAuth callback (web, reçoit le code Google) ───────────────────────
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// ─── Inscription + mot de passe oublié ────────────────────────────────────────
Route::get('/pro/register',        fn () => Inertia::render('Auth/ProRegisterPage'))->name('pro.register');
Route::get('/client/register',     fn () => Inertia::render('Auth/ClientRegisterPage'))->name('client.register');
Route::get('/pro/forgot-password', fn () => Inertia::render('Auth/ForgotPasswordPage'))->name('pro.forgot-password');
Route::get('/pro/reset-password',  fn () => Inertia::render('Auth/ResetPasswordPage', [
    'token' => request('token'),
    'email' => request('email'),
]))->name('pro.reset-password');
Route::get('/client/forgot-password', fn () => Inertia::render('Auth/ForgotPasswordPage', ['role' => 'client']))->name('client.forgot-password');
Route::get('/client/reset-password',  fn () => Inertia::render('Auth/ResetPasswordPage', [
    'token' => request('token'),
    'email' => request('email'),
    'role'  => 'client',
]))->name('client.reset-password');

// ─── Dashboards protégés (JWT vérifié côté serveur) ───────────────────────────
Route::get('/dashboard/professional', fn () => Inertia::render('Dashboard/ProfessionalDashboardPage'))
    ->middleware('dashboard.auth:professional')
    ->name('dashboard.professional');

Route::get('/dashboard/client', fn () => Inertia::render('Dashboard/ClientDashboardPage'))
    ->middleware('dashboard.auth:client')
    ->name('dashboard.client');

Route::get('/dashboard/admin', fn () => Inertia::render('Dashboard/AdminDashboardPage'))
    ->middleware('dashboard.auth:admin')
    ->name('dashboard.admin');

// ─── Sitemap XML ───────────────────────────────────────────────────────────────
Route::get('/sitemap.xml', function () {
    $xml = Cache::remember('sitemap_xml', 3600, function () {
        $base = config('app.url');
        $pros = Professional::approved()->select('slug', 'updated_at')->get();
        $cats = Category::where('active', true)->select('name')->get();

        $urls = collect();

        // Static pages
        foreach (['', '/professionals', '/pro/register'] as $path) {
            $urls->push("<url><loc>{$base}{$path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>");
        }

        // SEO city pages + city×category matrix (top 10 cities × all categories)
        $cities = \App\Models\City::where('active', true)->select('name')->take(10)->get();
        foreach ($cities as $city) {
            $citySlug = rawurlencode($city->name);
            $urls->push("<url><loc>{$base}/professionnels/{$citySlug}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>");
            foreach ($cats as $cat) {
                $catSlug = rawurlencode($cat->name);
                $urls->push("<url><loc>{$base}/professionnels/{$citySlug}/{$catSlug}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>");
            }
        }

        // Legacy query-string category pages
        foreach ($cats as $cat) {
            $name = urlencode($cat->name);
            $urls->push("<url><loc>{$base}/professionals?profession={$name}</loc><changefreq>daily</changefreq><priority>0.6</priority></url>");
        }

        // Professional profiles
        foreach ($pros as $pro) {
            $lastmod = $pro->updated_at?->toAtomString() ?? now()->toAtomString();
            $urls->push("<url><loc>{$base}/professionals/{$pro->slug}</loc><lastmod>{$lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>");
        }

        return '<?xml version="1.0" encoding="UTF-8"?>'
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
            . $urls->implode('')
            . '</urlset>';
    });

    return Response::make($xml, 200, ['Content-Type' => 'application/xml']);
})->name('sitemap');
