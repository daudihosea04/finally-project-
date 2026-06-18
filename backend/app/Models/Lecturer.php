<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'employee_number',
        'phone',
        'department',
        'office_location',
        'specialization',
        'qualifications',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // ==================== RELATIONSHIPS ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class, 'lecturer_id');
    }

    public function groups()
    {
        return $this->hasMany(Group::class, 'created_by');
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'created_by');
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

    public function scopeByDepartment($query, $department)
    {
        return $query->where('department', $department);
    }
}