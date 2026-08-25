<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

echo "Users:".PHP_EOL;
$users = User::all(['id', 'name', 'email', 'role', 'student_id']);
foreach ($users as $u) {
    echo "  id={$u->id} role={$u->role} email={$u->email} name={$u->name} student_id=".($u->student_id ?? 'null').PHP_EOL;
}
