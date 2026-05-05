<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use App\Models\Professional;
use App\Models\Review;
use App\Models\Tracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
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

        $days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        $weekly = Tracking::query()
            ->selectRaw("DATE(created_at) as date, count(*) as total")
            ->where('professional_id', $professional->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy(DB::raw("DATE(created_at)"))
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->map(function ($row) use ($days) {
                $row->day = $days[(int) date('w', strtotime($row->date))] ?? $row->date;
                return $row;
            });

        $reviews = Review::where('professional_id', $professional->id)
            ->orderByDesc('created_at')
            ->get(['id', 'client_name', 'rating', 'comment', 'approved', 'pro_response', 'pro_responded_at', 'created_at']);

        $professional->load(['categories', 'unavailabilities' => fn ($q) => $q->where('to_date', '>=', now()->toDateString())->orderBy('from_date')]);

        // ── Advanced analytics ─────────────────────────────────────────────────
        // Contacts (whatsapp + calls) over last 30 days
        $dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        $contactsByDay = Tracking::where('professional_id', $professional->id)
            ->whereIn('type', ['whatsapp', 'call'])
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('DAYOFWEEK(created_at) as dow, COUNT(*) as contacts')
            ->groupBy(DB::raw('DAYOFWEEK(created_at)'))
            ->get()
            ->mapWithKeys(fn ($r) => [$dayNames[$r->dow - 1] => $r->contacts]);

        $allDays = array_map(fn ($d) => ['day' => $d, 'contacts' => $contactsByDay[$d] ?? 0], $dayNames);

        // 30-day conversion: views → contacts
        $views30    = Tracking::where('professional_id', $professional->id)->where('type', 'view')->where('created_at', '>=', now()->subDays(30))->count();
        $contacts30 = Tracking::where('professional_id', $professional->id)->whereIn('type', ['whatsapp', 'call'])->where('created_at', '>=', now()->subDays(30))->count();
        $convRate   = $views30 > 0 ? round(($contacts30 / $views30) * 100, 1) : 0;

        // Category average conversion (for comparison)
        $catAvgConv = null;
        if ($professional->category_id) {
            $catProIds = Professional::where('category_id', $professional->category_id)->where('id', '!=', $professional->id)->pluck('id');
            if ($catProIds->count() > 0) {
                $catViews    = Tracking::whereIn('professional_id', $catProIds)->where('type', 'view')->where('created_at', '>=', now()->subDays(30))->count();
                $catContacts = Tracking::whereIn('professional_id', $catProIds)->whereIn('type', ['whatsapp', 'call'])->where('created_at', '>=', now()->subDays(30))->count();
                $catAvgConv  = $catViews > 0 ? round(($catContacts / $catViews) * 100, 1) : 0;
            }
        }

        return response()->json([
            'professional' => $professional,
            'stats' => [
                'views'          => $professional->views,
                'whatsappClicks' => $professional->whatsapp_clicks,
                'calls'          => $professional->calls,
            ],
            'weekly'       => $weekly,
            'reviews'      => $reviews,
            'analytics'    => [
                'contactsByDay' => $allDays,
                'convRate'      => $convRate,
                'catAvgConv'    => $catAvgConv,
                'views30'       => $views30,
                'contacts30'    => $contacts30,
            ],
        ]);
    }

    public function notificationsCount(Request $request)
    {
        $proId = $request->user()->professional_id;

        if (! $proId) {
            return response()->json(['count' => 0]);
        }

        $newQuotes  = ContactRequest::where('professional_id', $proId)->where('status', 'new')->count();
        $newReviews = Review::where('professional_id', $proId)->where('approved', false)->count();

        return response()->json(['count' => $newQuotes + $newReviews]);
    }

    public function updateProfessional(Request $request)
    {
        $user = $request->user();
        $professional = $user->professional;

        if (! $professional) {
            return response()->json(['message' => 'Profil professionnel introuvable.'], 404);
        }

        $data = $request->validate([
            'name'             => ['required', 'string', 'max:100'],
            'profession'       => ['required', 'string', 'max:100'],
            'main_city'        => ['required', 'string', 'max:100'],
            'phone'            => ['nullable', 'string', 'max:20'],
            'travel_cities'    => ['array'],
            'travel_cities.*'  => ['string'],
            'languages'        => ['array'],
            'languages.*'      => ['string'],
            'description'      => ['nullable', 'string', 'max:1000'],
            'photo'            => ['nullable', 'string'],
            'portfolio'        => ['nullable', 'array'],
            'portfolio.*'      => ['string'],
            'is_available'     => ['boolean'],
            'category_ids'     => ['nullable', 'array', 'max:3'],
            'category_ids.*'   => ['integer', 'exists:categories,id'],
        ]);

        $categoryIds = $data['category_ids'] ?? null;
        unset($data['category_ids']);

        // Auto-geocode when city changes
        if (isset($data['main_city'])) {
            $coords = \App\Console\Commands\GeocodeProfessionals::coordsForCity($data['main_city']);
            if ($coords) {
                $data['latitude']  = $coords[0];
                $data['longitude'] = $coords[1];
            }
        }

        $professional->update($data);

        if ($categoryIds !== null) {
            $professional->categories()->sync($categoryIds);
            if (! empty($categoryIds)) {
                $professional->update(['category_id' => $categoryIds[0]]);
            }
        }

        Cache::flush();

        $professional->load('categories');

        return response()->json([
            'success'      => true,
            'professional' => $professional->fresh(['categories']),
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
