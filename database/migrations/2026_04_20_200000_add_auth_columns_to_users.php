<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('active')->after('role');
            $table->text('rejection_reason')->nullable()->after('status');
            $table->string('phone_otp', 6)->nullable()->after('rejection_reason');
            $table->timestamp('phone_otp_expires_at')->nullable()->after('phone_otp');
            $table->timestamp('phone_verified_at')->nullable()->after('phone_otp_expires_at');
        });

        // Mark existing professionals as pending approval
        \DB::table('users')->where('role', 'professional')->update(['status' => 'pending']);
        // Admins are always active
        \DB::table('users')->where('role', 'admin')->update(['status' => 'active', 'phone_verified_at' => now()]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'rejection_reason', 'phone_otp', 'phone_otp_expires_at', 'phone_verified_at']);
        });
    }
};
