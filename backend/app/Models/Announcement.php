<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'content', 'priority', 'created_by', 'course_id',
        'recipient_role', 'is_global', 'published_at'
    ];

    protected $casts = [
        'is_global' => 'boolean',
        'published_at' => 'datetime',
    ];

    // ==================== RELATIONSHIPS ====================
    
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // ==================== PRIVACY SCOPES ====================
    
    // Announcements visible to students
    public function scopeForStudent($query, $userId)
    {
        return $query->where(function($q) use ($userId) {
            $q->where('is_global', true)
              ->orWhere('recipient_role', 'student')
              ->orWhereHas('course', function($cq) use ($userId) {
                  $cq->whereHas('students', function($sq) use ($userId) {
                      $sq->where('user_id', $userId);
                  });
              });
        });
    }

    // Announcements visible to lecturers
    public function scopeForLecturer($query, $userId)
    {
        return $query->where(function($q) use ($userId) {
            $q->where('is_global', true)
              ->orWhere('recipient_role', 'lecturer')
              ->orWhere('created_by', $userId);
        });
    }
}