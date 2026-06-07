<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'description',
        'credits',
        'lecturer_id',
        'schedule',
        'room',
        'status',
        'image',
        'progress'
    ];

    // Relationships
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
                    ->withPivot('enrolled_at', 'status')
                    ->withTimestamps();
    }

    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }
}