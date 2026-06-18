<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'title', 'description', 'credits', 'lecturer_id',
        'schedule', 'room', 'status', 'department_id', 'semester', 'image'
    ];

    protected $casts = [
        'status' => 'string',
        'credits' => 'integer',
    ];

    // ==================== RELATIONSHIPS ====================
    
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments', 'course_id', 'user_id')
                    ->withPivot('enrolled_at', 'status', 'grade')
                    ->withTimestamps();
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    // ==================== HELPER METHODS ====================
    
    public function isEnrolled($userId)
    {
        return $this->students()->where('user_id', $userId)->exists();
    }

    public function getEnrollmentCount()
    {
        return $this->students()->count();
    }

    public function getAverageGrade()
    {
        return $this->students()->avg('grade') ?? 0;
    }
}