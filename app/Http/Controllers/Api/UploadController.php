<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function photo(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $file     = $request->file('photo');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $dir      = '/tmp/uploads';

        if (! is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        $file->move($dir, $filename);

        return response()->json([
            'url' => url('/api/files/' . $filename),
        ]);
    }
}
