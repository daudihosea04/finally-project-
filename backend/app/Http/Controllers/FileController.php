<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        return response()->json(['message' => 'File uploaded']);
    }
    
    public function download($fileId)
    {
        return response()->json(['message' => 'File downloaded']);
    }
    
    public function delete($fileId)
    {
        return response()->json(['message' => 'File deleted']);
    }
    
    public function getMyFiles()
    {
        return response()->json(['files' => []]);
    }
}