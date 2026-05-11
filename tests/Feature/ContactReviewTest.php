<?php

use App\Models\Professional;
use App\Models\Review;

// ─── Contact (devis) ──────────────────────────────────────────────────────────

test('client can send contact request to professional', function () {
    $professional = Professional::create([
        'name'       => 'Hassan Test',
        'phone'      => '0612345678',
        'profession' => 'Plombier',
        'main_city'  => 'Casablanca',
        'status'     => 'approved',
    ]);

    $this->postJson("/api/professionals/{$professional->id}/contact", [
        'client_name' => 'Karim Aziz',
        'message'     => 'Bonjour, je voudrais un devis pour ma salle de bain.',
    ])->assertStatus(200)->assertJsonPath('success', true);
});

test('contact request fails without message', function () {
    $professional = Professional::create([
        'name'       => 'Pro Contact',
        'phone'      => '0612345678',
        'profession' => 'Électricien',
        'main_city'  => 'Rabat',
        'status'     => 'approved',
    ]);

    $this->postJson("/api/professionals/{$professional->id}/contact", [
        'client_name' => 'Ahmed',
    ])->assertStatus(422)->assertJsonValidationErrors(['message']);
});

test('contact request fails with empty client_name', function () {
    $professional = Professional::create([
        'name'       => 'Pro Contact2',
        'phone'      => '0612345678',
        'profession' => 'Menuisier',
        'main_city'  => 'Marrakech',
        'status'     => 'approved',
    ]);

    $this->postJson("/api/professionals/{$professional->id}/contact", [
        'client_name' => '',
        'message'     => 'Besoin plombier.',
    ])->assertStatus(422)->assertJsonValidationErrors(['client_name']);
});

test('contact request returns 404 for unknown professional', function () {
    $this->postJson('/api/professionals/99999/contact', [
        'client_name' => 'Test',
        'message'     => 'Hello.',
    ])->assertStatus(404);
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

test('client can submit a review for a professional', function () {
    $professional = Professional::create([
        'name'       => 'Pro Review',
        'phone'      => '0612345678',
        'profession' => 'Peintre',
        'main_city'  => 'Fès',
        'status'     => 'approved',
    ]);

    $this->postJson('/api/reviews', [
        'professional_id' => $professional->id,
        'client_name'     => 'Sara Benali',
        'rating'          => 5,
        'comment'         => 'Excellent travail, très sérieux.',
    ])->assertStatus(201)->assertJsonStructure(['id', 'rating', 'client_name']);
});

test('review fails with invalid rating above 5', function () {
    $professional = Professional::create([
        'name'       => 'Pro Rating',
        'phone'      => '0612345678',
        'profession' => 'Maçon',
        'main_city'  => 'Agadir',
        'status'     => 'approved',
    ]);

    $this->postJson('/api/reviews', [
        'professional_id' => $professional->id,
        'client_name'     => 'Test',
        'rating'          => 6,
    ])->assertStatus(422)->assertJsonValidationErrors(['rating']);
});

test('review fails without professional_id', function () {
    $this->postJson('/api/reviews', [
        'client_name' => 'Test',
        'rating'      => 4,
    ])->assertStatus(422)->assertJsonValidationErrors(['professional_id']);
});

test('submitted review is stored in database', function () {
    $professional = Professional::create([
        'name'       => 'Pro DB',
        'phone'      => '0612345678',
        'profession' => 'Serrurier',
        'main_city'  => 'Tanger',
        'status'     => 'approved',
    ]);

    $this->postJson('/api/reviews', [
        'professional_id' => $professional->id,
        'client_name'     => 'Fatima Oukach',
        'rating'          => 4,
        'comment'         => 'Bon travail.',
    ])->assertStatus(201);

    $this->assertDatabaseHas('reviews', [
        'professional_id' => $professional->id,
        'client_name'     => 'Fatima Oukach',
        'rating'          => 4,
    ]);
});

// ─── Review report ────────────────────────────────────────────────────────────

test('client can report a review', function () {
    $professional = Professional::create([
        'name'       => 'Pro Report',
        'phone'      => '0612345678',
        'profession' => 'Jardinage',
        'main_city'  => 'Oujda',
        'status'     => 'approved',
    ]);

    $review = Review::create([
        'professional_id' => $professional->id,
        'client_name'     => 'Anonymous',
        'rating'          => 1,
        'approved'        => true,
    ]);

    $this->postJson("/api/reviews/{$review->id}/report", [
        'reason' => 'Contenu inapproprié.',
    ])->assertStatus(200);
});
