<?php

return [
    'apps' => [
        [
            'id' => env('REVERB_APP_ID', '123456'),
            'key' => env('REVERB_APP_KEY', 'test-key'),
            'secret' => env('REVERB_APP_SECRET', 'test-secret'),
            'host' => env('REVERB_HOST', '127.0.0.1'),
            'port' => env('REVERB_PORT', 8080),
            'scheme' => env('REVERB_SCHEME', 'http'),
        ],
    ],
];