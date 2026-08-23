<?php

namespace App\Enums;

enum TuitionPreference: string
{
    case FreeOnly = 'free_only';
    case PaidOnly = 'paid_only';
    case Both = 'both';
}
