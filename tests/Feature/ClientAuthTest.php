<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

// ─── Register ────────────────────────────────────────────────────────────────

test('client can register with valid data', function () {
    $response = $this->postJson('/api/client/register', [
        'name'                  => 'Ahmed Test',
        'email'                 => 'ahmed@test.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
             ->assertJsonStructure(['token', 'user' => ['id', 'name', 'email', 'role']])
             ->assertJsonPath('user.role', 'client');

    $this->assertDatabaseHas('users', ['email' => 'ahmed@test.com', 'role' => 'client']);
});

test('client register fails with duplicate email', function () {
    User::factory()->create(['email' => 'existing@test.com', 'role' => 'client']);

    $this->postJson('/api/client/register', [
        'name'                  => 'Test User',
        'email'                 => 'existing@test.com',
        'password'              => 'password123',
        'password_confirmation' => 'password123',
    ])->assertStatus(422)->assertJsonValidationErrors('email');
});

test('client register fails with short password', function () {
    $this->postJson('/api/client/register', [
        'name'                  => 'Test',
        'email'                 => 'short@test.com',
        'password'              => '1234',
        'password_confirmation' => '1234',
    ])->assertStatus(422)->assertJsonValidationErrors('password');
});

test('client register fails when passwords do not match', function () {
    $this->postJson('/api/client/register', [
        'name'                  => 'Test',
        'email'                 => 'nomatch@test.com',
        'password'              => 'password123',
        'password_confirmation' => 'different456',
    ])->assertStatus(422)->assertJsonValidationErrors('password');
});

// ─── Login ────────────────────────────────────────────────────────────────────

test('client can login with correct credentials', function () {
    User::factory()->create([
        'email'    => 'client@test.com',
        'password' => Hash::make('secret123'),
        'role'     => 'client',
    ]);

    $this->postJson('/api/client/login', [
        'email'    => 'client@test.com',
        'password' => 'secret123',
    ])->assertOk()
      ->assertJsonStructure(['token', 'user'])
      ->assertJsonPath('user.role', 'client');
});

test('client login fails with wrong password', function () {
    User::factory()->create([
        'email'    => 'client2@test.com',
        'password' => Hash::make('correct'),
        'role'     => 'client',
    ]);

    $this->postJson('/api/client/login', [
        'email'    => 'client2@test.com',
        'password' => 'wrong',
    ])->assertStatus(401)->assertJsonPath('message', 'Email ou mot de passe incorrect.');
});

test('client login fails with unknown email', function () {
    $this->postJson('/api/client/login', [
        'email'    => 'nobody@test.com',
        'password' => 'password123',
    ])->assertStatus(401);
});

test('professional account cannot login via client endpoint', function () {
    User::factory()->create([
        'email'    => 'pro@test.com',
        'password' => Hash::make('secret123'),
        'role'     => 'professional',
    ]);

    $this->postJson('/api/client/login', [
        'email'    => 'pro@test.com',
        'password' => 'secret123',
    ])->assertStatus(401);
});

// ─── Me (authenticated) ───────────────────────────────────────────────────────

test('authenticated client can fetch their profile', function () {
    $user = User::factory()->create(['role' => 'client']);
    $token = JWTAuth::fromUser($user);

    $this->getJson('/api/client/me', ['Authorization' => "Bearer {$token}"])
         ->assertOk()
         ->assertJsonPath('user.id', $user->id)
         ->assertJsonPath('user.role', 'client');
});

test('unauthenticated request to /api/client/me returns 401', function () {
    $this->getJson('/api/client/me')->assertStatus(401);
});

test('client token cannot access pro protected route', function () {
    $user = User::factory()->create(['role' => 'client']);
    $token = JWTAuth::fromUser($user);

    $this->getJson('/api/dashboard/professional', ['Authorization' => "Bearer {$token}"])
         ->assertStatus(403);
});

// ─── Logout ───────────────────────────────────────────────────────────────────

test('client can logout', function () {
    $user = User::factory()->create(['role' => 'client']);
    $token = JWTAuth::fromUser($user);

    $this->postJson('/api/client/logout', [], ['Authorization' => "Bearer {$token}"])
         ->assertOk()
         ->assertJsonPath('message', 'Déconnecté avec succès.');
});
