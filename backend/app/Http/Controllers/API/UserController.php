<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get all users (Admin only)
     */
    public function index(Request $request)
    {
        $users = User::paginate(20);
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Get user by ID
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'department' => 'sometimes|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'email', 'phone', 'department']));

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    /**
     * Delete user (Admin only)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * Get users by role
     */
    public function getByRole($role)
    {
        $users = User::where('role', $role)->get();
        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Get all students
     */
    public function getStudents()
    {
        $students = User::where('role', 'student')->get();
        return response()->json([
            'success' => true,
            'data' => $students
        ]);
    }

    /**
     * Get all lecturers
     */
    public function getLecturers()
    {
        $lecturers = User::where('role', 'lecturer')->get();
        return response()->json([
            'success' => true,
            'data' => $lecturers
        ]);
    }

    /**
     * Get all admins
     */
    public function getAdmins()
    {
        $admins = User::where('role', 'admin')->get();
        return response()->json([
            'success' => true,
            'data' => $admins
        ]);
    }
}