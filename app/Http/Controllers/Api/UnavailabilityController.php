<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalUnavailability;
use Illuminate\Http\Request;

class UnavailabilityController extends Controller
{
    // GET /api/pro/unavailabilities
    public function index(Request $request)
    {
        $proId = $request->user()->professional_id;

        $items = ProfessionalUnavailability::where('professional_id', $proId)
            ->where('to_date', '>=', now()->toDateString())
            ->orderBy('from_date')
            ->get(['id', 'from_date', 'to_date', 'reason']);

        return response()->json(['items' => $items]);
    }

    // POST /api/pro/unavailabilities
    public function store(Request $request)
    {
        $proId = $request->user()->professional_id;
        if (! $proId) {
            return response()->json(['message' => 'Profil introuvable.'], 404);
        }

        $data = $request->validate([
            'from_date' => ['required', 'date', 'after_or_equal:today'],
            'to_date'   => ['required', 'date', 'after_or_equal:from_date'],
            'reason'    => ['nullable', 'string', 'max:200'],
        ]);

        $item = ProfessionalUnavailability::create([
            'professional_id' => $proId,
            'from_date'       => $data['from_date'],
            'to_date'         => $data['to_date'],
            'reason'          => $data['reason'] ?? null,
        ]);

        return response()->json(['success' => true, 'item' => $item], 201);
    }

    // DELETE /api/pro/unavailabilities/{id}
    public function destroy(Request $request, ProfessionalUnavailability $unavailability)
    {
        $proId = $request->user()->professional_id;

        if ($unavailability->professional_id !== $proId) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $unavailability->delete();

        return response()->json(['success' => true]);
    }
}
