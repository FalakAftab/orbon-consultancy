<?php

namespace App\Enums;

enum AdmissionPreference: string
{
    case UniAssistOnly = 'uni_assist_only';
    case DirectPortalOnly = 'direct_portal_only';
    case Both = 'both';
}
