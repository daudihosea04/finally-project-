<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class StudentController extends Controller
{
    public function getCourses()
    {
        return response()->json([
            'success' => true,
            'courses' => [
                ['id' => 1, 'title' => 'Advanced Web Development', 'code' => 'CS401', 'instructor' => 'Dr. Sarah Johnson', 'progress' => 75, 'grade' => 'A-', 'nextClass' => 'Today, 2:00 PM', 'image' => '💻', 'credits' => 3],
                ['id' => 2, 'title' => 'Database Systems', 'code' => 'CS302', 'instructor' => 'Prof. Michael Chen', 'progress' => 68, 'grade' => 'B+', 'nextClass' => 'Tomorrow, 10:00 AM', 'image' => '🗄️', 'credits' => 3],
                ['id' => 3, 'title' => 'Data Structures & Algorithms', 'code' => 'CS301', 'instructor' => 'Dr. Emily Rodriguez', 'progress' => 82, 'grade' => 'A', 'nextClass' => 'Wed, 11:00 AM', 'image' => '📊', 'credits' => 4],
            ]
        ]);
    }

    public function getAssignments()
    {
        return response()->json([
            'success' => true,
            'assignments' => [
                ['id' => 1, 'title' => 'React.js Final Project', 'course' => 'Advanced Web Development', 'dueDate' => '2025-03-25', 'status' => 'pending', 'points' => 100, 'description' => 'Build a full stack React application'],
                ['id' => 2, 'title' => 'Database Normalization', 'course' => 'Database Systems', 'dueDate' => '2025-03-20', 'status' => 'graded', 'grade' => 85, 'points' => 100, 'feedback' => 'Good work!'],
                ['id' => 3, 'title' => 'Algorithm Analysis', 'course' => 'Data Structures & Algorithms', 'dueDate' => '2025-03-28', 'status' => 'pending', 'points' => 100],
            ]
        ]);
    }

    public function getExams()
    {
        return response()->json([
            'success' => true,
            'exams' => [
                ['id' => 1, 'title' => 'Midterm Exam', 'course' => 'Advanced Web Development', 'date' => '2025-03-25', 'duration' => 90, 'totalPoints' => 100, 'status' => 'upcoming'],
                ['id' => 2, 'title' => 'Database Final', 'course' => 'Database Systems', 'date' => '2025-04-10', 'duration' => 120, 'totalPoints' => 100, 'status' => 'upcoming'],
            ]
        ]);
    }

    public function getAnnouncements()
    {
        return response()->json([
            'success' => true,
            'announcements' => [
                ['id' => 1, 'title' => 'Midterm Exam Schedule', 'content' => 'Midterm exams will begin on April 15th.', 'date' => '2025-03-18', 'priority' => 'high'],
                ['id' => 2, 'title' => 'Assignment Extension', 'content' => 'React.js project deadline extended to March 28th.', 'date' => '2025-03-17', 'priority' => 'medium'],
            ]
        ]);
    }

    public function getAttendance()
    {
        return response()->json([
            'success' => true,
            'attendance' => [
                ['id' => 1, 'courseTitle' => 'Advanced Web Development', 'date' => '2025-03-18', 'time' => '09:15 AM', 'status' => 'present', 'locationName' => 'Lab 301', 'distanceFromClass' => 5],
                ['id' => 2, 'courseTitle' => 'Database Systems', 'date' => '2025-03-17', 'time' => '10:30 AM', 'status' => 'present', 'locationName' => 'Lab 205', 'distanceFromClass' => 8],
            ]
        ]);
    }

    public function getAnalytics()
    {
        return response()->json([
            'success' => true,
            'trends' => [
                ['label' => 'Week 1', 'value' => 65],
                ['label' => 'Week 2', 'value' => 70],
                ['label' => 'Week 3', 'value' => 75],
                ['label' => 'Week 4', 'value' => 82],
                ['label' => 'Week 5', 'value' => 78],
                ['label' => 'Week 6', 'value' => 85]
            ],
            'distribution' => ['A' => 18, 'B' => 32, 'C' => 28, 'D' => 15, 'F' => 7],
            'predictions' => ['passRate' => 82, 'atRisk' => 15, 'topPerformers' => 10, 'improvement' => 12],
            'gpa' => 3.8,
            'averageScore' => 78
        ]);
    }
}