<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('app:health', function () {
    $this->info('Application is healthy.');
})->purpose('Display application health');
