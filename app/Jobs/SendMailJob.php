<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        private string $mailer,
        private string $view,
        private array  $data,
        private string $to,
        private string $toName,
        private string $subject,
        private ?string $replyTo = null,
        private ?string $replyToName = null,
        private bool   $isHtml = false,
    ) {}

    public function handle(): void
    {
        try {
            $message = Mail::mailer($this->mailer);

            if ($this->isHtml) {
                $html = view($this->view, $this->data)->render();
                $message->html(
                    $html,
                    function ($m) {
                        $m->to($this->to, $this->toName)->subject($this->subject);
                        if ($this->replyTo) {
                            $m->replyTo($this->replyTo, $this->replyToName ?? $this->replyTo);
                        }
                    }
                );
            } else {
                $message->send(
                    $this->view,
                    $this->data,
                    function ($m) {
                        $m->to($this->to, $this->toName)->subject($this->subject);
                        if ($this->replyTo) {
                            $m->replyTo($this->replyTo, $this->replyToName ?? $this->replyTo);
                        }
                    }
                );
            }
        } catch (\Throwable $e) {
            Log::error('SendMailJob failed', [
                'to'      => $this->to,
                'subject' => $this->subject,
                'error'   => $e->getMessage(),
                'attempt' => $this->attempts(),
            ]);
            $this->fail($e);
        }
    }
}
