<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // ✅ Check if column exists before adding (SAFE)
            if (!Schema::hasColumn('users', 'profile_photo')) {
                $table->string('profile_photo')->nullable()->after('role');
            }
            
            if (!Schema::hasColumn('users', 'status')) {
                $table->enum('status', ['online', 'offline', 'away'])
                    ->default('offline')
                    ->after('profile_photo');
            }
            
            if (!Schema::hasColumn('users', 'last_seen')) {
                $table->timestamp('last_seen')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_photo',
                'status',
                'last_seen'
            ]);
        });
    }
};