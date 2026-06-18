<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('assignment_id');
            $table->unsignedBigInteger('student_id');
            $table->text('content')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->string('status')->default('submitted');
            $table->integer('grade')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();
            
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};