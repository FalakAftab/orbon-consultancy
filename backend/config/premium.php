<?php

return [
    'application_fee_usd' => (int) env('PREMIUM_APPLICATION_FEE_USD', 100),
    'payment_instructions' => (string) env(
        'PAYMENT_INSTRUCTIONS',
        'Please use the payment instructions provided by Orbon Consultancy and include your invoice reference.'
    ),
];