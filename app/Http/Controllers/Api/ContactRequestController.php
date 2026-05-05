<?php

namespace App\Http\Controllers\Api;

use App\Events\ProNotification;
use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use App\Models\Professional;
use App\Models\Review;
use App\Services\MailService;
use Illuminate\Http\Request;

class ContactRequestController extends Controller
{
    public function __construct(private MailService $mail) {}

    // POST /api/professionals/{professional}/contact  (public, throttled)
    public function store(Request $request, Professional $professional)
    {
        $data = $request->validate([
            'client_name'  => ['required', 'string', 'max:100'],
            'client_email' => ['nullable', 'email', 'max:254'],
            'client_phone' => ['nullable', 'string', 'max:25'],
            'subject'      => ['nullable', 'string', 'max:150'],
            'message'      => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $subject = $data['subject'] ?? 'Demande de renseignement';

        ContactRequest::create([
            'professional_id' => $professional->id,
            'client_name'     => $data['client_name'],
            'client_email'    => $data['client_email'] ?? null,
            'client_phone'    => $data['client_phone'] ?? null,
            'subject'         => $subject,
            'message'         => $data['message'],
        ]);

        // Notify the professional by email (best-effort)
        $proUser = $professional->user;
        if ($proUser && $proUser->email) {
            $this->mail->sendContactRequestNotification(
                proEmail:    $proUser->email,
                proName:     $professional->name,
                clientName:  $data['client_name'],
                clientEmail: $data['client_email'] ?? '',
                clientPhone: $data['client_phone'] ?? '',
                subject:     $subject,
                message:     $data['message'],
                dashboardUrl: config('app.url') . '/dashboard/professional',
            );
        }

        // Broadcast real-time badge update to the professional
        $proUser = $proUser ?? $professional->user;
        if ($proUser && $professional->id) {
            $newQuotes  = ContactRequest::where('professional_id', $professional->id)->where('status', 'new')->count();
            $newReviews = Review::where('professional_id', $professional->id)->where('approved', false)->count();
            broadcast(new ProNotification($professional->id, $newQuotes + $newReviews))->toOthers();
        }

        return response()->json([
            'success' => true,
            'message' => 'Votre message a été envoyé avec succès.',
        ], 201);
    }

    // GET /api/pro/contact-requests  (jwt:professional)
    public function forProfessional(Request $request)
    {
        $user = $request->user();
        $proId = $user->professional_id;

        if (! $proId) {
            return response()->json(['items' => []]);
        }

        $requests = ContactRequest::where('professional_id', $proId)
            ->latest()
            ->take(50)
            ->get(['id', 'client_name', 'client_email', 'client_phone', 'subject', 'message', 'status', 'created_at']);

        // Mark new ones as read
        ContactRequest::where('professional_id', $proId)
            ->where('status', 'new')
            ->update(['status' => 'read']);

        return response()->json(['items' => $requests]);
    }

    // GET /api/client/contact-requests  (jwt:client)
    public function forClient(Request $request)
    {
        $email = $request->user()->email;

        $requests = ContactRequest::with(['professional:id,name,profession,main_city,slug'])
            ->where('client_email', $email)
            ->latest()
            ->take(50)
            ->get(['id', 'professional_id', 'subject', 'message', 'status', 'created_at']);

        return response()->json(['items' => $requests]);
    }
}
