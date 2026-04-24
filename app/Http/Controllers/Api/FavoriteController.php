<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $ids = array_filter((array) $request->input('ids', []));
        return response()->json([
            'items' => Professional::whereIn('id', $ids)->get(),
        ]);
    }

    public function sync(Request $request)
    {
        $data = $request->validate([
            'device_id' => ['required', 'string', 'max:100'],
            'favorites' => ['present', 'array'],
            'favorites.*' => ['integer'],
        ]);

        // Filter to only IDs that actually exist in the DB
        $validIds = empty($data['favorites'])
            ? []
            : Professional::whereIn('id', $data['favorites'])->pluck('id')->toArray();

        Cache::put('favorites:'.$data['device_id'], $validIds, now()->addDays(30));

        return response()->json([
            'success'   => true,
            'favorites' => $validIds,
        ]);
    }
}
