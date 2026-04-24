<?php

use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProfessionalPageController;
use App\Models\Category;
use App\Models\Professional;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Pages publiques ───────────────────────────────────────────────────────────
Route::get('/', HomeController::class)->name('home');
Route::get('/professionals', [ProfessionalPageController::class, 'index'])->name('professionals.index');
Route::get('/professionals/{slug}', [ProfessionalPageController::class, 'show'])->name('professionals.show');

// ─── Authentification Professionnels (pages Inertia) ───────────────────────────
Route::get('/pro/login',           fn () => Inertia::render('Auth/ProLoginPage'))->name('pro.login');
Route::get('/pro/register',        fn () => Inertia::render('Auth/ProRegisterPage'))->name('pro.register');
Route::get('/pro/forgot-password', fn () => Inertia::render('Auth/ForgotPasswordPage'))->name('pro.forgot-password');
Route::get('/pro/reset-password',  fn () => Inertia::render('Auth/ResetPasswordPage', [
    'token' => request('token'),
    'email' => request('email'),
]))->name('pro.reset-password');

// ─── Authentification Clients (chercheurs d'artisans) ─────────────────────────
Route::get('/client/login',           fn () => Inertia::render('Auth/ClientLoginPage'))->name('client.login');
Route::get('/client/register',        fn () => Inertia::render('Auth/ClientRegisterPage'))->name('client.register');
Route::get('/client/forgot-password', fn () => Inertia::render('Auth/ForgotPasswordPage', ['role' => 'client']))->name('client.forgot-password');
Route::get('/client/reset-password',  fn () => Inertia::render('Auth/ResetPasswordPage', [
    'token' => request('token'),
    'email' => request('email'),
    'role'  => 'client',
]))->name('client.reset-password');

// ─── Dashboards protégés ───────────────────────────────────────────────────────
Route::get('/dashboard/professional', fn () => Inertia::render('Dashboard/ProfessionalDashboardPage'))->name('dashboard.professional');
Route::get('/dashboard/client',       fn () => Inertia::render('Dashboard/ClientDashboardPage'))->name('dashboard.client');
Route::get('/dashboard/admin',        fn () => Inertia::render('Dashboard/AdminDashboardPage'))->name('dashboard.admin');

// ─── Admin login ───────────────────────────────────────────────────────────────
Route::get('/admin/login', fn () => Inertia::render('Auth/AdminLoginPage'))->name('admin.login');

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

        // Category pages
        foreach ($cats as $cat) {
            $name = urlencode($cat->name);
            $urls->push("<url><loc>{$base}/professionals?profession={$name}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>");
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
