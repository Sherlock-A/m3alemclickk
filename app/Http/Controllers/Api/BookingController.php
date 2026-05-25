<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Professional;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /** POST /api/professionals/{professional}/book — public */
    public function store(Request $request, Professional $professional): JsonResponse
    {
        $data = $request->validate([
            'client_name'    => 'required|string|max:100|regex:/^[^<>{}\/\\\\]+$/u',
            'client_phone'   => 'required|string|max:20',
            'client_email'   => 'nullable|email|max:150',
            'service'        => 'nullable|string|max:150',
            'preferred_date' => 'nullable|date|after_or_equal:today',
            'preferred_time' => 'nullable|in:matin,après-midi,soir',
            'notes'          => 'nullable|string|max:500',
        ]);

        $booking = $professional->bookings()->create($data);

        return response()->json(['message' => 'Réservation enregistrée.', 'id' => $booking->id], 201);
    }

    /** GET /api/pro/bookings — jwt:professional */
    public function forProfessional(Request $request): JsonResponse
    {
        $proId = $request->attributes->get('jwt_professional_id');

        $bookings = Booking::where('professional_id', $proId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($bookings);
    }

    /** PATCH /api/pro/bookings/{booking}/status — jwt:professional */
    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $proId = $request->attributes->get('jwt_professional_id');

        if ($booking->professional_id !== $proId) {
            return response()->json(['message' => 'Interdit.'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,done',
        ]);

        $booking->update($data);

        return response()->json(['message' => 'Statut mis à jour.']);
    }
}
