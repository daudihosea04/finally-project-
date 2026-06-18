<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@ucc.ac.tz'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'phone' => '+255 123 456 789',
                'department' => 'Administration'
            ]
        );

        // Create Lecturer User
        User::updateOrCreate(
            ['email' => 'lecturer@ucc.ac.tz'],
            [
                'name' => 'Dr. Sarah Johnson',
                'password' => Hash::make('password'),
                'role' => 'lecturer',
                'status' => 'active',
                'phone' => '+255 123 456 788',
                'department' => 'Computer Science'
            ]
        );

        // Create Lecturer 2
        User::updateOrCreate(
            ['email' => 'michael@ucc.ac.tz'],
            [
                'name' => 'Prof. Michael Chen',
                'password' => Hash::make('password'),
                'role' => 'lecturer',
                'status' => 'active',
                'phone' => '+255 123 456 787',
                'department' => 'Computer Science'
            ]
        );

        // Create Student User
        User::updateOrCreate(
            ['email' => 'student@ucc.ac.tz'],
            [
                'name' => 'John Doe',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
                'phone' => '+255 123 456 786',
                'registration_number' => 'UCC/DIT/2024/001',
                'department' => 'Information Technology'
            ]
        );

        // Create Student 2
        User::updateOrCreate(
            ['email' => 'jane@ucc.ac.tz'],
            [
                'name' => 'Jane Smith',
                'password' => Hash::make('password'),
                'role' => 'student',
                'status' => 'active',
                'phone' => '+255 123 456 785',
                'registration_number' => 'UCC/DIT/2024/002',
                'department' => 'Computer Science'
            ]
        );
    }
}