<?php

namespace App\Mail;

use App\Models\Service;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceStatusNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $service;
    public $decision;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Service $service, string $decision)
    {
        $this->service = $service;
        $this->decision = $decision;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $artisanName = $this->service->artisan->user->name ?? 'Artisan';
        $subject = "Mise à jour de votre demande de service : {$this->decision}";

        return $this->subject($subject)
                    ->view('service_status_notification')
                    ->with([
                        'userName' => $this->service->user->name,
                        'artisanName' => $artisanName,
                        'decision' => $this->decision,
                        'service' => $this->service,
                    ]);
    }
}
