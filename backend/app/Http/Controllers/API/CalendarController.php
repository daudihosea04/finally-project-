<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Assignment;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CalendarController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // Get all events for user
    public function getEvents(Request $request)
    {
        try {
            $user = $request->user();
            $startDate = $request->get('start', now()->startOfMonth());
            $endDate = $request->get('end', now()->endOfMonth());
            
            $events = collect();
            
            // Get calendar events
            $calendarEvents = Event::where(function($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('is_public', true);
            })->whereBetween('event_date', [$startDate, $endDate])
              ->get()
              ->map(function($event) {
                  return [
                      'id' => $event->id,
                      'title' => $event->title,
                      'description' => $event->description,
                      'start' => $event->event_date,
                      'end' => $event->end_date,
                      'type' => 'event',
                      'color' => $event->color ?? '#FFD700',
                      'all_day' => $event->all_day
                  ];
              });
            
            $events = $events->concat($calendarEvents);
            
            // Get assignments for student
            if ($user->isStudent()) {
                $courseIds = $user->courses()->pluck('courses.id');
                $assignments = Assignment::whereIn('course_id', $courseIds)
                    ->whereBetween('due_date', [$startDate, $endDate])
                    ->get()
                    ->map(function($assignment) {
                        return [
                            'id' => $assignment->id,
                            'title' => $assignment->title,
                            'description' => $assignment->description,
                            'start' => $assignment->due_date,
                            'end' => $assignment->due_date,
                            'type' => 'assignment',
                            'color' => '#00E5FF',
                            'all_day' => true
                        ];
                    });
                $events = $events->concat($assignments);
            }
            
            // Get exams for student
            if ($user->isStudent()) {
                $courseIds = $user->courses()->pluck('courses.id');
                $exams = Exam::whereIn('course_id', $courseIds)
                    ->whereBetween('start_date', [$startDate, $endDate])
                    ->get()
                    ->map(function($exam) {
                        return [
                            'id' => $exam->id,
                            'title' => $exam->title,
                            'description' => $exam->description,
                            'start' => $exam->start_date,
                            'end' => $exam->end_date,
                            'type' => 'exam',
                            'color' => '#FF6B6B',
                            'all_day' => false
                        ];
                    });
                $events = $events->concat($exams);
            }
            
            return response()->json([
                'success' => true,
                'data' => $events
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get events: ' . $e->getMessage()
            ], 500);
        }
    }

    // Create event
    public function createEvent(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'event_date' => 'required|date',
                'end_date' => 'nullable|date|after:event_date',
                'color' => 'nullable|string',
                'all_day' => 'boolean'
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $user = $request->user();
            
            $event = Event::create([
                'title' => $request->title,
                'description' => $request->description,
                'event_date' => $request->event_date,
                'end_date' => $request->end_date,
                'color' => $request->color,
                'all_day' => $request->all_day ?? true,
                'created_by' => $user->id,
                'is_public' => $request->is_public ?? false
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => $event
            ], 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Update event
    public function updateEvent(Request $request, $eventId)
    {
        try {
            $event = Event::findOrFail($eventId);
            $user = $request->user();
            
            // Check ownership
            if ($event->created_by !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this event'
                ], 403);
            }
            
            $event->update($request->only([
                'title', 'description', 'event_date', 'end_date', 'color', 'all_day', 'is_public'
            ]));
            
            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully',
                'data' => $event
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete event
    public function deleteEvent(Request $request, $eventId)
    {
        try {
            $event = Event::findOrFail($eventId);
            $user = $request->user();
            
            // Check ownership
            if ($event->created_by !== $user->id && !$user->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this event'
                ], 403);
            }
            
            $event->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get deadlines
    public function getDeadlines(Request $request)
    {
        try {
            $user = $request->user();
            $limit = $request->get('limit', 10);
            
            $deadlines = collect();
            
            if ($user->isStudent()) {
                $courseIds = $user->courses()->pluck('courses.id');
                
                // Assignment deadlines
                $assignments = Assignment::whereIn('course_id', $courseIds)
                    ->where('due_date', '>=', now())
                    ->orderBy('due_date', 'asc')
                    ->limit($limit)
                    ->get()
                    ->map(function($assignment) {
                        return [
                            'id' => $assignment->id,
                            'title' => $assignment->title,
                            'type' => 'assignment',
                            'due_date' => $assignment->due_date,
                            'course' => $assignment->course->title,
                            'days_remaining' => now()->diffInDays($assignment->due_date, false)
                        ];
                    });
                
                $deadlines = $deadlines->concat($assignments);
                
                // Exam deadlines
                $exams = Exam::whereIn('course_id', $courseIds)
                    ->where('start_date', '>=', now())
                    ->orderBy('start_date', 'asc')
                    ->limit($limit)
                    ->get()
                    ->map(function($exam) {
                        return [
                            'id' => $exam->id,
                            'title' => $exam->title,
                            'type' => 'exam',
                            'due_date' => $exam->start_date,
                            'course' => $exam->course->title,
                            'days_remaining' => now()->diffInDays($exam->start_date, false)
                        ];
                    });
                
                $deadlines = $deadlines->concat($exams);
                
                $deadlines = $deadlines->sortBy('due_date')->take($limit)->values();
            }
            
            return response()->json([
                'success' => true,
                'data' => $deadlines
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get deadlines: ' . $e->getMessage()
            ], 500);
        }
    }
}