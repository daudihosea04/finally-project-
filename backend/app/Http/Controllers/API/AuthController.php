<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Lecturer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            Log::info('🔐 Login attempt', ['email' => $request->email]);

            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                Log::warning('❌ Login failed: User not found', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password'
                ], 401);
            }

            Log::info('👤 User found', ['user_id' => $user->id, 'role' => $user->role]);

            if (!Hash::check($request->password, $user->password)) {
                Log::warning('❌ Login failed: Invalid password', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password'
                ], 401);
            }

            Log::info('✅ Password verified', ['user_id' => $user->id]);

            // Allow: 'active', 'online', 'offline'
            // Block: 'inactive', 'suspended', 'blocked', 'pending'
            $blockedStatuses = ['inactive', 'suspended', 'blocked', 'pending'];
            
            if (in_array($user->status, $blockedStatuses)) {
                Log::warning('⚠️ Login failed: Account blocked/inactive', [
                    'email' => $request->email,
                    'status' => $user->status
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is not active. Please contact support or request reactivation.'
                ], 401);
            }

            if (!$user->is_active) {
                Log::warning('⚠️ Login failed: Account deactivated', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been deactivated. Please contact support or request reactivation.'
                ], 401);
            }

            if ($user->role === 'student') {
                $student = Student::where('user_id', $user->id)->first();
                if ($student && !$student->is_active) {
                    Log::warning('⚠️ Login failed: Student not approved', ['user_id' => $user->id]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Your student account is pending admin approval. Please contact support.'
                    ], 401);
                }
            }

            if ($user->role === 'lecturer') {
                $lecturer = Lecturer::where('user_id', $user->id)->first();
                if ($lecturer && !$lecturer->is_active) {
                    Log::warning('⚠️ Login failed: Lecturer not approved', ['user_id' => $user->id]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Your lecturer account is pending admin approval. Please contact support.'
                    ], 401);
                }
            }

            $user->update([
                'status' => 'online',
                'last_login_at' => now(),
                'is_online' => true
            ]);

            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('✅ Login successful', ['user_id' => $user->id, 'role' => $user->role]);

            // Convert Eloquent Models to Plain Arrays
            $profileData = null;
            
            if ($user->role === 'student') {
                $profile = Student::where('user_id', $user->id)->first();
                if ($profile) {
                    $profileData = [
                        'id' => $profile->id,
                        'registration_number' => $profile->registration_number ?? null,
                        'programme' => $profile->programme ?? null,
                        'year_of_study' => $profile->year_of_study ?? null,
                        'enrollment_status' => $profile->enrollment_status ?? null,
                    ];
                }
            } elseif ($user->role === 'lecturer') {
                $profile = Lecturer::where('user_id', $user->id)->first();
                if ($profile) {
                    $profileData = [
                        'id' => $profile->id,
                        'staff_number' => $profile->staff_number ?? null,
                        'department' => $profile->department ?? null,
                        'specialization' => $profile->specialization ?? null,
                        'employment_status' => $profile->employment_status ?? null,
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'role_label' => $user->role_label ?? ucfirst($user->role),
                    'profile_photo_url' => $user->profile_photo_url,
                    'is_online' => $user->is_online,
                    'online_status' => $user->online_status ?? ($user->is_online ? 'online' : 'offline'),
                    'last_login_at' => $user->last_login_at,
                    'is_active' => $user->is_active,
                    'initials' => $user->initials ?? strtoupper(substr($user->name, 0, 2)),
                    'display_name' => $user->display_name ?? $user->name . ' (' . ucfirst($user->role) . ')',
                    'profile' => $profileData
                ],
                'dashboard_url' => $user->getDashboardRoute() ?? '/dashboard'
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Login error: ' . $e->getMessage());
            Log::error('❌ Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'user' => $request->user()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user: ' . $e->getMessage()
            ], 500);
        }
    }
}