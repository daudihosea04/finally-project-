<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'department',
        'registration_number',
        'status',
        'avatar',
        'address',
        'last_login_at',
        'notification_settings',
        'is_active',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'notification_settings' => 'json',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // ==================== ACCESSORS ====================

    /**
     * Get the user's role label
     */
    public function getRoleLabelAttribute()
    {
        $roles = [
            'admin' => 'Administrator',
            'lecturer' => 'Mwalimu',
            'student' => 'Mwanafunzi',
        ];
        return $roles[$this->role] ?? $this->role;
    }

    /**
     * Get profile photo URL
     */
    public function getProfilePhotoUrlAttribute()
    {
        if ($this->avatar) {
            if (filter_var($this->avatar, FILTER_VALIDATE_URL)) {
                return $this->avatar;
            }
            return asset('storage/' . $this->avatar);
        }
        
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=FFD700&color=000&size=100';
    }

    /**
     * Check if user is online
     */
    public function getIsOnlineAttribute()
    {
        if (!$this->last_login_at) {
            return false;
        }
        
        return $this->last_login_at->diffInMinutes(now()) < 5;
    }

    /**
     * Get online status string
     */
    public function getOnlineStatusAttribute()
    {
        if ($this->is_online) {
            return 'online';
        }
        
        if ($this->last_login_at && $this->last_login_at->diffInMinutes(now()) < 30) {
            return 'away';
        }
        
        return 'offline';
    }

    /**
     * Get initials for avatar
     */
    public function getInitialsAttribute()
    {
        $words = explode(' ', $this->name);
        $initials = '';
        foreach ($words as $word) {
            if (!empty($word)) {
                $initials .= strtoupper($word[0]);
            }
        }
        return $initials;
    }

    /**
     * Get display name with role
     */
    public function getDisplayNameAttribute()
    {
        return $this->name . ' (' . $this->role_label . ')';
    }

    // ==================== SCOPES ====================

    /**
     * Scope for online users
     */
    public function scopeOnline($query)
    {
        return $query->where('last_login_at', '>=', now()->subMinutes(5));
    }

    /**
     * Scope for offline users
     */
    public function scopeOffline($query)
    {
        return $query->where(function($q) {
            $q->whereNull('last_login_at')
              ->orWhere('last_login_at', '<', now()->subMinutes(5));
        });
    }

    /**
     * Scope by role
     */
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope for active users
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ==================== ROLE CHECKS ====================

    /**
     * Check if user has a specific role
     */
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is a lecturer
     */
    public function isLecturer()
    {
        return $this->role === 'lecturer';
    }

    /**
     * Check if user is a student
     */
    public function isStudent()
    {
        return $this->role === 'student';
    }

    // ==================== HELPER METHODS ====================

    /**
     * Update online status
     */
    public function updateOnlineStatus($status = 'online')
    {
        $this->update([
            'last_login_at' => now(),
            'status' => $status
        ]);
    }

    /**
     * Get dashboard route based on role
     */
    public function getDashboardRoute()
    {
        if ($this->isAdmin()) {
            return '/admin/dashboard';
        } elseif ($this->isLecturer()) {
            return '/lecturer/dashboard';
        } elseif ($this->isStudent()) {
            return '/student/dashboard';
        }
        
        return '/';
    }

    /**
     * Get notification settings
     */
    public function getNotificationSettingsAttribute($value)
    {
        return json_decode($value, true) ?? [
            'email' => true,
            'sms' => false,
            'push' => true,
            'course_updates' => true,
            'assignment_reminders' => true,
            'grade_notifications' => true
        ];
    }

    /**
     * Set notification settings
     */
    public function setNotificationSettingsAttribute($value)
    {
        $this->attributes['notification_settings'] = json_encode($value);
    }

    // ==================== RELATIONSHIPS ====================

    public function courses()
    {
        return $this->hasMany(Course::class, 'lecturer_id');
    }

    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'course_student', 'student_id', 'course_id')
                    ->withTimestamps();
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function student()
    {
        return $this->hasOne(Student::class);
    }

    public function lecturer()
    {
        return $this->hasOne(Lecturer::class);
    }
}