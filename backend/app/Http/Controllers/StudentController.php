<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Attendance;

class StudentController extends Controller
{
    // Dashboard
    public function getDashboard()
    {
        return response()->json([
            'enrolled_courses' => 4,
            'completed_assignments' => 12,
            'average_grade' => 78.5,
            'attendance_rate' => 92
        ]);
    }
    
    // Analytics - Important for dashboard
    public function getAnalytics()
    {
        return response()->json([
            'attendance_rate' => 92,
            'average_grade' => 78.5,
            'completed_assignments' => 12,
            'upcoming_assignments' => 3,
            'enrolled_courses' => 4,
            'total_points' => 1250,
            'gpa' => 3.8,
            'performance' => [
                'excellent' => 85,
                'good' => 75,
                'average' => 65,
                'poor' => 45
            ]
        ]);
    }
    
    public function getCourses()
    {
        return response()->json([
            ['id' => 1, 'name' => 'Web Development', 'code' => 'CS301', 'progress' => 75],
            ['id' => 2, 'name' => 'Database Systems', 'code' => 'CS302', 'progress' => 60],
            ['id' => 3, 'name' => 'Mobile App Development', 'code' => 'CS401', 'progress' => 40],
            ['id' => 4, 'name' => 'Artificial Intelligence', 'code' => 'CS501', 'progress' => 25]
        ]);
    }
    
    public function getCourseDetail($courseId)
    {
        return response()->json([
            'id' => $courseId,
            'name' => 'Web Development',
            'description' => 'Learn modern web development',
            'instructor' => 'Prof. John Doe',
            'schedule' => 'Monday 10:00 AM - 12:00 PM'
        ]);
    }
    
    public function getCourseMaterials($courseId)
    {
        return response()->json([
            ['id' => 1, 'title' => 'Introduction to HTML', 'type' => 'video', 'duration' => '30 min'],
            ['id' => 2, 'title' => 'CSS Fundamentals', 'type' => 'document', 'size' => '2.5 MB']
        ]);
    }
    
    public function getAssignments()
    {
        return response()->json([
            ['id' => 1, 'title' => 'Build a Portfolio Website', 'due_date' => '2026-06-20', 'status' => 'pending', 'grade' => null],
            ['id' => 2, 'title' => 'Database Design Project', 'due_date' => '2026-06-25', 'status' => 'pending', 'grade' => null],
            ['id' => 3, 'title' => 'API Integration', 'due_date' => '2026-06-18', 'status' => 'submitted', 'grade' => 85]
        ]);
    }
    
    public function getAssignmentDetail($assignmentId)
    {
        return response()->json([
            'id' => $assignmentId,
            'title' => 'Build a Portfolio Website',
            'description' => 'Create a personal portfolio website using HTML, CSS, and JavaScript',
            'due_date' => '2026-06-20',
            'max_score' => 100,
            'submission_type' => 'file'
        ]);
    }
    
    public function submitAssignment($assignmentId, Request $request)
    {
        return response()->json([
            'message' => 'Assignment submitted successfully',
            'submission_id' => rand(100, 999)
        ]);
    }
    
    public function getSubmission($assignmentId)
    {
        return response()->json([
            'assignment_id' => $assignmentId,
            'submitted_at' => '2026-06-10 14:30:00',
            'grade' => null,
            'feedback' => null
        ]);
    }
    
    public function getExams()
    {
        return response()->json([
            ['id' => 1, 'title' => 'Mid-term Exam', 'date' => '2026-06-30', 'duration' => '2 hours', 'status' => 'upcoming'],
            ['id' => 2, 'title' => 'Final Exam', 'date' => '2026-07-20', 'duration' => '3 hours', 'status' => 'upcoming']
        ]);
    }
    
    public function getExamDetail($examId)
    {
        return response()->json([
            'id' => $examId,
            'title' => 'Mid-term Exam',
            'instructions' => 'Answer all questions',
            'total_questions' => 50,
            'duration_minutes' => 120
        ]);
    }
    
    public function startExam($examId)
    {
        return response()->json([
            'message' => 'Exam started',
            'start_time' => now(),
            'end_time' => now()->addHours(2)
        ]);
    }
    
    public function submitExam($examId, Request $request)
    {
        return response()->json([
            'message' => 'Exam submitted successfully',
            'score' => rand(60, 95)
        ]);
    }
    
    public function getAttendance()
    {
        return response()->json([
            ['date' => '2026-06-01', 'course' => 'Web Development', 'status' => 'present'],
            ['date' => '2026-06-02', 'course' => 'Database Systems', 'status' => 'present'],
            ['date' => '2026-06-03', 'course' => 'Mobile Development', 'status' => 'absent']
        ]);
    }
    
    public function getAttendanceSummary()
    {
        return response()->json([
            'total_classes' => 25,
            'present' => 23,
            'absent' => 2,
            'attendance_rate' => 92
        ]);
    }
    
    public function markAttendance(Request $request)
    {
        return response()->json(['message' => 'Attendance marked successfully']);
    }
    
    public function scanQRCode(Request $request)
    {
        return response()->json(['message' => 'QR code scanned successfully']);
    }
    
    public function getAnnouncements()
    {
        return response()->json([
            ['id' => 1, 'title' => 'No classes on Monday', 'content' => 'Due to holiday', 'date' => '2026-06-05'],
            ['id' => 2, 'title' => 'Assignment deadline extended', 'content' => 'New deadline: June 25th', 'date' => '2026-06-07']
        ]);
    }
    
    public function getAnnouncementDetail($announcementId)
    {
        return response()->json([
            'id' => $announcementId,
            'title' => 'No classes on Monday',
            'content' => 'Due to public holiday',
            'date' => '2026-06-05'
        ]);
    }
    
    public function getGroups()
    {
        return response()->json([
            ['id' => 1, 'name' => 'Web Dev Study Group', 'members' => 5, 'course' => 'Web Development'],
            ['id' => 2, 'name' => 'Database Team', 'members' => 3, 'course' => 'Database Systems']
        ]);
    }
    
    public function getGroupDetail($groupId)
    {
        return response()->json([
            'id' => $groupId,
            'name' => 'Web Dev Study Group',
            'members' => [
                ['name' => 'John Doe', 'role' => 'Leader'],
                ['name' => 'Jane Smith', 'role' => 'Member']
            ]
        ]);
    }
    
    public function joinGroup($groupId)
    {
        return response()->json(['message' => 'Joined group successfully']);
    }
    
    public function leaveGroup($groupId)
    {
        return response()->json(['message' => 'Left group successfully']);
    }
    
    public function getPerformanceAnalytics()
    {
        return response()->json([
            'overall_performance' => 78.5,
            'grade_distribution' => [
                'A' => 2,
                'B' => 3,
                'C' => 1
            ]
        ]);
    }
    
    public function getPredictions()
    {
        return response()->json([
            'predicted_gpa' => 3.6,
            'recommendations' => ['Focus on Database assignments', 'Attend more lectures']
        ]);
    }
    
    public function getProfile()
    {
        return response()->json([
            'name' => 'Test Student',
            'email' => 'student@ucc.ac.tz',
            'registration_number' => 'UCC/2024/001',
            'course' => 'Computer Science',
            'year' => 2,
            'semester' => 1
        ]);
    }
    
    public function updateProfile(Request $request)
    {
        return response()->json(['message' => 'Profile updated successfully']);
    }
}