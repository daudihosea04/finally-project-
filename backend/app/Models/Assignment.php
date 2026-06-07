<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'course_id',
        'created_by',
        'due_date',
        'due_time',
        'total_points',
        'attachment',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'due_time' => 'datetime',
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

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function grades()
    {
        return $this->hasMany(Grade::class);
    }

    // Check if assignment is past due
    public function isPastDue()
    {
        return now()->gt($this->due_date);
    }
}