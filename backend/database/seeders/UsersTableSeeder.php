<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Lecturer;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Admin User
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // 2. Create Lecturer User
        $lecturer = User::create([
            'name' => 'Prof. John Lecturer',
            'email' => 'lecturer@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'lecturer',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create lecturer profile
        Lecturer::create([
            'user_id' => $lecturer->id,
            'employee_number' => 'LEC001',
            'department' => 'Computer Science',
            'phone' => '0712345678',
            'is_active' => true,
        ]);

        // 3. Create Student User
        $student = User::create([
            'name' => 'Jane Student',
            'email' => 'student@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'student',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create student profile
        Student::create([
            'user_id' => $student->id,
            'registration_number' => '2024/CS/001',
            'phone' => '0712345679',
            'course' => 'Computer Science',
            'start_date' => '2024-09-01',
            'end_date' => '2027-08-31',
            'is_active' => true,
        ]);

        $this->command->info('Users created: Admin, Lecturer, Student');
    }
}