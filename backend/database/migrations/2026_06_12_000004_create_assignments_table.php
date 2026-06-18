<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('lecturer_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->date('due_date');
            $table->time('due_time')->nullable();
            $table->integer('total_points')->default(100);
            $table->string('status')->default('active');
            $table->string('attachment')->nullable();
            $table->timestamps();
            
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('lecturer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};