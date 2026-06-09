<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active'
        ]);

        // Create Lecturer User
        User::create([
            'name' => 'Lecturer User',
            'email' => 'lecturer@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'lecturer',
            'status' => 'active'
        ]);

        // Create Student User
        User::create([
            'name' => 'Student User',
            'email' => 'student@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'student',
            'status' => 'active'
        ]);

        // Create additional student
        User::create([
            'name' => 'John Doe',
            'email' => 'john@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'student',
            'status' => 'active'
        ]);

        // Create additional lecturer
        User::create([
            'name' => 'Prof. Sarah Johnson',
            'email' => 'sarah@ucc.ac.tz',
            'password' => Hash::make('password'),
            'role' => 'lecturer',
            'status' => 'active'
        ]);
    }
}