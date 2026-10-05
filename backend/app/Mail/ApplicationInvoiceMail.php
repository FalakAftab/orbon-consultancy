<?php

namespace App\Mail;

use App\Models\PremiumApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApplicationInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly PremiumApplication $application,
        public readonly string $invoiceReference,
        public readonly int $amountUsd,
        public readonly string $paymentInstructions,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Orbon Consultancy invoice {$this->invoiceReference}",
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.application-invoice');
    }
}