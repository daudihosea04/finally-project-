<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NextSmsService
{
    protected $username;
    protected $apiKey;
    protected $senderId;
    protected $baseUrl;

    public function __construct()
    {
        $this->username = env('NEXT_SMS_USERNAME');
        $this->apiKey = env('NEXT_SMS_API_KEY');
        $this->senderId = env('NEXT_SMS_SENDER_ID', 'UCCHub');
        $this->baseUrl = env('NEXT_SMS_BASE_URL', 'https://api.nextsms.co.tz/api/v1');
    }

    /**
     * Send single SMS
     */
    public function sendSms($phoneNumber, $message, $senderId = null)
    {
        try {
            $phone = $this->formatPhoneNumber($phoneNumber);
            $credentials = base64_encode($this->username . ':' . $this->apiKey);

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . $credentials,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])->post($this->baseUrl . '/sms/send', [
                'to' => $phone,
                'message' => $message,
                'from' => $senderId ?? $this->senderId
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'message' => $response->body()
            ];

        } catch (\Exception $e) {
            Log::error('NextSMS send error: ' . $e->getMessage());
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
            $credentials = base64_encode($this->username . ':' . $this->apiKey);

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . $credentials,
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ])->post($this->baseUrl . '/sms/bulk', [
                'to' => $formattedNumbers,
                'message' => $message,
                'from' => $senderId ?? $this->senderId
            ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            return [
                'success' => false,
                'message' => $response->body()
            ];

        } catch (\Exception $e) {
            Log::error('NextSMS bulk send error: ' . $e->getMessage());
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
            $credentials = base64_encode($this->username . ':' . $this->apiKey);

            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . $credentials,
                'Accept' => 'application/json'
            ])->get($this->baseUrl . '/balance');

            if ($response->successful()) {
                return [
                    'success' => true,
                    'balance' => $response->json('balance', 0),
                    'currency' => $response->json('currency', 'TZS')
                ];
            }

            return [
                'success' => false,
                'message' => $response->body()
            ];

        } catch (\Exception $e) {
            Log::error('NextSMS balance check error: ' . $e->getMessage());
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
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (substr($phone, 0, 1) === '0') {
            $phone = '255' . substr($phone, 1);
        }

        if (substr($phone, 0, 3) !== '255') {
            $phone = '255' . $phone;
        }

        return $phone;
    }
}