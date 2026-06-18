<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'attempt_id', 'student_id', 'question_id', 'answer', 'is_correct', 'points_earned'
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'points_earned' => 'integer',
    ];

    // Relationships
    public function attempt()
    {
        return $this->belongsTo(ExamAttempt::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function question()
    {
        return $this->belongsTo(ExamQuestion::class);
    }
}