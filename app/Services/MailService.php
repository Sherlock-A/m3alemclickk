<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailService
{
    /**
     * Envoie un email OTP de vérification.
     * Retourne ['ok' => true, 'dev_code' => '123456'] ou ['ok' => false, 'error' => '...']
     */
    public function sendVerificationCode(
        string $toEmail,
        string $toName,
        string $code,
        string $sentAt
    ): array {
        try {
            $mailer = $this->resolveMailer();

            Mail::mailer($mailer)->send(
                'emails.verification-code',
                [
                    'userName' => $toName,
                    'code'     => $code,
                    'sentAt'   => $sentAt,
                    'toEmail'  => $toEmail,
                ],
                fn ($m) => $m
                    ->to($toEmail, $toName)
                    ->subject("🔐 Votre code M3allemClick : {$code}")
            );

            return ['ok' => true];

        } catch (\Throwable $e) {
            Log::error('MailService::sendVerificationCode failed', [
                'to'    => $toEmail,
                'error' => $e->getMessage(),
            ]);
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Envoie le lien de réinitialisation de mot de passe.
     */
    public function sendPasswordReset(
        string $toEmail,
        string $toName,
        string $resetUrl,
        string $subject
    ): bool {
        try {
            Mail::mailer($this->resolveMailer())->send(
                'emails.reset-password',
                ['user' => (object) ['name' => $toName, 'email' => $toEmail], 'resetUrl' => $resetUrl, 'expiresIn' => '60 minutes'],
                fn ($m) => $m->to($toEmail, $toName)->subject($subject)
            );
            return true;
        } catch (\Throwable $e) {
            Log::error('MailService::sendPasswordReset failed', ['to' => $toEmail, 'error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Envoie une notification à l'admin pour un nouveau pro.
     */
    public function sendNewProNotification(
        string $proName,
        string $proEmail,
        string $proPhone,
        string $proProfession,
        string $proCity
    ): void {
        $adminEmail = env('ADMIN_EMAIL');
        if (! $adminEmail) return;

        try {
            Mail::mailer($this->resolveMailer())->send(
                'emails.new-professional',
                [
                    'pro' => [
                        'name'          => $proName,
                        'email'         => $proEmail,
                        'phone'         => $proPhone,
                        'profession'    => $proProfession,
                        'city'          => $proCity,
                        'registered_at' => now()->setTimezone('Africa/Casablanca')->format('d/m/Y à H:i'),
                    ],
                    'adminUrl' => config('app.url') . '/dashboard/admin',
                ],
                fn ($m) => $m
                    ->to($adminEmail, 'Admin M3allemClick')
                    ->subject("🔔 Nouveau professionnel : {$proName} ({$proProfession})")
            );
        } catch (\Throwable $e) {
            Log::warning('Admin notification email failed', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Notifie le professionnel que son profil est approuvé.
     */
    public function sendProApproved(
        string $toEmail,
        string $toName,
        string $proProfession,
        string $proCity
    ): void {
        try {
            Mail::mailer($this->resolveMailer())->send(
                'emails.pro-approved',
                [
                    'proName'      => $toName,
                    'proEmail'     => $toEmail,
                    'proProfession'=> $proProfession,
                    'proCity'      => $proCity,
                    'dashboardUrl' => config('app.url') . '/dashboard/professional',
                ],
                fn ($m) => $m
                    ->to($toEmail, $toName)
                    ->subject('✅ Votre profil Jobly est approuvé ! Bienvenue')
            );
        } catch (\Throwable $e) {
            Log::warning('MailService::sendProApproved failed', ['to' => $toEmail, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Notifie le professionnel que son profil est rejeté.
     */
    public function sendProRejected(
        string $toEmail,
        string $toName,
        ?string $rejectionReason = null
    ): void {
        try {
            Mail::mailer($this->resolveMailer())->send(
                'emails.pro-rejected',
                [
                    'proName'         => $toName,
                    'proEmail'        => $toEmail,
                    'rejectionReason' => $rejectionReason,
                    'contactUrl'      => config('app.url') . '/contact',
                ],
                fn ($m) => $m
                    ->to($toEmail, $toName)
                    ->subject('Jobly — Mise à jour de votre demande d\'inscription')
            );
        } catch (\Throwable $e) {
            Log::warning('MailService::sendProRejected failed', ['to' => $toEmail, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Envoie un message de contact (formulaire public → admin).
     */
    public function sendContactMessage(
        string $fromName,
        string $fromEmail,
        string $subject,
        string $message
    ): bool {
        $contactEmail = env('CONTACT_EMAIL', env('ADMIN_EMAIL'));
        if (! $contactEmail) return false;

        try {
            Mail::mailer($this->resolveMailer())->html(
                view('emails.contact-message', compact('fromName', 'fromEmail', 'subject', 'message'))->render(),
                fn ($m) => $m
                    ->to($contactEmail, 'Jobly Contact')
                    ->replyTo($fromEmail, $fromName)
                    ->subject("📬 Contact Jobly : {$subject}")
            );
            return true;
        } catch (\Throwable $e) {
            Log::warning('MailService::sendContactMessage failed', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Choisit le bon mailer selon la config .env.
     * Priorité : MAIL_MAILER explicite → resend si clé présente → gmail si dispo → log
     */
    private function resolveMailer(): string
    {
        $configured = config('mail.default', 'log');

        // Si explicitement configuré (pas "log"), on l'utilise
        if ($configured !== 'log') {
            return $configured;
        }

        // Auto-detect selon les credentials disponibles
        if (env('RESEND_API_KEY')) {
            return 'resend';
        }

        if (env('GMAIL_ADDRESS') && env('GMAIL_APP_PASSWORD')) {
            return 'gmail';
        }

        if (env('MAILTRAP_USERNAME') && env('MAILTRAP_PASSWORD')) {
            return 'mailtrap';
        }

        return 'log';
    }
}
