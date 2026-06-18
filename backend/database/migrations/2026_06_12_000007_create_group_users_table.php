<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('group_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('group_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('joined_at')->nullable();
            $table->string('role')->default('member');
            $table->timestamps();
            
            $table->foreign('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['group_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('group_users');
    }
};