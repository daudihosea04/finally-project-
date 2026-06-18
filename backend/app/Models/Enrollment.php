<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';

    protected $fillable = [
        'user_id', 'course_id', 'enrolled_at', 'status', 'grade', 'attendance'
    ];

    protected $casts = [
        'enrolled_at' => 'datetime',
        'grade' => 'decimal:2',
        'attendance' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================
    
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}