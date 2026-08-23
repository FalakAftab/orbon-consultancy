<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Program;

$programs = Program::where('name', 'LIKE', '%Data Science%')->get();
foreach ($programs as $p) {
    echo "ID: {$p->id} | Name: {$p->name} | Subject Category: [{$p->subject_category}] | Field: [{$p->field}]\n";
}
