<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get attendance for a student (their own attendance)
    public function getAttendance(Request $request)
    {
        try {
            $user = $request->user();
            
            if ($user->isStudent()) {
                // Student sees their own attendance
                $attendance = Enrollment::where('user_id', $user->id)
                    ->with('course')
                    ->get()
                    ->map(function($enrollment) {
                        return [
                            'course_id' => $enrollment->course_id,
                            'course_name' => $enrollment->course->title,
                            'course_code' => $enrollment->course->code,
                            'attendance_rate' => $enrollment->attendance ?? 0,
                            'total_classes' => $this->getTotalClasses($enrollment->course_id),
                            'classes_attended' => $this->getClassesAttended($enrollment->user_id, $enrollment->course_id),
                            'last_attendance' => $this->getLastAttendanceDate($enrollment->user_id, $enrollment->course_id)
                        ];
                    });
                
                return response()->json([
                    'success' => true,
                    'data' => $attendance
                ]);
            }
            
            if ($user->isLecturer()) {
                // Lecturer sees attendance for all their courses
                $courses = $user->taughtCourses;
                $attendance = [];
                
                foreach ($courses as $course) {
                    $attendance[] = [
                        'course_id' => $course->id,
                        'course_name' => $course->title,
                        'total_students' => $course->students()->count(),
                        'average_attendance' => $course->students()->avg('attendance') ?? 0,
                        'attendance_records' => $this->getCourseAttendanceRecords($course->id)
                    ];
                }
                
                return response()->json([
                    'success' => true,
                    'data' => $attendance
                ]);
            }
            
            if ($user->isAdmin()) {
                // Admin sees overall attendance statistics
                $stats = [
                    'total_students' => User::where('role', 'student')->count(),
                    'average_attendance_overall' => Enrollment::avg('attendance') ?? 0,
                    'courses_with_attendance' => Course::whereHas('students')->count(),
                    'attendance_by_department' => $this->getAttendanceByDepartment(),
                    'attendance_trends' => $this->getAttendanceTrends()
                ];
                
                return response()->json([
                    'success' => true,
                    'data' => $stats
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Invalid user role'
            ], 400);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get attendance: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get attendance summary for student
    public function getSummary(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user->isStudent()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only students can access attendance summary'
                ], 403);
            }
            
            $totalClasses = Enrollment::where('user_id', $user->id)->sum('total_classes') ?? 0;
            $classesAttended = Enrollment::where('user_id', $user->id)->sum('classes_attended') ?? 0;
            $attendanceRate = $totalClasses > 0 ? round(($classesAttended / $totalClasses) * 100, 1) : 0;
            
            $courses = $user->courses;
            $courseBreakdown = [];
            
            foreach ($courses as $course) {
                $enrollment = $course->students()->where('user_id', $user->id)->first();
                $courseBreakdown[] = [
                    'course_name' => $course->title,
                    'attendance_rate' => $enrollment->pivot->attendance ?? 0,
                    'status' => ($enrollment->pivot->attendance ?? 0) >= 80 ? 'Good' : (($enrollment->pivot->attendance ?? 0) >= 60 ? 'Warning' : 'Critical')
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_classes' => $totalClasses,
                    'classes_attended' => $classesAttended,
                    'attendance_rate' => $attendanceRate,
                    'status' => $attendanceRate >= 80 ? 'Excellent' : ($attendanceRate >= 60 ? 'Satisfactory' : 'At Risk'),
                    'course_breakdown' => $courseBreakdown
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get attendance summary: ' . $e->getMessage()
            ], 500);
        }
    }

    // Mark attendance (for lecturer)
    public function markAttendance(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'course_id' => 'required|exists:courses,id',
                'student_ids' => 'required|array',
                'student_ids.*' => 'exists:users,id',
                'date' => 'required|date',
                'status' => 'sometimes|in:present,absent,late'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            $courseId = $request->course_id;
            $date = $request->date;
            
            // Check if user is lecturer of this course
            $course = Course::findOrFail($courseId);
            if ($course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to mark attendance for this course'
                ], 403);
            }
            
            $attendanceRecords = [];
            foreach ($request->student_ids as $studentId) {
                // Check if student is enrolled
                $enrollment = Enrollment::where('user_id', $studentId)
                    ->where('course_id', $courseId)
                    ->first();
                
                if (!$enrollment) {
                    continue;
                }
                
                // Update or create attendance record
                $attendance = DB::table('attendance_records')->updateOrInsert(
                    [
                        'student_id' => $studentId,
                        'course_id' => $courseId,
                        'date' => $date
                    ],
                    [
                        'status' => $request->status ?? 'present',
                        'marked_by' => $user->id,
                        'marked_at' => now(),
                        'updated_at' => now()
                    ]
                );
                
                // Update enrollment attendance percentage
                $this->updateAttendancePercentage($studentId, $courseId);
                
                $attendanceRecords[] = [
                    'student_id' => $studentId,
                    'course_id' => $courseId,
                    'date' => $date,
                    'status' => $request->status ?? 'present'
                ];
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Attendance marked successfully',
                'data' => $attendanceRecords
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark attendance: ' . $e->getMessage()
            ], 500);
        }
    }

    // Scan QR code for attendance (student)
    public function scanQRCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'qr_data' => 'required|string',
                'course_id' => 'required|exists:courses,id'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            $courseId = $request->course_id;
            $qrData = json_decode($request->qr_data, true);
            
            // Verify QR code validity
            if (!$qrData || !isset($qrData['course_id']) || $qrData['course_id'] != $courseId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid QR code'
                ], 400);
            }
            
            // Check if QR code is expired (valid for 15 minutes)
            if (isset($qrData['expires_at']) && now()->gt(Carbon::parse($qrData['expires_at']))) {
                return response()->json([
                    'success' => false,
                    'message' => 'QR code has expired'
                ], 400);
            }
            
            // Check if student is enrolled
            $enrollment = Enrollment::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->first();
            
            if (!$enrollment) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            // Check if already marked for today
            $today = now()->toDateString();
            $existing = DB::table('attendance_records')
                ->where('student_id', $user->id)
                ->where('course_id', $courseId)
                ->where('date', $today)
                ->first();
            
            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Attendance already marked for today'
                ], 400);
            }
            
            // Mark attendance
            DB::table('attendance_records')->insert([
                'student_id' => $user->id,
                'course_id' => $courseId,
                'date' => $today,
                'status' => 'present',
                'marked_by' => $user->id,
                'marked_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // Update attendance percentage
            $this->updateAttendancePercentage($user->id, $courseId);
            
            return response()->json([
                'success' => true,
                'message' => 'Attendance marked successfully via QR code',
                'data' => [
                    'course' => $enrollment->course->title,
                    'date' => $today,
                    'time' => now()->toTimeString()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to scan QR code: ' . $e->getMessage()
            ], 500);
        }
    }

    // Generate QR code for attendance (lecturer)
    public function generateQRCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'course_id' => 'required|exists:courses,id',
                'duration_minutes' => 'sometimes|integer|min:5|max:60'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            $courseId = $request->course_id;
            $duration = $request->duration_minutes ?? 15;
            
            // Check if user is lecturer of this course
            $course = Course::findOrFail($courseId);
            if ($course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to generate QR code for this course'
                ], 403);
            }
            
            // Generate QR code data
            $qrData = json_encode([
                'course_id' => $courseId,
                'course_name' => $course->title,
                'lecturer' => $user->name,
                'generated_at' => now()->toISOString(),
                'expires_at' => now()->addMinutes($duration)->toISOString()
            ]);
            
            // Generate QR code as base64
            $qrCode = base64_encode(QrCode::format('png')->size(300)->generate($qrData));
            
            return response()->json([
                'success' => true,
                'data' => [
                    'qr_code' => 'data:image/png;base64,' . $qrCode,
                    'expires_at' => now()->addMinutes($duration),
                    'course_id' => $courseId,
                    'course_name' => $course->title
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate QR code: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get course attendance (for lecturer)
    public function getCourseAttendance(Request $request, $courseId)
    {
        try {
            $user = $request->user();
            $course = Course::findOrFail($courseId);
            
            // Check authorization
            if ($course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view attendance for this course'
                ], 403);
            }
            
            $students = $course->students()->get();
            $attendanceData = [];
            
            foreach ($students as $student) {
                $enrollment = $student->pivot;
                $attendanceData[] = [
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'registration_number' => $student->registration_number,
                    'attendance_rate' => $enrollment->attendance ?? 0,
                    'status' => ($enrollment->attendance ?? 0) >= 80 ? 'Good' : (($enrollment->attendance ?? 0) >= 60 ? 'Warning' : 'Critical'),
                    'attendance_records' => $this->getStudentAttendanceRecords($student->id, $courseId)
                ];
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'course_id' => $courseId,
                    'course_name' => $course->title,
                    'total_students' => $students->count(),
                    'average_attendance' => $course->students()->avg('attendance') ?? 0,
                    'students' => $attendanceData
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get course attendance: ' . $e->getMessage()
            ], 500);
        }
    }

    // Export attendance report
    public function exportReport(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'course_id' => 'required|exists:courses,id',
                'format' => 'sometimes|in:csv,excel,pdf'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            $courseId = $request->course_id;
            $course = Course::findOrFail($courseId);
            
            // Check authorization
            if ($course->lecturer_id !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to export attendance for this course'
                ], 403);
            }
            
            $students = $course->students()->get();
            $csvData = "Student Name,Registration Number,Attendance Rate (%)\n";
            
            foreach ($students as $student) {
                $enrollment = $student->pivot;
                $csvData .= "\"{$student->name}\",\"{$student->registration_number}\",{$enrollment->attendance}\n";
            }
            
            $fileName = "attendance_{$course->code}_" . now()->format('Y-m-d') . ".csv";
            
            return response()->json([
                'success' => true,
                'message' => 'Report generated successfully',
                'data' => [
                    'file_name' => $fileName,
                    'content' => base64_encode($csvData),
                    'download_url' => "/api/attendance/download/{$fileName}"
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export report: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper methods
    private function updateAttendancePercentage($studentId, $courseId)
    {
        $totalRecords = DB::table('attendance_records')
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->count();
        
        $presentRecords = DB::table('attendance_records')
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->where('status', 'present')
            ->count();
        
        $percentage = $totalRecords > 0 ? round(($presentRecords / $totalRecords) * 100, 1) : 0;
        
        Enrollment::where('user_id', $studentId)
            ->where('course_id', $courseId)
            ->update(['attendance' => $percentage]);
    }

    private function getTotalClasses($courseId)
    {
        return DB::table('attendance_records')
            ->where('course_id', $courseId)
            ->distinct('date')
            ->count('date');
    }

    private function getClassesAttended($studentId, $courseId)
    {
        return DB::table('attendance_records')
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->where('status', 'present')
            ->count();
    }

    private function getLastAttendanceDate($studentId, $courseId)
    {
        $record = DB::table('attendance_records')
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->orderBy('date', 'desc')
            ->first();
        
        return $record ? $record->date : null;
    }

    private function getCourseAttendanceRecords($courseId)
    {
        return DB::table('attendance_records')
            ->where('course_id', $courseId)
            ->select('date', DB::raw('COUNT(*) as total'), DB::raw('SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(10)
            ->get();
    }

    private function getStudentAttendanceRecords($studentId, $courseId)
    {
        return DB::table('attendance_records')
            ->where('student_id', $studentId)
            ->where('course_id', $courseId)
            ->orderBy('date', 'desc')
            ->limit(20)
            ->get();
    }

    private function getAttendanceByDepartment()
    {
        return DB::table('enrollments')
            ->join('users', 'enrollments.user_id', '=', 'users.id')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->join('departments', 'courses.department_id', '=', 'departments.id')
            ->select('departments.name', DB::raw('AVG(enrollments.attendance) as avg_attendance'))
            ->groupBy('departments.id', 'departments.name')
            ->get();
    }

    private function getAttendanceTrends()
    {
        return DB::table('attendance_records')
            ->select(DB::raw('DATE_FORMAT(date, "%Y-%m") as month'), DB::raw('COUNT(*) as total'), DB::raw('SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present'))
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get()
            ->map(function($item) {
                $item->rate = $item->total > 0 ? round(($item->present / $item->total) * 100, 1) : 0;
                return $item;
            });
    }
}