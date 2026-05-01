<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email    = env('ADMIN_EMAIL',    'admin@jobly.ma');
        $password = env('ADMIN_PASSWORD', 'Jobly@2026!');

        $exists = DB::table('users')->where('email', $email)->exists();
        if ($exists) return;

        DB::table('users')->insert([
            'name'       => 'Admin Jobly',
            'email'      => $email,
            'password'   => Hash::make($password),
            'role'       => 'admin',
            'status'     => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
