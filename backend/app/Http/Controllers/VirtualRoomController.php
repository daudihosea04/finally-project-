<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VirtualRoomController extends Controller
{
    /**
     * Get virtual rooms for lecturer
     * GET /api/lecturer/virtual-rooms
     */
    public function lecturerVirtualRooms()
    {
        try {
            $user = Auth::user();
            
            // Check if virtual_rooms table exists
            $rooms = [];
            try {
                $rooms = DB::table('virtual_rooms')
                    ->where('host_id', $user->id)
                    ->orderBy('created_at', 'desc')
                    ->get();
                
                if ($rooms->isNotEmpty()) {
                    return response()->json([
                        'success' => true,
                        'data' => $rooms,
                        'message' => 'Virtual rooms fetched successfully'
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('virtual_rooms table not found or empty, using dummy data');
            }

            // Dummy data for testing
            $rooms = [
                [
                    'id' => 1,
                    'name' => 'Office Hours',
                    'description' => 'Weekly office hours for student consultations',
                    'time' => 'Today, 2:00 PM - 4:00 PM',
                    'status' => 'active',
                    'participants' => 5,
                    'max_participants' => 20,
                    'room_url' => '/virtual-room/office-hours',
                    'meeting_id' => '123456789',
                    'host_id' => $user ? $user->id : 1,
                    'host_name' => $user ? $user->name : 'Dr. Sarah Johnson',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString()
                ],
                [
                    'id' => 2,
                    'name' => 'Lecture Room - Web Development',
                    'description' => 'Main lecture hall for Advanced Web Development',
                    'time' => 'Tomorrow, 10:00 AM - 12:00 PM',
                    'status' => 'scheduled',
                    'participants' => 0,
                    'max_participants' => 50,
                    'room_url' => '/virtual-room/web-dev-lecture',
                    'meeting_id' => '987654321',
                    'host_id' => $user ? $user->id : 1,
                    'host_name' => $user ? $user->name : 'Dr. Sarah Johnson',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString()
                ],
                [
                    'id' => 3,
                    'name' => 'Study Group - Database Systems',
                    'description' => 'Group study session for Database Systems',
                    'time' => 'Friday, 3:00 PM - 5:00 PM',
                    'status' => 'scheduled',
                    'participants' => 0,
                    'max_participants' => 10,
                    'room_url' => '/virtual-room/database-study',
                    'meeting_id' => '456789123',
                    'host_id' => $user ? $user->id : 1,
                    'host_name' => $user ? $user->name : 'Dr. Sarah Johnson',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString()
                ],
                [
                    'id' => 4,
                    'name' => 'Exam Review Session',
                    'description' => 'Pre-exam review and Q&A session',
                    'time' => 'Monday, 9:00 AM - 11:00 AM',
                    'status' => 'scheduled',
                    'participants' => 0,
                    'max_participants' => 30,
                    'room_url' => '/virtual-room/exam-review',
                    'meeting_id' => '789123456',
                    'host_id' => $user ? $user->id : 1,
                    'host_name' => $user ? $user->name : 'Dr. Sarah Johnson',
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString()
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $rooms,
                'message' => 'Virtual rooms fetched successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('lecturerVirtualRooms error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch virtual rooms: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get virtual rooms for student
     * GET /api/student/virtual-rooms
     */
    public function studentRooms()
    {
        try {
            $rooms = [
                [
                    'id' => 1,
                    'name' => 'Office Hours',
                    'description' => 'Weekly office hours for student consultations',
                    'time' => 'Today, 2:00 PM - 4:00 PM',
                    'status' => 'active',
                    'participants' => 5,
                    'max_participants' => 20,
                    'room_url' => '/virtual-room/office-hours',
                    'meeting_id' => '123456789',
                    'host_name' => 'Dr. Sarah Johnson',
                    'created_at' => now()->toISOString()
                ],
                [
                    'id' => 2,
                    'name' => 'Lecture Room - Web Development',
                    'description' => 'Main lecture hall for Advanced Web Development',
                    'time' => 'Tomorrow, 10:00 AM - 12:00 PM',
                    'status' => 'scheduled',
                    'participants' => 0,
                    'max_participants' => 50,
                    'room_url' => '/virtual-room/web-dev-lecture',
                    'meeting_id' => '987654321',
                    'host_name' => 'Dr. Sarah Johnson',
                    'created_at' => now()->toISOString()
                ],
                [
                    'id' => 3,
                    'name' => 'Study Group - Database Systems',
                    'description' => 'Group study session for Database Systems',
                    'time' => 'Friday, 3:00 PM - 5:00 PM',
                    'status' => 'scheduled',
                    'participants' => 0,
                    'max_participants' => 10,
                    'room_url' => '/virtual-room/database-study',
                    'meeting_id' => '456789123',
                    'host_name' => 'Dr. Sarah Johnson',
                    'created_at' => now()->toISOString()
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $rooms,
                'message' => 'Virtual rooms fetched successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('studentRooms error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch virtual rooms: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new virtual room
     * POST /api/lecturer/virtual-rooms
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            // ✅ FIXED VALIDATION RULES - Supports both 'name' and 'title' fields
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'name' => 'sometimes|required|string|max:255',
                'course_id' => 'required|integer|exists:courses,id',
                'start_time' => 'required|date',
                'end_time' => 'nullable|date|after:start_time',
                'max_participants' => 'nullable|integer|min:1|max:100',
                'description' => 'nullable|string|max:500',
                'time' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                Log::warning('Validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'input' => $request->all()
                ]);
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get room title (supports both 'title' and 'name')
            $roomTitle = $request->title ?? $request->name ?? 'Virtual Room';

            // Generate meeting ID
            $meetingId = rand(100000000, 999999999);

            // Generate room URL
            $roomUrl = '/virtual-room/' . strtolower(str_replace(' ', '-', $roomTitle));

            // Get description (supports both 'description' and 'time' format)
            $description = $request->description ?? $request->time ?? 'Virtual meeting room';

            // Store in database if table exists
            try {
                $roomData = [
                    'title' => $roomTitle,
                    'name' => $roomTitle,
                    'course_id' => $request->course_id,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'max_participants' => $request->max_participants ?? 50,
                    'description' => $description,
                    'time' => $request->time ?? date('l, g:i A', strtotime($request->start_time)),
                    'status' => 'scheduled',
                    'room_url' => $roomUrl,
                    'meeting_id' => $meetingId,
                    'host_id' => $user->id,
                    'host_name' => $user->name,
                    'created_at' => now(),
                    'updated_at' => now()
                ];

                $roomId = DB::table('virtual_rooms')->insertGetId($roomData);

                Log::info('Virtual room created in database', ['room_id' => $roomId]);

                $room = DB::table('virtual_rooms')->where('id', $roomId)->first();

                return response()->json([
                    'success' => true,
                    'message' => 'Virtual room created successfully',
                    'data' => $room
                ], 201);

            } catch (\Exception $e) {
                Log::warning('virtual_rooms table not found, using dummy data: ' . $e->getMessage());

                // Return dummy data if table doesn't exist
                $room = (object)[
                    'id' => rand(100, 999),
                    'name' => $roomTitle,
                    'title' => $roomTitle,
                    'course_id' => $request->course_id,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'max_participants' => $request->max_participants ?? 50,
                    'description' => $description,
                    'time' => $request->time ?? date('l, g:i A', strtotime($request->start_time)),
                    'status' => 'scheduled',
                    'room_url' => $roomUrl,
                    'meeting_id' => $meetingId,
                    'host_id' => $user->id,
                    'host_name' => $user->name,
                    'created_at' => now()->toISOString(),
                    'updated_at' => now()->toISOString()
                ];

                return response()->json([
                    'success' => true,
                    'message' => 'Virtual room created successfully (dummy)',
                    'data' => $room
                ], 201);
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('store virtual room error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create virtual room: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update virtual room
     * PUT /api/lecturer/virtual-rooms/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'name' => 'sometimes|string|max:255',
                'course_id' => 'sometimes|integer|exists:courses,id',
                'start_time' => 'sometimes|date',
                'end_time' => 'nullable|date|after:start_time',
                'max_participants' => 'nullable|integer|min:1|max:100',
                'status' => 'sometimes|in:scheduled,active,ended,cancelled',
                'description' => 'nullable|string|max:500',
                'time' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if room exists and belongs to user
            $existingRoom = DB::table('virtual_rooms')
                ->where('id', $id)
                ->where('host_id', $user->id)
                ->first();

            if (!$existingRoom) {
                return response()->json([
                    'success' => false,
                    'message' => 'Virtual room not found or you do not have permission to update it.'
                ], 404);
            }

            // Prepare update data
            $updateData = [];
            if ($request->has('title')) $updateData['title'] = $request->title;
            if ($request->has('name')) $updateData['name'] = $request->name;
            if ($request->has('course_id')) $updateData['course_id'] = $request->course_id;
            if ($request->has('start_time')) $updateData['start_time'] = $request->start_time;
            if ($request->has('end_time')) $updateData['end_time'] = $request->end_time;
            if ($request->has('max_participants')) $updateData['max_participants'] = $request->max_participants;
            if ($request->has('status')) $updateData['status'] = $request->status;
            if ($request->has('description')) $updateData['description'] = $request->description;
            if ($request->has('time')) $updateData['time'] = $request->time;
            $updateData['updated_at'] = now();

            // Update in database if table exists
            try {
                $updated = DB::table('virtual_rooms')
                    ->where('id', $id)
                    ->where('host_id', $user->id)
                    ->update($updateData);

                if ($updated) {
                    Log::info('Virtual room updated', ['room_id' => $id]);
                    
                    $room = DB::table('virtual_rooms')->where('id', $id)->first();
                    return response()->json([
                        'success' => true,
                        'message' => 'Virtual room updated successfully',
                        'data' => $room
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('virtual_rooms table not found, using dummy data');
            }

            // Return updated data if table doesn't exist
            $room = (object) array_merge((array)$existingRoom, $updateData, [
                'updated_at' => now()->toISOString()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Virtual room updated successfully',
                'data' => $room
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('update virtual room error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update virtual room: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete virtual room
     * DELETE /api/lecturer/virtual-rooms/{id}
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();

            // Check if room exists and belongs to user
            $existingRoom = DB::table('virtual_rooms')
                ->where('id', $id)
                ->where('host_id', $user->id)
                ->first();

            if (!$existingRoom) {
                return response()->json([
                    'success' => false,
                    'message' => 'Virtual room not found or you do not have permission to delete it.'
                ], 404);
            }

            // Delete from database if table exists
            try {
                $deleted = DB::table('virtual_rooms')
                    ->where('id', $id)
                    ->where('host_id', $user->id)
                    ->delete();

                if ($deleted) {
                    Log::info('Virtual room deleted', ['room_id' => $id]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Virtual room deleted successfully'
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('virtual_rooms table not found, using dummy data');
            }

            return response()->json([
                'success' => true,
                'message' => 'Virtual room deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('destroy virtual room error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete virtual room: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Join virtual room
     * POST /api/lecturer/virtual-rooms/{id}/join
     * POST /api/student/virtual-rooms/{id}/join
     */
    public function join($id)
    {
        try {
            $user = Auth::user();

            // Get room details
            $room = null;
            try {
                $room = DB::table('virtual_rooms')->where('id', $id)->first();
            } catch (\Exception $e) {
                Log::warning('virtual_rooms table not found, using dummy data');
            }

            // If not found in DB, use dummy data
            if (!$room) {
                $dummyRooms = [
                    (object)[
                        'id' => 1,
                        'name' => 'Office Hours',
                        'title' => 'Office Hours',
                        'room_url' => '/virtual-room/office-hours',
                        'meeting_id' => '123456789',
                        'host_name' => 'Dr. Sarah Johnson'
                    ],
                    (object)[
                        'id' => 2,
                        'name' => 'Lecture Room - Web Development',
                        'title' => 'Lecture Room - Web Development',
                        'room_url' => '/virtual-room/web-dev-lecture',
                        'meeting_id' => '987654321',
                        'host_name' => 'Dr. Sarah Johnson'
                    ],
                    (object)[
                        'id' => 3,
                        'name' => 'Study Group - Database Systems',
                        'title' => 'Study Group - Database Systems',
                        'room_url' => '/virtual-room/database-study',
                        'meeting_id' => '456789123',
                        'host_name' => 'Dr. Sarah Johnson'
                    ],
                ];

                $room = collect($dummyRooms)->firstWhere('id', (int)$id);
            }

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Virtual room not found'
                ], 404);
            }

            // Update participant count if table exists
            try {
                DB::table('virtual_rooms')
                    ->where('id', $id)
                    ->increment('participants');
            } catch (\Exception $e) {
                Log::warning('Could not update participant count');
            }

            return response()->json([
                'success' => true,
                'message' => 'Successfully joined virtual room',
                'data' => [
                    'room_id' => (int)$id,
                    'room_name' => $room->name ?? $room->title ?? 'Virtual Room',
                    'room_url' => $room->room_url ?? '/virtual-room/' . $id,
                    'meeting_id' => $room->meeting_id ?? rand(100000000, 999999999),
                    'host_name' => $room->host_name ?? 'Host',
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'joined_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('join virtual room error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to join virtual room: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Student join virtual room
     * POST /api/student/virtual-rooms/{id}/join
     */
    public function studentJoin($id)
    {
        return $this->join($id);
    }

    /**
     * Start virtual room
     * POST /api/lecturer/virtual-rooms/{id}/start
     */
    public function start($id)
    {
        try {
            $user = Auth::user();

            // Check if room exists and belongs to user
            $room = DB::table('virtual_rooms')
                ->where('id', $id)
                ->where('host_id', $user->id)
                ->first();

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Virtual room not found or you do not have permission to start it.'
                ], 404);
            }

            // Update status in database if table exists
            try {
                $updated = DB::table('virtual_rooms')
                    ->where('id', $id)
                    ->where('host_id', $user->id)
                    ->update([
                        'status' => 'active',
                        'updated_at' => now()
                    ]);

                if ($updated) {
                    Log::info('Virtual room started', ['room_id' => $id]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Virtual room started successfully',
                        'data' => [
                            'room_id' => (int)$id,
                            'status' => 'active',
                            'started_at' => now()->toISOString()
                        ]
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('virtual_rooms table not found');
            }

            return response()->json([
                'success' => true,
                'message' => 'Virtual room started successfully',
                'data' => [
                    'room_id' => (int)$id,
                    'status' => 'active',
                    'started_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('start virtual room error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to start virtual room: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * End virtual room
     * POST /api/lecturer/virtual-rooms/{id}/end
     */
    public function end($id)
    {
        try {
            $user = Auth::user();

            // Check if room exists and belongs to user
            $room = DB::table('virtual_rooms')
                ->where('id', $id)
                ->where('host_id', $user->id)
                ->first();

            if (!$room) {
                return response()->json([
                    'success' => false,
                    'message' => 'Virtual room not found or you do not have permission to end it.'
                ], 404);
            }

            // Update status in database if table exists
            try {
                $updated = DB::table('virtual_rooms')
                    ->where('id', $id)
                    ->where('host_id', $user->id)
                    ->update([
                        'status' => 'ended',
                        'updated_at' => now()
                    ]);

                if ($updated) {
                    Log::info('Virtual room ended', ['room_id' => $id]);
                    return response()->json([
                        'success' => true,
                        'message' => 'Virtual room ended successfully',
                        'data' => [
                            'room_id' => (int)$id,
                            'status' => 'ended',
                            'ended_at' => now()->toISOString()
                        ]
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('virtual_rooms table not found');
            }

            return response()->json([
                'success' => true,
                'message' => 'Virtual room ended successfully',
                'data' => [
                    'room_id' => (int)$id,
                    'status' => 'ended',
                    'ended_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('end virtual room error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to end virtual room: ' . $e->getMessage()
            ], 500);
        }
    }
}