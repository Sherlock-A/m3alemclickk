<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Professional;
use App\Models\Review;
use App\Models\Tracking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // ── Professionnels ────────────────────────────────────────────────────────

    public function professionals(Request $request)
    {
        $query = User::with('professional')
            ->where('role', 'professional');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%'.strtolower($search).'%'])
                  ->orWhereRaw('LOWER(email) LIKE ?', ['%'.strtolower($search).'%']);
            });
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return response()->json(
            $query->latest()->paginate(20)
        );
    }

    public function updateProfessionalStatus(Request $request, User $user)
    {
        $data = $request->validate([
            'status'           => ['required', 'in:active,pending,refused,suspended'],
            'rejection_reason' => ['nullable', 'string', 'max:500'],
        ]);

        $user->update($data);
        Cache::flush();

        return response()->json(['success' => true, 'user' => $user->fresh()]);
    }

    public function deleteProfessional(User $user)
    {
        abort_if($user->role !== 'professional', 403, 'Action non autorisée.');
        $user->delete();
        return response()->json(['success' => true]);
    }

    // ── Avis ──────────────────────────────────────────────────────────────────

    public function reviews(Request $request)
    {
        $query = Review::with('professional')->latest();

        if ($request->filled('approved')) {
            $query->where('approved', filter_var($request->input('approved'), FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json($query->paginate(20));
    }

    public function approveReview(Review $review)
    {
        $review->update(['approved' => true]);

        // Recalculate professional average rating
        $avg = Review::where('professional_id', $review->professional_id)
            ->where('approved', true)
            ->avg('rating');

        Professional::where('id', $review->professional_id)
            ->update(['rating' => round($avg, 2)]);

        return response()->json(['success' => true]);
    }

    public function deleteReview(Review $review)
    {
        $proId = $review->professional_id;
        $review->delete();

        // Recalculate rating after deletion
        $avg = Review::where('professional_id', $proId)
            ->where('approved', true)
            ->avg('rating');

        Professional::where('id', $proId)
            ->update(['rating' => $avg ? round($avg, 2) : 0]);

        return response()->json(['success' => true]);
    }

    // ── Analytics ─────────────────────────────────────────────────────────────

    public function analytics(Request $request)
    {
        $range = $request->input('range', '7'); // '1','7','30','90'
        $days  = (int) $range;
        $from  = now()->subDays($days)->startOfDay();

        // Activité journalière (vues + WhatsApp + appels)
        $daily = Tracking::selectRaw("date(created_at) as date, type, count(*) as total")
            ->where('created_at', '>=', $from)
            ->groupBy('date', 'type')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(fn ($rows) => [
                'date'      => $rows->first()->date,
                'views'     => $rows->where('type', 'view')->sum('total'),
                'whatsapp'  => $rows->where('type', 'whatsapp_click')->sum('total'),
                'calls'     => $rows->where('type', 'call')->sum('total'),
            ])
            ->values();

        // Top professionnels
        $topPros = Professional::orderByDesc('views')
            ->take(10)
            ->get(['id', 'name', 'profession', 'main_city', 'views', 'whatsapp_clicks', 'calls', 'rating']);

        // Top catégories
        $topCategories = Professional::with('category')
            ->select('category_id', DB::raw('count(*) as total'))
            ->groupBy('category_id')
            ->orderByDesc('total')
            ->take(6)
            ->get()
            ->map(fn ($p) => [
                'name'  => $p->category?->name ?? 'Non classé',
                'total' => $p->total,
            ]);

        // Top villes
        $topCities = Professional::selectRaw('main_city, count(*) as total')
            ->groupBy('main_city')
            ->orderByDesc('total')
            ->take(8)
            ->get();

        // Totaux période — single aggregated query
        $totalsRaw = Tracking::where('created_at', '>=', $from)
            ->selectRaw("type, count(*) as total")
            ->groupBy('type')
            ->pluck('total', 'type');

        $totals = [
            'views'    => $totalsRaw['view']          ?? 0,
            'whatsapp' => $totalsRaw['whatsapp_click'] ?? 0,
            'calls'    => $totalsRaw['call']           ?? 0,
        ];

        return response()->json(compact('daily', 'topPros', 'topCategories', 'topCities', 'totals'));
    }

    // ── Export CSV ────────────────────────────────────────────────────────────

    public function exportProfessionalsCsv()
    {
        $rows = User::with('professional')
            ->where('role', 'professional')
            ->get();

        $headers = ['Nom', 'Email', 'Statut', 'Métier', 'Ville', 'Téléphone', 'Inscrit le'];
        $csv = implode(';', $headers)."\n";

        foreach ($rows as $user) {
            $pro = $user->professional;
            $csv .= implode(';', [
                '"'.$user->name.'"',
                '"'.$user->email.'"',
                '"'.$user->status.'"',
                '"'.($pro?->profession ?? '').'"',
                '"'.($pro?->main_city ?? '').'"',
                '"'.($pro?->phone ?? '').'"',
                '"'.$user->created_at->format('d/m/Y').'"',
            ])."\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="professionnels_'.now()->format('Y-m-d').'.csv"',
        ]);
    }

    public function exportTrackingsCsv()
    {
        $rows = Tracking::with('professional')
            ->latest()
            ->take(5000)
            ->get();

        $headers = ['Date', 'Professionnel', 'Type', 'IP', 'Ville'];
        $csv = implode(';', $headers)."\n";

        foreach ($rows as $t) {
            $csv .= implode(';', [
                '"'.$t->created_at->format('d/m/Y H:i').'"',
                '"'.($t->professional?->name ?? '').'"',
                '"'.$t->type.'"',
                '"'.($t->ip ?? '').'"',
                '"'.($t->city ?? '').'"',
            ])."\n";
        }

        return response($csv, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="analytics_'.now()->format('Y-m-d').'.csv"',
        ]);
    }

    // ── Notifications (activité récente) ─────────────────────────────────────

    public function notifications()
    {
        $pendingPros = User::where('role', 'professional')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'created_at']);

        $pendingReviews = Review::with('professional')
            ->where('approved', false)
            ->latest()
            ->take(5)
            ->get();

        $recentTrackings = Tracking::with('professional')
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'pending_pros'     => $pendingPros,
            'pending_reviews'  => $pendingReviews,
            'recent_trackings' => $recentTrackings,
            'counts' => [
                'pending_pros'    => User::where('role', 'professional')->where('status', 'pending')->count(),
                'pending_reviews' => Review::where('approved', false)->count(),
            ],
        ]);
    }
}
