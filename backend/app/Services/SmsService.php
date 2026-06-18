<?php

namespace App\Services;

use AfricasTalking\SDK\AfricasTalking;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $client;
    protected $sms;

    public function __construct()
    {
        try {
            $this->client = new AfricasTalking(
                env('AFRICASTALKING_USERNAME', 'sandbox'),
                env('AFRICASTALKING_API_KEY')
            );
            $this->sms = $this->client->sms();
        } catch (\Exception $e) {
            Log::error('SMS Service initialization failed: ' . $e->getMessage());
        }
    }

    /**
     * Send SMS to a single recipient
     */
    public function sendSms($recipient, $message, $senderId = null)
    {
        try {
            $response = $this->sms->send([
                'to' => $this->formatPhoneNumber($recipient),
                'message' => $message,
                'from' => $senderId ?? env('AFRICASTALKING_SENDER_ID', 'UCC')
            ]);

            Log::info('SMS sent successfully', [
                'recipient' => $recipient,
                'message' => substr($message, 0, 50)
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('SMS sending failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Send SMS to multiple recipients
     */
    public function sendBulkSms($recipients, $message, $senderId = null)
    {
        try {
            $formattedRecipients = array_map([$this, 'formatPhoneNumber'], $recipients);
            
            $response = $this->sms->send([
                'to' => $formattedRecipients,
                'message' => $message,
                'from' => $senderId ?? env('AFRICASTALKING_SENDER_ID', 'UCC')
            ]);

            Log::info('Bulk SMS sent', [
                'recipients_count' => count($recipients)
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::error('Bulk SMS sending failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Format phone number to international format
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

    /**
     * Check SMS balance
     */
    public function checkBalance()
    {
        try {
            $airtime = $this->client->airtime();
            return $airtime->send([
                'recipients' => [
                    [
                        'phoneNumber' => '+255123456789',
                        'currencyCode' => 'TZS',
                        'amount' => 1
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Balance check failed: ' . $e->getMessage());
            return null;
        }
    }
}