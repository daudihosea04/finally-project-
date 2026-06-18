<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseEnrollment extends Model
{
    protected $table = 'course_student';
    
    protected $fillable = [
        'course_id', 
        'user_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the course associated with this enrollment
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    /**
     * Get the user associated with this enrollment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope for enrollments in a specific course
     */
    public function scopeForCourse($query, $courseId)
    {
        return $query->where('course_id', $courseId);
    }

    /**
     * Scope for enrollments of a specific student
     */
    public function scopeForStudent($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Check if a student is enrolled in a course
     */
    public static function isEnrolled($userId, $courseId): bool
    {
        return self::where('user_id', $userId)
                   ->where('course_id', $courseId)
                   ->exists();
    }

    /**
     * Enroll a student in a course
     */
    public static function enroll($userId, $courseId): self
    {
        return self::firstOrCreate([
            'user_id' => $userId,
            'course_id' => $courseId
        ]);
    }

    /**
     * Unenroll a student from a course
     */
    public static function unenroll($userId, $courseId): bool
    {
        return self::where('user_id', $userId)
                   ->where('course_id', $courseId)
                   ->delete() > 0;
    }
}