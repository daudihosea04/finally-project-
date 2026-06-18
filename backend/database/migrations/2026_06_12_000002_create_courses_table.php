<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('credits')->default(3);
            $table->unsignedBigInteger('lecturer_id');
            $table->string('schedule')->nullable();
            $table->string('room')->nullable();
            $table->string('status')->default('active');
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string('semester')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
            
            $table->foreign('lecturer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};