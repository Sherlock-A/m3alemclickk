<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remove "Kenitra" without accent if "Kénitra" (with accent) already exists
        $canonical = DB::table('cities')->where('name', 'Kénitra')->first();
        if ($canonical) {
            DB::table('cities')
                ->where('name', 'Kenitra')
                ->where('id', '!=', $canonical->id)
                ->delete();
        }

        // Remove "Temara" without accent if "Témara" (with accent) already exists
        $canonical = DB::table('cities')->where('name', 'Témara')->first();
        if ($canonical) {
            DB::table('cities')
                ->where('name', 'Temara')
                ->where('id', '!=', $canonical->id)
                ->delete();
        }

        // Remove "Fes" without accent if "Fès" already exists
        $canonical = DB::table('cities')->where('name', 'Fès')->first();
        if ($canonical) {
            DB::table('cities')
                ->where('name', 'Fes')
                ->where('id', '!=', $canonical->id)
                ->delete();
        }
    }

    public function down(): void {}
};
