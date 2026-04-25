#!/bin/sh
export DB_CONNECTION=sqlite
export DB_DATABASE=/tmp/db.sqlite
export VIEW_COMPILED_PATH=/tmp/laravel-views

mkdir -p /tmp/laravel-views
mkdir -p /tmp/uploads
touch /tmp/db.sqlite

php artisan config:clear
php artisan migrate:fresh --force
php artisan db:seed --force

exec /start-container.sh
