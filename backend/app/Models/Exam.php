<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'instructions', 'course_id', 'created_by',
        'duration_minutes', 'total_points', 'passing_score', 'start_date',
        'end_date', 'status'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'duration_minutes' => 'integer',
        'total_points' => 'integer',
        'passing_score' => 'integer',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions()
    {
        return $this->hasMany(ExamQuestion::class);
    }

    public function attempts()
    {
        return $this->hasMany(ExamAttempt::class);
    }

    // Helper methods
    public function isAvailable()
    {
        return $this->status === 'published' && 
               $this->start_date <= now() && 
               $this->end_date >= now();
    }

    public function getAverageScore()
    {
        return $this->attempts()->where('status', 'completed')->avg('percentage') ?? 0;
    }

    public function getPassRate()
    {
        $total = $this->attempts()->where('status', 'completed')->count();
        $passed = $this->attempts()->where('passed', true)->count();
        return $total > 0 ? round(($passed / $total) * 100, 1) : 0;
    }
}