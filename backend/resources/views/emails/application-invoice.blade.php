<!doctype html>
<html lang="en">
<body style="margin:0;background:#f6f8fb;color:#172033;font-family:Arial,sans-serif;line-height:1.55;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
        <tr><td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #dbe5ed;border-radius:8px;overflow:hidden;">
                <tr><td style="padding:28px 32px;background:#0f172a;color:#ffffff;">
                    <div style="font-size:20px;font-weight:700;">Orbon Consultancy</div>
                    <div style="margin-top:4px;color:#dbe5ed;font-size:13px;">Apply-for-Me invoice / payment challan</div>
                </td></tr>
                <tr><td style="padding:30px 32px;">
                    <p style="margin-top:0;">Hello {{ $application->user->name }},</p>
                    <p>Your Apply-for-Me request has been received. This email is your payment challan for our Premium application service.</p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;border:1px solid #dbe5ed;border-radius:6px;">
                        <tr><td style="padding:12px 16px;color:#64748b;font-size:13px;">Invoice reference</td><td style="padding:12px 16px;text-align:right;font-weight:700;">{{ $invoiceReference }}</td></tr>
                        <tr><td style="padding:12px 16px;color:#64748b;font-size:13px;border-top:1px solid #e9eef4;">Requested field</td><td style="padding:12px 16px;text-align:right;border-top:1px solid #e9eef4;">{{ $application->program?->name ?? $application->requested_field ?? 'Advisor matching in progress' }}</td></tr>
                        <tr><td style="padding:14px 16px;color:#0f172a;font-weight:700;border-top:1px solid #e9eef4;">Premium application service</td><td style="padding:14px 16px;text-align:right;font-size:20px;font-weight:700;color:#b7791f;border-top:1px solid #e9eef4;">USD {{ number_format($amountUsd) }}</td></tr>
                    </table>
                    <p style="font-weight:700;margin-bottom:6px;">Payment instructions</p>
                    <p style="margin-top:0;white-space:pre-line;">{{ $paymentInstructions }}</p>
                    <p>After payment, upload your receipt and transaction reference in your Apply-for-Me dashboard. Our team will confirm the transfer before activating Premium service.</p>
                    <p style="margin-bottom:0;">Regards,<br>Orbon Consultancy</p>
                </td></tr>
            </table>
        </td></tr>
    </table>
</body>
</html>