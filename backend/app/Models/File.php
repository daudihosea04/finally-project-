<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'file_name', 'file_path', 'file_size', 'mime_type',
        'type', 'related_id', 'download_count'
    ];

    protected $casts = [
        'file_size' => 'integer',
        'download_count' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}