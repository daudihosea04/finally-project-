<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('course_id');
            $table->date('date');
            $table->string('status')->default('present');
            $table->unsignedBigInteger('marked_by');
            $table->timestamp('marked_at');
            $table->timestamps();
            
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('marked_by')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['student_id', 'course_id', 'date']);
            $table->index(['course_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};