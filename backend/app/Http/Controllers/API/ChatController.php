<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getGroups(Request $request)
    {
        return response()->json([
            'message' => 'Get groups endpoint',
            'groups' => []
        ]);
    }
    
    public function createGroup(Request $request)
    {
        return response()->json([
            'message' => 'Create group endpoint'
        ]);
    }
    
    public function getMessages(Request $request, $id)
    {
        return response()->json([
            'message' => 'Get messages for group ' . $id
        ]);
    }
    
    public function sendMessage(Request $request, $id)
    {
        return response()->json([
            'message' => 'Send message to group ' . $id
        ]);
    }
    
    public function joinGroup(Request $request, $id)
    {
        return response()->json([
            'message' => 'Join group ' . $id
        ]);
    }
    
    public function leaveGroup(Request $request, $id)
    {
        return response()->json([
            'message' => 'Leave group ' . $id
        ]);
    }
}