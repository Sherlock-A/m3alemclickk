<?php

use App\Models\Professional;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

// ─── Register ────────────────────────────────────────────────────────────────

test('professional can register with valid data', function () {
    $response = $this->postJson('/api/pro/register', [
        'name'                  => 'Karim Plombier',
        'email'                 => 'karim@test.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'phone'                 => '0612345678',
        'profession'            => 'Plombier',
        'main_city'             => 'Casablanca',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['token', 'user', 'message'])
             ->assertJsonPath('user.role', 'professional');

    $this->assertDatabaseHas('users', ['email' => 'karim@test.com', 'role' => 'professional', 'status' => 'pending']);
    $this->assertDatabaseHas('professionals', ['name' => 'Karim Plombier', 'profession' => 'Plombier']);
});

test('pro register fails without required fields', function () {
    $this->postJson('/api/pro/register', [
        'name'  => 'Incomplete',
        'email' => 'incomplete@test.com',
    ])->assertStatus(422)->assertJsonValidationErrors(['password', 'phone', 'profession', 'main_city']);
});

test('pro register fails with duplicate email', function () {
    User::factory()->create(['email' => 'taken@test.com', 'role' => 'professional']);

    $this->postJson('/api/pro/register', [
        'name'                  => 'Autre',
        'email'                 => 'taken@test.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
        'phone'                 => '0612345678',
        'profession'            => 'Électricien',
        'main_city'             => 'Rabat',
    ])->assertStatus(422)->assertJsonValidationErrors('email');
});

// ─── Login ────────────────────────────────────────────────────────────────────

test('active professional can login', function () {
    $professional = Professional::create([
        'name'       => 'Pro Actif',
        'phone'      => '0612345678',
        'profession' => 'Électricien',
        'main_city'  => 'Marrakech',
        'status'     => 'approved',
    ]);

    User::factory()->create([
        'email'           => 'proactif@test.com',
        'password'        => Hash::make('secret123'),
        'role'            => 'professional',
        'status'          => 'active',
        'professional_id' => $professional->id,
    ]);

    $this->postJson('/api/pro/login', [
        'email'    => 'proactif@test.com',
        'password' => 'secret123',
    ])->assertOk()->assertJsonStructure(['token', 'user']);
});

test('pending professional cannot login', function () {
    $professional = Professional::create([
        'name'       => 'Pro Pending',
        'phone'      => '0612345678',
        'profession' => 'Menuisier',
        'main_city'  => 'Fès',
    ]);

    User::factory()->create([
        'email'           => 'propending@test.com',
        'password'        => Hash::make('secret123'),
        'role'            => 'professional',
        'status'          => 'pending',
        'professional_id' => $professional->id,
    ]);

    $this->postJson('/api/pro/login', [
        'email'    => 'propending@test.com',
        'password' => 'secret123',
    ])->assertStatus(403)->assertJsonPath('status', 'pending');
});

test('suspended professional cannot login', function () {
    $professional = Professional::create([
        'name'       => 'Pro Banni',
        'phone'      => '0612345678',
        'profession' => 'Peintre',
        'main_city'  => 'Tanger',
    ]);

    User::factory()->create([
        'email'           => 'suspended@test.com',
        'password'        => Hash::make('secret123'),
        'role'            => 'professional',
        'status'          => 'suspended',
        'professional_id' => $professional->id,
    ]);

    $this->postJson('/api/pro/login', [
        'email'    => 'suspended@test.com',
        'password' => 'secret123',
    ])->assertStatus(403)->assertJsonPath('status', 'suspended');
});

test('pro login fails with wrong password', function () {
    User::factory()->create([
        'email'    => 'wrongpass@test.com',
        'password' => Hash::make('correct'),
        'role'     => 'professional',
        'status'   => 'active',
    ]);

    $this->postJson('/api/pro/login', [
        'email'    => 'wrongpass@test.com',
        'password' => 'wrong',
    ])->assertStatus(401);
});

test('client account cannot login via pro endpoint', function () {
    User::factory()->create([
        'email'    => 'clientonly@test.com',
        'password' => Hash::make('secret123'),
        'role'     => 'client',
    ]);

    $this->postJson('/api/pro/login', [
        'email'    => 'clientonly@test.com',
        'password' => 'secret123',
    ])->assertStatus(401);
});

// ─── Me ───────────────────────────────────────────────────────────────────────

test('authenticated professional can fetch their profile', function () {
    $user = User::factory()->create(['role' => 'professional', 'status' => 'active']);
    $token = JWTAuth::fromUser($user);

    $this->getJson('/api/pro/me', ['Authorization' => "Bearer {$token}"])
         ->assertOk()
         ->assertJsonPath('user.id', $user->id);
});

test('unauthenticated request to /api/pro/me returns 401', function () {
    $this->getJson('/api/pro/me')->assertStatus(401);
});

// ─── Logout ───────────────────────────────────────────────────────────────────

test('professional can logout', function () {
    $user = User::factory()->create(['role' => 'professional', 'status' => 'active']);
    $token = JWTAuth::fromUser($user);

    $this->postJson('/api/pro/logout', [], ['Authorization' => "Bearer {$token}"])
         ->assertOk()
         ->assertJsonPath('message', 'Déconnecté avec succès.');
});
