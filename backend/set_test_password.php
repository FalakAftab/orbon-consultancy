<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Set a known password for the test student and admin so we can run
// end-to-end HTTP verification against the real backend.
$student = User::where('email', 'falakjarral044@gmail.com')->first();
if ($student) {
    $student->password = Hash::make('TestPass123!');
    $student->save();
    echo "Student password set to TestPass123!\n";
}

$admin = User::where('email', 'admin@germany-edu.test')->first();
if ($admin) {
    $admin->password = Hash::make('TestPass123!');
    $admin->save();
    echo "Admin password set to TestPass123!\n";
}
