<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('priority')->default('medium');
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('course_id')->nullable();
            $table->string('recipient_role')->nullable();
            $table->boolean('is_global')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};