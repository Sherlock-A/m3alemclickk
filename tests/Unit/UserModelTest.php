<?php

use App\Models\User;

test('user role helpers return correct boolean', function () {
    $client = new User(['role' => 'client']);
    expect($client->isClient())->toBeTrue()
        ->and($client->isProfessional())->toBeFalse()
        ->and($client->isAdmin())->toBeFalse();

    $pro = new User(['role' => 'professional']);
    expect($pro->isProfessional())->toBeTrue()
        ->and($pro->isClient())->toBeFalse();

    $admin = new User(['role' => 'admin']);
    expect($admin->isAdmin())->toBeTrue();
});

test('user status helpers return correct boolean', function () {
    expect((new User(['status' => 'pending']))->isPending())->toBeTrue();
    expect((new User(['status' => 'active']))->isActive())->toBeTrue();
    expect((new User(['status' => 'refused']))->isRefused())->toBeTrue();
    expect((new User(['status' => 'suspended']))->isSuspended())->toBeTrue();
});

test('getStatusBadge returns correct label for each status', function () {
    $cases = [
        'pending'   => 'En attente',
        'active'    => 'Actif',
        'refused'   => 'Refusé',
        'suspended' => 'Suspendu',
    ];

    foreach ($cases as $status => $label) {
        $badge = (new User(['status' => $status]))->getStatusBadge();
        expect($badge['label'])->toBe($label);
    }
});

test('getJWTCustomClaims includes role', function () {
    $user = new User(['role' => 'client']);
    expect($user->getJWTCustomClaims())->toHaveKey('role', 'client');
});
