<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name'              => $this->faker->firstName() . ' ' . $this->faker->lastName(),
            'email'             => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => 'password',
            'role'              => 'client',
            'status'            => 'active',
            'remember_token'    => Str::random(10),
        ];
    }

    public function client(): static
    {
        return $this->state(['role' => 'client']);
    }

    public function professional(): static
    {
        return $this->state(['role' => 'professional', 'status' => 'active']);
    }

    public function pending(): static
    {
        return $this->state(['status' => 'pending']);
    }

    public function admin(): static
    {
        return $this->state(['role' => 'admin', 'status' => 'active']);
    }
}
