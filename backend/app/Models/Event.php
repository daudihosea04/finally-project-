<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'event_date', 'end_date', 'color',
        'all_day', 'created_by', 'is_public'
    ];

    protected $casts = [
        'event_date' => 'datetime',
        'end_date' => 'datetime',
        'all_day' => 'boolean',
        'is_public' => 'boolean',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}