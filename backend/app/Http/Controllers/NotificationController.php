/**
 * Send SMS notification to user
 */
public function sendSmsNotification(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = \App\Models\User::find($request->user_id);
        $phone = $user->phone ?? $user->student->phone ?? null;

        if (!$phone) {
            return response()->json([
                'success' => false,
                'message' => 'User does not have a phone number'
            ], 400);
        }

        // Use default sender ID from .env
        $result = $this->smsService->sendSms($phone, $request->message);

        // OR specify sender ID directly
        // $result = $this->smsService->sendSms($phone, $request->message, 'ucc_connect_hub');

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => 'SMS sent successfully',
                'data' => $result
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);

    } catch (\Exception $e) {
        Log::error('SMS notification error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to send SMS notification'
        ], 500);
    }
}