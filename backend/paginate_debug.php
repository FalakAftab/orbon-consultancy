<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Repositories\Contracts\ProgramRepositoryInterface;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use App\Models\University;
use App\Models\User;

// Direct repository call
$programs = app(ProgramRepositoryInterface::class)->paginate(['per_page' => 10], 10);
echo "Programs paginator class: ".get_class($programs).PHP_EOL;
echo "Programs total: ".$programs->total().PHP_EOL;
echo "Programs last_page: ".$programs->lastPage().PHP_EOL;
echo "Programs per_page: ".$programs->perPage().PHP_EOL;
echo "Programs current_page: ".$programs->currentPage().PHP_EOL;

// What does ->through() produce when json-serialized at top level?
$through = $programs->through(fn (Program $p) => ProgramResource::make($p));
echo "Through class: ".get_class($through).PHP_EOL;
$arr = $through->toArray(request());
echo "toArray keys: ".implode(', ', array_keys($arr)).PHP_EOL;
echo "toArray meta: ".json_encode($arr['meta'] ?? 'NO META KEY').PHP_EOL;
echo "toArray links present: ".(isset($arr['links']) ? 'yes' : 'no').PHP_EOL;

// Compare with plain paginate serialization
$u = app(\App\Repositories\Contracts\UniversityRepositoryInterface::class)->paginate([], 10);
$uArr = $u->toArray(request());
echo PHP_EOL."University toArray keys: ".implode(', ', array_keys($uArr)).PHP_EOL;
echo "University meta: ".json_encode($uArr['meta'] ?? 'NO META KEY').PHP_EOL;
