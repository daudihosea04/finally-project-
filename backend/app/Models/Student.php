<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'registration_number',
        'phone',
        'address',
        'course',
        'year_of_study',
        'start_date',
        'end_date',
        'guardian_name',
        'guardian_phone',
        'is_active'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'year_of_study' => 'integer',
        'is_active' => 'boolean',
    ];

    // ==================== RELATIONSHIPS ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'user_id', 'user_id');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class, 'user_id', 'user_id');
    }

    public function groupMembers()
    {
        return $this->hasMany(GroupMember::class, 'user_id', 'user_id');
    }

    // ==================== ACCESSORS ====================

    public function getFullNameAttribute()
    {
        return $this->user ? $this->user->name : 'Unknown';
    }

    public function getEmailAttribute()
    {
        return $this->user ? $this->user->email : null;
    }

    // ==================== SCOPES ====================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCourse($query, $course)
    {
        return $query->where('course', $course);
    }

    public function scopeByYear($query, $year)
    {
        return $query->where('year_of_study', $year);
    }
}