#!/bin/sh
export DB_CONNECTION=sqlite
export DB_DATABASE=/tmp/db.sqlite
export VIEW_COMPILED_PATH=/tmp/laravel-views

mkdir -p /tmp/laravel-views
mkdir -p /tmp/uploads
touch /tmp/db.sqlite

php artisan config:clear

# Run migrations without wiping data; seed only on first boot (empty DB)
php artisan migrate --force

# Seed only if the categories table is empty (first boot / fresh DB)
CATS=$(php artisan tinker --execute="echo \App\Models\Category::count();" 2>/dev/null | tr -d '[:space:]')
if [ "$CATS" = "0" ] || [ -z "$CATS" ]; then
    php artisan db:seed --force
fi

exec /start-container.sh
