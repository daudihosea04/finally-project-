<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('course_id')->nullable();
            $table->string('type')->default('study');
            $table->string('status')->default('active');
            $table->string('group_code')->unique()->nullable();
            $table->timestamps();
            
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('groups');
    }
};