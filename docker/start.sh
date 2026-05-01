#!/bin/sh
set -e

cd /app

# ── Storage dirs ────────────────────────────────────────────────────────────
mkdir -p /tmp/laravel-views /tmp/uploads \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/logs

export VIEW_COMPILED_PATH=/tmp/laravel-views
export CACHE_STORE=${CACHE_STORE:-file}
export CACHE_PREFIX=${CACHE_PREFIX:-jobly}

# ── Database detection ──────────────────────────────────────────────────────
# Priority: MYSQLHOST (Railway MySQL plugin) > DATABASE_URL > SQLite fallback
if [ -n "$MYSQLHOST" ]; then
    echo "[start] Database: MySQL (Railway plugin)"
    export DB_CONNECTION=mysql
    export DB_HOST=$MYSQLHOST
    export DB_PORT=${MYSQLPORT:-3306}
    export DB_DATABASE=${MYSQLDATABASE:-railway}
    export DB_USERNAME=${MYSQLUSER:-root}
    export DB_PASSWORD=${MYSQLPASSWORD:-}

elif [ -n "$DATABASE_URL" ]; then
    echo "[start] Database: from DATABASE_URL"
    # Laravel reads DATABASE_URL automatically for some drivers
    # but we parse it to set individual vars for compatibility
    PROTO=$(echo "$DATABASE_URL" | cut -d: -f1)
    case "$PROTO" in
        mysql)    export DB_CONNECTION=mysql ;;
        postgres|postgresql) export DB_CONNECTION=pgsql ;;
    esac

elif [ -n "$PGHOST" ]; then
    echo "[start] Database: PostgreSQL"
    export DB_CONNECTION=pgsql
    export DB_HOST=$PGHOST
    export DB_PORT=${PGPORT:-5432}
    export DB_DATABASE=${PGDATABASE:-railway}
    export DB_USERNAME=${PGUSER:-postgres}
    export DB_PASSWORD=${PGPASSWORD:-}

else
    echo "[start] Database: SQLite (demo mode)"
    touch /tmp/db.sqlite
    export DB_CONNECTION=sqlite
    export DB_DATABASE=/tmp/db.sqlite
fi

# ── Wait for DB (MySQL/PG only) ──────────────────────────────────────────────
if [ "$DB_CONNECTION" != "sqlite" ]; then
    echo "[start] Waiting for database..."
    for i in $(seq 1 30); do
        php artisan migrate:status --no-ansi 2>/dev/null && break
        echo "  retry $i/30..."
        sleep 2
    done
fi

# ── Artisan setup ───────────────────────────────────────────────────────────
php artisan optimize:clear
php artisan storage:link --force 2>/dev/null || true
php artisan migrate --force

# ── Conditional seeding ─────────────────────────────────────────────────────
CATS=$(php artisan tinker --execute="echo \App\Models\Category::count();" 2>/dev/null | tr -d '[:space:]')
if [ "${CATS}" = "0" ] || [ -z "${CATS}" ]; then
    echo "[start] Seeding database..."
    php artisan db:seed --force
fi

# ── Application cache ───────────────────────────────────────────────────────
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ── Start FrankenPHP ────────────────────────────────────────────────────────
APP_PORT=${PORT:-8000}
export SERVER_NAME=":${APP_PORT}"
echo "[start] FrankenPHP on :${APP_PORT}"
exec frankenphp run --config /etc/caddy/Caddyfile
