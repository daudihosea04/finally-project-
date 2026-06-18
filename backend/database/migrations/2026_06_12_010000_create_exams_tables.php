<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Exams table
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('instructions')->nullable();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('created_by');
            $table->integer('duration_minutes')->default(60);
            $table->integer('total_points')->default(100);
            $table->integer('passing_score')->default(60);
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->string('status')->default('draft'); // draft, published, archived
            $table->timestamps();
            
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->index(['course_id', 'status']);
            $table->index(['start_date', 'end_date']);
        });

        // Exam questions table
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_id');
            $table->text('question');
            $table->string('type')->default('multiple_choice'); // multiple_choice, true_false, essay
            $table->json('options')->nullable();
            $table->string('correct_answer')->nullable();
            $table->integer('points')->default(1);
            $table->timestamps();
            
            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
        });

        // Exam attempts table
        Schema::create('exam_attempts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('exam_id');
            $table->unsignedBigInteger('student_id');
            $table->timestamp('started_at');
            $table->timestamp('submitted_at')->nullable();
            $table->integer('score')->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->boolean('passed')->default(false);
            $table->string('status')->default('in_progress'); // in_progress, completed
            $table->timestamps();
            
            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['exam_id', 'student_id']);
        });

        // Exam answers table
        Schema::create('exam_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('attempt_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('question_id');
            $table->text('answer');
            $table->boolean('is_correct')->nullable();
            $table->integer('points_earned')->default(0);
            $table->timestamps();
            
            $table->foreign('attempt_id')->references('id')->on('exam_attempts')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('exam_questions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_answers');
        Schema::dropIfExists('exam_attempts');
        Schema::dropIfExists('exam_questions');
        Schema::dropIfExists('exams');
    }
};