<?php

namespace App\Enums;

enum EligibilityStatus: string
{
    case Eligible = 'eligible';
    case Partial = 'partial';
    case NotEligible = 'not_eligible';
}
