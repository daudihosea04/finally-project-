<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LecturerController extends Controller
{
    public function getCourses()
    {
        return response()->json([
            'success' => true,
            'courses' => [
                ['id' => 1, 'title' => 'Advanced Web Development', 'code' => 'CS401', 'students' => 45, 'schedule' => 'Mon/Wed 2:00 PM', 'progress' => 75],
                ['id' => 2, 'title' => 'Database Systems', 'code' => 'CS302', 'students' => 38, 'schedule' => 'Tue/Thu 10:00 AM', 'progress' => 68],
            ]
        ]);
    }

    public function getAssignments()
    {
        return response()->json([
            'success' => true,
            'assignments' => [
                ['id' => 1, 'title' => 'React.js Final Project', 'course' => 'Advanced Web Development', 'dueDate' => '2025-03-25', 'submissions' => 28, 'total' => 45],
            ]
        ]);
    }

    public function getStudents()
    {
        return response()->json([
            'success' => true,
            'students' => [
                ['id' => 1, 'name' => 'John Doe', 'email' => 'john@ucc.ac.tz', 'progress' => 85],
                ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@ucc.ac.tz', 'progress' => 78],
            ]
        ]);
    }
}