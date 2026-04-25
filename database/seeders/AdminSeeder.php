<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@m3allemclick.ma'],
            [
                'name'     => 'Admin M3allemClick',
                'password' => 'password',
                'role'     => 'admin',
                'status'   => 'active',
            ]
        );
    }
}
