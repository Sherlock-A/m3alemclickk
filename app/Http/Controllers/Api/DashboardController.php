<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\Review;
use App\Models\Tracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function professional(Request $request)
    {
        $user = $request->user();
        $professional = $user->professional;

        if (! $professional) {
            return response()->json(['message' => 'Profil professionnel introuvable.'], 404);
        }

        $weekly = Tracking::query()
            ->selectRaw("DATE(created_at) as date, DATE_FORMAT(MIN(created_at), '%a') as day, count(*) as total")
            ->where('professional_id', $professional->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy(DB::raw("DATE(created_at)"))
            ->orderByRaw('DATE(created_at)')
            ->get();

        $reviews = Review::where('professional_id', $professional->id)
            ->orderByDesc('created_at')
            ->get(['id', 'client_name', 'rating', 'comment', 'approved', 'pro_response', 'pro_responded_at', 'created_at']);

        return response()->json([
            'professional' => $professional,
            'stats' => [
                'views'          => $professional->views,
                'whatsappClicks' => $professional->whatsapp_clicks,
                'calls'          => $professional->calls,
            ],
            'weekly'  => $weekly,
            'reviews' => $reviews,
        ]);
    }

    public function updateProfessional(Request $request)
    {
        $user = $request->user();
        $professional = $user->professional;

        if (! $professional) {
            return response()->json(['message' => 'Profil professionnel introuvable.'], 404);
        }

        $data = $request->validate([
            'name'            => ['required', 'string', 'max:100'],
            'profession'      => ['required', 'string', 'max:100'],
            'main_city'       => ['required', 'string', 'max:100'],
            'phone'           => ['nullable', 'string', 'max:20'],
            'travel_cities'   => ['array'],
            'travel_cities.*' => ['string'],
            'languages'       => ['array'],
            'languages.*'     => ['string'],
            'description'     => ['nullable', 'string', 'max:1000'],
            'photo'           => ['nullable', 'string'],
            'portfolio'       => ['nullable', 'array'],
            'portfolio.*'     => ['string'],
            'is_available'    => ['boolean'],
        ]);

        $professional->update($data);

        return response()->json([
            'success'      => true,
            'professional' => $professional->fresh(),
        ]);
    }

    public function admin()
    {
        $pendingPros = \App\Models\User::where('role', 'professional')->where('status', 'pending')->count();

        return response()->json([
            'stats' => [
                'professionals' => Professional::approved()->count(),
                'verified'      => Professional::approved()->where('verified', true)->count(),
                'pendingPros'   => $pendingPros,
                'pendingReviews'=> Review::where('approved', false)->count(),
                'views'         => Tracking::where('type', 'view')->count(),
                'whatsapp'      => Tracking::where('type', 'whatsapp')->count(),
                'calls'         => Tracking::where('type', 'call')->count(),
            ],
            'topPros'      => Professional::approved()->orderByDesc('views')->take(5)->get(['id', 'name', 'profession', 'views', 'rating']),
            'services'     => Professional::approved()->select('profession', DB::raw('count(*) as total'))->groupBy('profession')->orderByDesc('total')->take(8)->get(),
            'reviewsQueue' => Review::with('professional')->where('approved', false)->latest()->take(10)->get(),
        ]);
    }

    public function exportCsv()
    {
        $rows = Professional::approved()->get(['name', 'profession', 'main_city', 'phone', 'rating', 'verified']);

        $csv = implode(',', ['name', 'profession', 'main_city', 'phone', 'rating', 'verified'])."\n";
        foreach ($rows as $row) {
            $csv .= implode(',', [
                '"'.$row->name.'"',
                '"'.$row->profession.'"',
                '"'.$row->main_city.'"',
                '"'.$row->phone.'"',
                $row->rating,
                $row->verified ? 'yes' : 'no',
            ])."\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="professionals.csv"',
        ]);
    }
}
