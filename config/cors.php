<?php

return [

    /*
     * Chemins concernés par les règles CORS.
     * 'api/*' couvre tous les endpoints API.
     */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    /*
     * Origines autorisées.
     * En production APP_URL = https://jobly.ma est ajouté automatiquement.
     */
    'allowed_origins' => array_values(array_unique(array_filter([
        env('APP_URL'),
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8000',
        'http://127.0.0.1:8000',
    ]))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'X-Requested-With', 'Authorization', 'Accept', 'X-CSRF-TOKEN'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
     * Nécessaire pour que les cookies httpOnly (JWT) soient transmis
     * dans les requêtes cross-origin depuis le dev Vite.
     */
    'supports_credentials' => true,

];
