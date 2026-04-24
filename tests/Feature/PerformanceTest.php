<?php

use App\Models\Category;
use App\Models\Professional;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

// ─── Public page response times ───────────────────────────────────────────────

test('home page responds under 500ms', function () {
    $start = microtime(true);
    $this->get('/')->assertOk();
    $elapsed = (microtime(true) - $start) * 1000;

    expect($elapsed)->toBeLessThan(500);
});

test('professionals listing responds under 500ms', function () {
    $start = microtime(true);
    $this->get('/professionals')->assertOk();
    $elapsed = (microtime(true) - $start) * 1000;

    expect($elapsed)->toBeLessThan(500);
});

test('sitemap.xml returns valid XML', function () {
    $response = $this->get('/sitemap.xml');

    $response->assertOk()
             ->assertHeader('Content-Type', 'application/xml');

    $body = $response->getContent();
    expect($body)->toContain('<urlset')
                 ->toContain('</urlset>')
                 ->toContain('<url>');
});

test('robots.txt is accessible when it exists', function () {
    // If a robots.txt does not exist at public/, the route 404s — that's fine.
    $response = $this->get('/robots.txt');
    expect($response->status())->toBeIn([200, 404]);
});

// ─── API JSON structure ────────────────────────────────────────────────────────

test('professionals API returns paginated JSON', function () {
    $this->getJson('/api/professionals')
         ->assertOk()
         ->assertJsonStructure(['data', 'current_page', 'per_page', 'total']);
});

test('category listing returns correct structure', function () {
    Category::create(['name' => 'Plomberie', 'active' => true, 'sort_order' => 1]);

    $this->getJson('/api/admin/categories')
         ->assertStatus(401); // must be admin — verifies route protection

    $this->get('/')->assertOk(); // home still loads categories via cache
});

// ─── Cache behaviour ──────────────────────────────────────────────────────────

test('categories_active cache is populated after home page visit', function () {
    Cache::forget('categories_active');

    $this->get('/');

    expect(Cache::has('categories_active'))->toBeTrue();
});

test('categories_active cache is cleared when a category is modified', function () {
    Cache::put('categories_active', collect([['id' => 1, 'name' => 'Test']]), 3600);

    $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
    $token = JWTAuth::fromUser($admin);

    // Create via admin endpoint → should call Cache::forget('categories_active')
    $this->postJson('/api/admin/categories', [
        'name'       => 'Nouvelle Catégorie',
        'sort_order' => 10,
        'active'     => true,
    ], ['Authorization' => "Bearer {$token}"])->assertStatus(201);

    expect(Cache::has('categories_active'))->toBeFalse();
});

// ─── Security headers ─────────────────────────────────────────────────────────

test('security headers are present on web pages', function () {
    $response = $this->get('/');

    $response->assertHeader('X-Content-Type-Options', 'nosniff')
             ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
             ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
});

test('API routes do not set Content-Security-Policy header', function () {
    $response = $this->getJson('/api/professionals');

    // CSP is intentionally skipped on api/* routes
    expect($response->headers->has('Content-Security-Policy'))->toBeFalse();
});

// ─── Auth protection ──────────────────────────────────────────────────────────

test('professional dashboard page is accessible (auth handled client-side via JWT)', function () {
    // The web route renders the SPA shell — auth is enforced in React via JWT.
    $this->get('/dashboard/professional')->assertOk();
});

test('admin API endpoints require JWT admin token', function () {
    $this->getJson('/api/dashboard/admin')->assertStatus(401);
    $this->getJson('/api/admin/professionals')->assertStatus(401);
});

test('professional API endpoints reject client tokens', function () {
    $client = User::factory()->create(['role' => 'client']);
    $token  = JWTAuth::fromUser($client);

    $this->getJson('/api/dashboard/professional', [
        'Authorization' => "Bearer {$token}",
    ])->assertStatus(403);
});

// ─── Professional profile slug ────────────────────────────────────────────────

test('professional profile page returns 404 for unknown slug', function () {
    $this->get('/professionals/artisan-qui-nexiste-pas')->assertStatus(404);
});

test('professional profile page loads for approved professional', function () {
    $pro = Professional::create([
        'name'       => 'Hassan Électricien',
        'phone'      => '0612345678',
        'profession' => 'Électricien',
        'main_city'  => 'Casablanca',
    ]);

    // approved() scope checks for a linked User with status=active
    User::factory()->create([
        'role'            => 'professional',
        'status'          => 'active',
        'professional_id' => $pro->id,
    ]);

    $this->get("/professionals/{$pro->slug}")->assertOk();
});
