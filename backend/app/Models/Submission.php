<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id', 'student_id', 'content', 'file_path',
        'submitted_at', 'status', 'grade', 'feedback'
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'grade' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================
    
    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // ==================== HELPER METHODS ====================
    
    public function isGraded()
    {
        return !is_null($this->grade);
    }

    public function isLate()
    {
        return $this->assignment && $this->submitted_at > $this->assignment->due_date;
    }
}