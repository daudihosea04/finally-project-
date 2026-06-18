<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id', 'student_id', 'started_at', 'submitted_at',
        'score', 'percentage', 'passed', 'status'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'score' => 'integer',
        'percentage' => 'decimal:2',
        'passed' => 'boolean',
    ];

    // Relationships
    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function answers()
    {
        return $this->hasMany(ExamAnswer::class);
    }

    // Helper methods
    public function getTimeSpent()
    {
        if (!$this->submitted_at) return null;
        return $this->started_at->diffInMinutes($this->submitted_at);
    }

    public function isInProgress()
    {
        return $this->status === 'in_progress';
    }
}