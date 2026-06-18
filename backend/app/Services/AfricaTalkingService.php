<?php

namespace App\Services;

use AfricasTalking\SDK\AfricasTalking;
use Illuminate\Support\Facades\Log;

class AfricaTalkingService
{
    protected $client;
    protected $sms;
    protected $username;
    protected $apiKey;

    public function __construct()
    {
        $this->username = env('AFRICA_TALKING_USERNAME', 'sandbox');
        $this->apiKey = env('AFRICA_TALKING_API_KEY');

        try {
            $this->client = new AfricasTalking($this->username, $this->apiKey);
            $this->sms = $this->client->sms();
        } catch (\Exception $e) {
            Log::error('Africa's Talking initialization failed: ' . $e->getMessage());
        }
    }

    /**
     * Send single SMS
     */
    public function sendSms($phoneNumber, $message, $senderId = null)
    {
        try {
            $phone = $this->formatPhoneNumber($phoneNumber);
	$sender = $senderId ?? env('AFRICA_TALKING_SENDER_ID', 'ucc_connect_hub');

            $response = $this->sms->send([
                'to' => $phone,
                'message' => $message,
                'from' => $sender
            ]);

            Log::info('Africa\'s Talking SMS sent', [
                'to' => $phone,
                'message' => substr($message, 0, 50)
            ]);

            return [
                'success' => true,
                'data' => $response
            ];

        } catch (\Exception $e) {
            Log::error('Africa\'s Talking send error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Send bulk SMS
     */
    public function sendBulkSms($recipients, $message, $senderId = null)
    {
        try {
            $formattedNumbers = array_map([$this, 'formatPhoneNumber'], $recipients);
            $sender = $senderId ?? env('AFRICA_TALKING_SENDER_ID', 'UCCHub');

            $response = $this->sms->send([
                'to' => $formattedNumbers,
                'message' => $message,
                'from' => $sender
            ]);

            Log::info('Africa\'s Talking bulk SMS sent', [
                'recipients' => count($formattedNumbers)
            ]);

            return [
                'success' => true,
                'data' => $response
            ];

        } catch (\Exception $e) {
            Log::error('Africa\'s Talking bulk send error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Check SMS balance
     */
    public function checkBalance()
    {
        try {
            // Africa's Talking doesn't have direct balance API via SDK
            // You need to check via their dashboard or API
            return [
                'success' => true,
                'message' => 'Check balance via Africa\'s Talking dashboard',
                'balance' => 'N/A'
            ];
        } catch (\Exception $e) {
            Log::error('Balance check error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Format phone number
     */
    protected function formatPhoneNumber($phone)
    {
        // Remove any non-numeric characters
        $phone = preg_replace('/[^0-9]/', '', $phone);

        // If number starts with 0, replace with 255 (Tanzania)
        if (substr($phone, 0, 1) === '0') {
            $phone = '255' . substr($phone, 1);
        }

        // If number doesn't start with 255, add it
        if (substr($phone, 0, 3) !== '255') {
            $phone = '255' . $phone;
        }

        return $phone;
    }
}