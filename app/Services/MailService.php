<?php

namespace App\Services;

use App\Jobs\SendMailJob;
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
            // OTP codes are time-sensitive — send synchronously so the user gets it immediately
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
        // Password reset links are time-sensitive — send synchronously
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

        SendMailJob::dispatch(
            $this->resolveMailer(),
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
            $adminEmail,
            'Admin M3allemClick',
            "🔔 Nouveau professionnel : {$proName} ({$proProfession})",
        );
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
        SendMailJob::dispatch(
            $this->resolveMailer(),
            'emails.pro-approved',
            [
                'proName'       => $toName,
                'proEmail'      => $toEmail,
                'proProfession' => $proProfession,
                'proCity'       => $proCity,
                'dashboardUrl'  => config('app.url') . '/dashboard/professional',
            ],
            $toEmail,
            $toName,
            '✅ Votre profil M3allemClick est approuvé ! Bienvenue',
        );
    }

    /**
     * Notifie le professionnel que son profil est rejeté.
     */
    public function sendProRejected(
        string $toEmail,
        string $toName,
        ?string $rejectionReason = null
    ): void {
        SendMailJob::dispatch(
            $this->resolveMailer(),
            'emails.pro-rejected',
            [
                'proName'         => $toName,
                'proEmail'        => $toEmail,
                'rejectionReason' => $rejectionReason,
                'contactUrl'      => config('app.url') . '/contact',
            ],
            $toEmail,
            $toName,
            'M3allemClick — Mise à jour de votre demande d\'inscription',
        );
    }

    /**
     * Notifie un professionnel qu'il a reçu une demande de devis.
     */
    public function sendContactRequestNotification(
        string $proEmail,
        string $proName,
        string $clientName,
        string $clientEmail,
        string $clientPhone,
        string $subject,
        string $message,
        string $dashboardUrl
    ): void {
        SendMailJob::dispatch(
            $this->resolveMailer(),
            'emails.contact-request',
            compact('proName', 'clientName', 'clientEmail', 'clientPhone', 'subject', 'message', 'dashboardUrl'),
            $proEmail,
            $proName,
            "📩 Nouvelle demande de devis — {$subject}",
            $clientEmail ?: $proEmail,
            $clientName,
            true, // isHtml view
        );
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

        SendMailJob::dispatch(
            $this->resolveMailer(),
            'emails.contact-message',
            compact('fromName', 'fromEmail', 'subject', 'message'),
            $contactEmail,
            'M3allemClick Contact',
            "📬 Contact M3allemClick : {$subject}",
            $fromEmail,
            $fromName,
            true, // isHtml view
        );

        return true;
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
