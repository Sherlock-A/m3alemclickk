<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $exists = DB::table('users')->where('email', 'admin@m3allemclick.ma')->exists();
        if ($exists) return;

        DB::table('users')->insert([
            'name'       => 'Admin M3allemClick',
            'email'      => 'admin@m3allemclick.ma',
            'password'   => Hash::make('password'),
            'role'       => 'admin',
            'status'     => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
