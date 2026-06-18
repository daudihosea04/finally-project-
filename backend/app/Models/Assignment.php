<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'course_id', 'lecturer_id', 'created_by',
        'due_date', 'due_time', 'total_points', 'status', 'attachment'
    ];

    protected $casts = [
        'due_date' => 'date',
        'total_points' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================
    
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    // ==================== HELPER METHODS ====================
    
    public function isOverdue()
    {
        if (!$this->due_date) return false;
        return now()->gt($this->due_date);
    }

    public function getSubmissionCount()
    {
        return $this->submissions()->count();
    }

    public function getAverageGrade()
    {
        return $this->submissions()->avg('grade') ?? 0;
    }
}