<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatAttachment extends Model
{
    use HasFactory;

    protected $table = 'chat_attachments';

    protected $fillable = [
        'message_id', 
        'file_name', 
        'file_path', 
        'file_type', 
        'file_size'
    ];

    protected $casts = [
        'file_size' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Get the message that owns this attachment
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class, 'message_id');
    }

    /**
     * Get the full URL of the file
     */
    public function getFileUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if file is an image
     */
    public function isImage(): bool
    {
        return str_starts_with($this->file_type, 'image/');
    }

    /**
     * Check if file is a PDF
     */
    public function isPdf(): bool
    {
        return $this->file_type === 'application/pdf';
    }

    /**
     * Check if file is a document
     */
    public function isDocument(): bool
    {
        $docTypes = [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        return in_array($this->file_type, $docTypes);
    }
}