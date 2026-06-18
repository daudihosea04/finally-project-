<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Announcement;
use App\Models\Group;
use App\Models\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:student');
    }

    // Get student dashboard data
    public function getDashboard(Request $request)
    {
        try {
            $user = $request->user();
            
            // Get enrolled courses
            $enrolledCourses = $user->courses()->count();
            
            // Get completed assignments
            $completedAssignments = Submission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->count();
            
            // Get average grade
            $averageGrade = Submission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->avg('grade') ?? 0;
            
            // Get attendance rate
            $attendanceRate = DB::table('enrollments')
                ->where('user_id', $user->id)
                ->avg('attendance') ?? 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'enrolled_courses' => $enrolledCourses,
                    'completed_assignments' => $completedAssignments,
                    'average_grade' => round($averageGrade, 1),
                    'attendance_rate' => round($attendanceRate, 1),
                    'pending_assignments' => Assignment::whereHas('course.students', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })->where('due_date', '>=', now())->count(),
                    'upcoming_deadlines' => Assignment::whereHas('course.students', function($q) use ($user) {
                        $q->where('user_id', $user->id);
                    })->whereBetween('due_date', [now(), now()->addDays(7)])->count()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get student analytics
    public function getAnalytics(Request $request)
    {
        try {
            $user = $request->user();
            
            // Performance trends over time
            $trends = Submission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('AVG(grade) as average'))
                ->groupBy('month')
                ->orderBy('month', 'asc')
                ->limit(6)
                ->get();
            
            // Grade distribution
            $grades = Submission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->select(DB::raw('
                    CASE 
                        WHEN grade >= 90 THEN "A"
                        WHEN grade >= 80 THEN "B"
                        WHEN grade >= 70 THEN "C"
                        WHEN grade >= 60 THEN "D"
                        ELSE "F"
                    END as letter_grade
                '), DB::raw('COUNT(*) as count'))
                ->groupBy('letter_grade')
                ->get();
            
            // GPA calculation
            $totalPoints = Submission::where('student_id', $user->id)
                ->whereNotNull('grade')
                ->sum(DB::raw('(grade / 100) * 4'));
            $totalCourses = $user->courses()->count();
            $gpa = $totalCourses > 0 ? round($totalPoints / $totalCourses, 2) : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'trends' => $trends,
                    'distribution' => $grades,
                    'gpa' => $gpa,
                    'average_score' => round(Submission::where('student_id', $user->id)->avg('grade') ?? 0, 1),
                    'total_points_earned' => Submission::where('student_id', $user->id)->sum('grade'),
                    'passing_rate' => round(Submission::where('student_id', $user->id)
                        ->where('grade', '>=', 60)->count() / max(1, Submission::where('student_id', $user->id)->count()) * 100, 1)
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load analytics: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get student courses
    public function getCourses(Request $request)
    {
        try {
            $user = $request->user();
            $courses = $user->courses()->with('lecturer')->get();
            
            $formattedCourses = $courses->map(function($course) use ($user) {
                $progress = DB::table('submissions')
                    ->where('student_id', $user->id)
                    ->whereHas('assignment', function($q) use ($course) {
                        $q->where('course_id', $course->id);
                    })
                    ->avg('grade') ?? 0;
                
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'code' => $course->code,
                    'instructor' => $course->lecturer->name ?? 'N/A',
                    'progress' => round($progress, 1),
                    'grade' => $course->pivot->grade ?? 'Pending',
                    'schedule' => $course->schedule,
                    'room' => $course->room,
                    'image' => $course->image ?? '📚',
                    'credits' => $course->credits,
                    'status' => $course->pivot->status ?? 'active'
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedCourses
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load courses: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get single course detail
    public function getCourseDetail(Request $request, $courseId)
    {
        try {
            $user = $request->user();
            $course = Course::with(['lecturer', 'assignments'])->findOrFail($courseId);
            
            // Check if student is enrolled
            if (!$course->isEnrolled($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            $enrollment = $course->students()->where('user_id', $user->id)->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $course->id,
                    'title' => $course->title,
                    'code' => $course->code,
                    'description' => $course->description,
                    'instructor' => $course->lecturer->name ?? 'N/A',
                    'instructor_email' => $course->lecturer->email ?? '',
                    'schedule' => $course->schedule,
                    'room' => $course->room,
                    'credits' => $course->credits,
                    'status' => $enrollment->pivot->status ?? 'active',
                    'grade' => $enrollment->pivot->grade ?? 'Not graded yet',
                    'attendance' => $enrollment->pivot->attendance ?? 0,
                    'assignments_count' => $course->assignments->count(),
                    'completed_assignments' => Submission::where('student_id', $user->id)
                        ->whereHas('assignment', function($q) use ($courseId) {
                            $q->where('course_id', $courseId);
                        })->whereNotNull('grade')->count()
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found: ' . $e->getMessage()
            ], 404);
        }
    }

    // Get student assignments
    public function getAssignments(Request $request)
    {
        try {
            $user = $request->user();
            $courseIds = $user->courses()->pluck('courses.id');
            
            $assignments = Assignment::whereIn('course_id', $courseIds)
                ->with(['course', 'lecturer'])
                ->orderBy('due_date', 'asc')
                ->get();
            
            $formattedAssignments = $assignments->map(function($assignment) use ($user) {
                $submission = Submission::where('assignment_id', $assignment->id)
                    ->where('student_id', $user->id)
                    ->first();
                
                return [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'course' => $assignment->course->title,
                    'due_date' => $assignment->due_date,
                    'total_points' => $assignment->total_points,
                    'status' => $submission ? ($submission->grade ? 'graded' : 'submitted') : 'pending',
                    'grade' => $submission ? $submission->grade : null,
                    'feedback' => $submission ? $submission->feedback : null,
                    'submitted_at' => $submission ? $submission->submitted_at : null,
                    'submission_id' => $submission ? $submission->id : null,
                    'is_overdue' => $assignment->due_date < now() && !$submission
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedAssignments
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load assignments: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get single assignment detail
    public function getAssignmentDetail(Request $request, $assignmentId)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::with(['course', 'lecturer'])->findOrFail($assignmentId);
            
            // Check if student is enrolled in the course
            if (!$assignment->course->isEnrolled($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            $submission = Submission::where('assignment_id', $assignmentId)
                ->where('student_id', $user->id)
                ->first();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'description' => $assignment->description,
                    'course' => $assignment->course->title,
                    'course_id' => $assignment->course_id,
                    'instructor' => $assignment->lecturer->name,
                    'due_date' => $assignment->due_date,
                    'due_time' => $assignment->due_time,
                    'total_points' => $assignment->total_points,
                    'attachment' => $assignment->attachment ? Storage::url($assignment->attachment) : null,
                    'submission' => $submission ? [
                        'id' => $submission->id,
                        'content' => $submission->content,
                        'file_path' => $submission->file_path ? Storage::url($submission->file_path) : null,
                        'submitted_at' => $submission->submitted_at,
                        'grade' => $submission->grade,
                        'feedback' => $submission->feedback,
                        'status' => $submission->status
                    ] : null,
                    'can_submit' => !$submission && $assignment->due_date >= now(),
                    'can_resubmit' => $submission && $assignment->due_date >= now() && !$submission->grade
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Assignment not found: ' . $e->getMessage()
            ], 404);
        }
    }

    // Submit assignment
    public function submitAssignment(Request $request, $assignmentId)
    {
        try {
            $user = $request->user();
            $assignment = Assignment::findOrFail($assignmentId);
            
            // Check enrollment
            if (!$assignment->course->isEnrolled($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not enrolled in this course'
                ], 403);
            }
            
            // Check existing submission
            $existing = Submission::where('assignment_id', $assignmentId)
                ->where('student_id', $user->id)
                ->first();
            
            if ($existing && $existing->grade) {
                return response()->json([
                    'success' => false,
                    'message' => 'This assignment has already been graded. Cannot resubmit.'
                ], 400);
            }
            
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'content' => 'nullable|string',
                'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,zip,jpg,png'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $data = [
                'assignment_id' => $assignmentId,
                'student_id' => $user->id,
                'content' => $request->content,
                'submitted_at' => now(),
                'status' => 'submitted'
            ];
            
            if ($request->hasFile('file')) {
                $path = $request->file('file')->store('submissions', 'public');
                $data['file_path'] = $path;
            }
            
            if ($existing) {
                // Update existing submission
                if ($existing->file_path) {
                    Storage::disk('public')->delete($existing->file_path);
                }
                $existing->update($data);
                $submission = $existing;
            } else {
                $submission = Submission::create($data);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Assignment submitted successfully',
                'data' => [
                    'submission_id' => $submission->id,
                    'submitted_at' => $submission->submitted_at,
                    'file_url' => $submission->file_path ? Storage::url($submission->file_path) : null
                ]
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit assignment: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get student announcements
    public function getAnnouncements(Request $request)
    {
        try {
            $user = $request->user();
            
            $announcements = Announcement::forStudent($user->id)
                ->with('creator')
                ->orderBy('published_at', 'desc')
                ->orderBy('created_at', 'desc')
                ->get();
            
            $formattedAnnouncements = $announcements->map(function($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'priority' => $announcement->priority,
                    'course' => $announcement->course ? $announcement->course->title : 'All Students',
                    'author' => $announcement->creator->name,
                    'date' => $announcement->published_at ?? $announcement->created_at,
                    'is_global' => $announcement->is_global
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedAnnouncements
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load announcements: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get student groups
    public function getGroups(Request $request)
    {
        try {
            $user = $request->user();
            $groups = $user->groups()->with(['creator', 'course'])->get();
            
            $formattedGroups = $groups->map(function($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'description' => $group->description,
                    'course' => $group->course ? $group->course->title : 'General',
                    'members' => $group->users()->count(),
                    'created_by' => $group->creator->name,
                    'joined_at' => $group->pivot->joined_at,
                    'role' => $group->pivot->role,
                    'status' => $group->status
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $formattedGroups
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load groups: ' . $e->getMessage()
            ], 500);
        }
    }

    // Join a group (with privacy check)
    public function joinGroup(Request $request, $groupId)
    {
        try {
            $user = $request->user();
            $group = Group::findOrFail($groupId);
            
            // Check if already a member
            if ($group->isMember($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already a member of this group'
                ], 400);
            }
            
            // Check if group is active
            if ($group->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'This group is not accepting new members'
                ], 400);
            }
            
            $user->groups()->attach($groupId, [
                'joined_at' => now(),
                'role' => 'member'
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully joined the group'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to join group: ' . $e->getMessage()
            ], 500);
        }
    }

    // Leave a group
    public function leaveGroup(Request $request, $groupId)
    {
        try {
            $user = $request->user();
            $group = Group::findOrFail($groupId);
            
            if (!$group->isMember($user->id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not a member of this group'
                ], 400);
            }
            
            $user->groups()->detach($groupId);
            
            return response()->json([
                'success' => true,
                'message' => 'Successfully left the group'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to leave group: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get student profile
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'address' => $user->address,
                    'registration_number' => $user->registration_number,
                    'department' => $user->department,
                    'avatar' => $user->avatar,
                    'year' => $this->getStudentYear($user),
                    'semester' => $this->getCurrentSemester(),
                    'gpa' => round(Submission::where('student_id', $user->id)->avg('grade') / 25, 2) ?? 0
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load profile: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update student profile
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:255',
                'avatar' => 'nullable|string'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            if ($request->has('phone')) $user->phone = $request->phone;
            if ($request->has('address')) $user->address = $request->address;
            if ($request->has('avatar')) $user->avatar = $request->avatar;
            
            $user->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper methods
    private function getStudentYear($user)
    {
        $enrollmentDate = $user->created_at;
        $months = $enrollmentDate->diffInMonths(now());
        return floor($months / 12) + 1;
    }

    private function getCurrentSemester()
    {
        $month = now()->month;
        if ($month >= 3 && $month <= 8) {
            return 'Semester 1';
        }
        return 'Semester 2';
    }
}