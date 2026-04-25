<?php

return [

    'paths' => [
        resource_path('views'),
    ],

    /*
     * Remove realpath() so the path is always a non-empty string even when
     * the directory does not yet exist (e.g. during a Railway/Nixpacks build).
     * The directory is created at runtime by `php artisan storage:link`.
     */
    'compiled' => env('VIEW_COMPILED_PATH', storage_path('framework/views')),

];
