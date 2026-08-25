<?php

return [
    'default' => env('CACHE_STORE', 'database'),
    'stores' => [
        'database' => [
            'driver' => 'database',
            'table' => 'cache',
            'connection' => env('DB_CONNECTION', 'pgsql'),
            'lock_connection' => env('DB_CONNECTION', 'pgsql'),
        ],
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
        ],
    ],
    'prefix' => env('CACHE_PREFIX', strtolower((string) env('APP_NAME', 'laravel')).'_cache'),
];
