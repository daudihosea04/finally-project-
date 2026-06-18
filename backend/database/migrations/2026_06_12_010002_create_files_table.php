<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('file_name');
            $table->string('file_path');
            $table->integer('file_size');
            $table->string('mime_type');
            $table->string('type'); // assignment, submission, profile, general
            $table->unsignedBigInteger('related_id')->nullable();
            $table->integer('download_count')->default(0);
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['type', 'related_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
    }
};