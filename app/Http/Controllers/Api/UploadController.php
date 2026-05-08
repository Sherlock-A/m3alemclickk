<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class UploadController extends Controller
{
    public function photo(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $file     = $request->file('photo');
        $filename = Str::uuid() . '.webp';
        $destPath = 'photos/' . $filename;

        // Resize to max 1200×1200 (preserving ratio) and convert to WebP
        $manager = new ImageManager(new Driver());
        $image   = $manager->read($file->getRealPath());
        $image->scaleDown(width: 1200, height: 1200);
        $encoded = $image->toWebp(quality: 82);

        Storage::disk('public')->put($destPath, (string) $encoded);

        return response()->json([
            'url' => Storage::disk('public')->url($destPath),
        ]);
    }
}
