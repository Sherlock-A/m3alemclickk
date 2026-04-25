<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientAuthController;
use App\Http\Controllers\Api\ProAuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ProfessionalController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

// ─── Debug (Railway diagnostics — admin only) ─────────────────────────────────
Route::middleware('jwt:admin')->get('/debug', function () {
    try {
        $dbOk = \Illuminate\Support\Facades\DB::connection()->getPdo() ? true : false;
    } catch (\Throwable $e) {
        return response()->json([
            'db'    => false,
            'error' => $e->getMessage(),
            'driver'=> config('database.default'),
        ]);
    }
    return response()->json([
        'db'            => $dbOk,
        'driver'        => config('database.default'),
        'users'         => \App\Models\User::count(),
        'professionals' => \App\Models\Professional::count(),
        'categories'    => \App\Models\Category::count(),
        'cities'        => \App\Models\City::count(),
        'admin_exists'  => \App\Models\User::where('role', 'admin')->exists(),
        'jwt_secret'    => strlen(config('jwt.secret')) > 0 ? 'SET' : 'MISSING',
        'app_key'       => strlen(config('app.key')) > 0 ? 'SET' : 'MISSING',
    ]);
});

// ─── Auth mock (legacy, à conserver) ──────────────────────────────────────────
Route::post('/auth/mock-login', [AuthController::class, 'mockLogin'])->middleware('throttle:30,1');

// ─── Auth Admin ────────────────────────────────────────────────────────────────
Route::post('/admin/login',       [AuthController::class, 'adminLogin'])->middleware('throttle:30,1');
Route::post('/admin/check-email', [AuthController::class, 'checkEmail'])->middleware('throttle:60,1');

// ─── Auth Professionnels (réelle) ─────────────────────────────────────────────
Route::prefix('pro')->group(function () {
    Route::post('/register',       [ProAuthController::class, 'register'])->middleware('throttle:30,1');
    Route::post('/login',          [ProAuthController::class, 'login'])->middleware('throttle:30,1');
    Route::post('/logout',         [ProAuthController::class, 'logout']);
    Route::post('/forgot-password',[ProAuthController::class, 'forgotPassword'])->middleware('throttle:20,1');
    Route::post('/reset-password', [ProAuthController::class, 'resetPassword'])->middleware('throttle:30,1');

    Route::middleware('jwt:professional')->group(function () {
        Route::get('/me', [ProAuthController::class, 'me']);
    });
});

// ─── Auth Clients (chercheurs d'artisans) ─────────────────────────────────────
Route::prefix('client')->group(function () {
    Route::post('/register',        [ClientAuthController::class, 'register'])->middleware('throttle:30,1');
    Route::post('/login',           [ClientAuthController::class, 'login'])->middleware('throttle:30,1');
    Route::post('/logout',          [ClientAuthController::class, 'logout']);
    Route::post('/forgot-password', [ClientAuthController::class, 'forgotPassword'])->middleware('throttle:20,1');
    Route::post('/reset-password',  [ClientAuthController::class, 'resetPassword'])->middleware('throttle:30,1');

    Route::middleware('jwt:client')->group(function () {
        Route::get('/me', [ClientAuthController::class, 'me']);
    });
});

// ─── Annuaire public ──────────────────────────────────────────────────────────
Route::get('/cities',                [CityController::class, 'publicIndex']);
Route::get('/cities/autocomplete',   [CityController::class, 'autocomplete']);
Route::get('/professionals', [ProfessionalController::class, 'index']);

// Serve uploaded files from /tmp/uploads
Route::get('/files/{filename}', function ($filename) {
    $path = '/tmp/uploads/' . basename($filename);
    if (!file_exists($path)) abort(404);
    $mime = mime_content_type($path) ?: 'application/octet-stream';
    return response()->file($path, ['Content-Type' => $mime, 'Cache-Control' => 'public, max-age=86400']);
});
Route::post('/track',        [TrackingController::class, 'store'])->middleware('throttle:tracking');
Route::get('/whatsapp/{id}', [ContactController::class, 'whatsapp']);
Route::get('/call/{id}',     [ContactController::class, 'call']);
Route::get('/favorites',     [FavoriteController::class, 'index']);
Route::post('/favorites/sync',[FavoriteController::class, 'sync']);
Route::post('/reviews',      [ReviewController::class, 'store'])->middleware('throttle:30,1');

// ─── Dashboard Professionnel ───────────────────────────────────────────────────
Route::middleware('jwt:professional')->group(function () {
    Route::get('/dashboard/professional',              [DashboardController::class, 'professional']);
    Route::put('/dashboard/professional',              [DashboardController::class, 'updateProfessional']);
    Route::post('/pro/upload-photo',                   [UploadController::class, 'photo']);
    // pro response to reviews disabled
});

// ─── Settings (public read, admin write) ──────────────────────────────────────
Route::get('/settings', [SettingsController::class, 'show']);

// ─── Dashboard Admin ───────────────────────────────────────────────────────────
Route::middleware('jwt:admin')->group(function () {
    Route::get('/dashboard/admin',            [DashboardController::class, 'admin']);
    Route::get('/dashboard/admin/export-csv', [DashboardController::class, 'exportCsv']);

    // Gestion des villes
    Route::apiResource('admin/cities', CityController::class);

    // Gestion des catégories
    Route::apiResource('admin/categories', CategoryController::class)->only(['index','store','update','destroy']);

    // Paramètres modifiables
    Route::put('/settings', [SettingsController::class, 'update']);

    // Gestion professionnels
    Route::get('/admin/professionals',                    [AdminController::class, 'professionals']);
    Route::put('/admin/professionals/{user}/status',      [AdminController::class, 'updateProfessionalStatus']);
    Route::delete('/admin/professionals/{user}',          [AdminController::class, 'deleteProfessional']);

    // Modération avis
    Route::get('/admin/reviews',                          [AdminController::class, 'reviews']);
    Route::put('/admin/reviews/{review}/approve',         [AdminController::class, 'approveReview']);
    Route::delete('/admin/reviews/{review}',              [AdminController::class, 'deleteReview']);

    // Analytics
    Route::get('/admin/analytics',                        [AdminController::class, 'analytics']);

    // Notifications
    Route::get('/admin/notifications',                    [AdminController::class, 'notifications']);

    // Exports CSV
    Route::get('/admin/export/professionals',             [AdminController::class, 'exportProfessionalsCsv']);
    Route::get('/admin/export/trackings',                 [AdminController::class, 'exportTrackingsCsv']);
});
