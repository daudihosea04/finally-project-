<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'code', 'hod', 'description', 'courses_count'
    ];

    // Relationships
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function headOfDepartment()
    {
        return $this->belongsTo(User::class, 'hod');
    }

    public function getCoursesCount()
    {
        return $this->courses()->count();
    }
}