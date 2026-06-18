<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function getEvents()
    {
        return response()->json(['events' => []]);
    }
    
    public function createEvent(Request $request)
    {
        return response()->json(['message' => 'Event created successfully']);
    }
    
    public function updateEvent($eventId, Request $request)
    {
        return response()->json(['message' => 'Event updated successfully']);
    }
    
    public function deleteEvent($eventId)
    {
        return response()->json(['message' => 'Event deleted successfully']);
    }
    
    public function getDeadlines()
    {
        return response()->json(['deadlines' => []]);
    }
}