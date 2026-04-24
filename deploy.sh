#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# M3allemClick — deployment script
# Run on the server (Railway, VPS, or shared host) after git pull.
# Usage: bash deploy.sh [--skip-build] [--skip-migrate]
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SKIP_BUILD=false
SKIP_MIGRATE=false

for arg in "$@"; do
  case $arg in
    --skip-build)   SKIP_BUILD=true   ;;
    --skip-migrate) SKIP_MIGRATE=true ;;
  esac
done

echo "╔══════════════════════════════════════════╗"
echo "║   M3allemClick — Deploy $(date '+%Y-%m-%d %H:%M')   ║"
echo "╚══════════════════════════════════════════╝"

# ─── 1. Pull latest code ──────────────────────────────────────────────────────
echo "▶ [1/9] Pulling latest code…"
git pull --ff-only origin main

# ─── 2. PHP dependencies ──────────────────────────────────────────────────────
echo "▶ [2/9] Installing PHP dependencies…"
composer install \
  --no-dev \
  --optimize-autoloader \
  --no-interaction \
  --prefer-dist

# ─── 3. Node / frontend build ─────────────────────────────────────────────────
if [ "$SKIP_BUILD" = false ]; then
  echo "▶ [3/9] Installing Node dependencies and building assets…"
  npm ci --omit=dev
  npm run build
else
  echo "▶ [3/9] Skipping frontend build (--skip-build)"
fi

# ─── 4. Clear all caches before migration ─────────────────────────────────────
echo "▶ [4/9] Clearing application caches…"
php artisan optimize:clear

# ─── 5. Database migrations ───────────────────────────────────────────────────
if [ "$SKIP_MIGRATE" = false ]; then
  echo "▶ [5/9] Running database migrations…"
  php artisan migrate --force
else
  echo "▶ [5/9] Skipping migrations (--skip-migrate)"
fi

# ─── 6. Rebuild optimized caches ──────────────────────────────────────────────
echo "▶ [6/9] Rebuilding optimized caches…"
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# ─── 7. Storage symlink ───────────────────────────────────────────────────────
echo "▶ [7/9] Linking storage…"
php artisan storage:link --force 2>/dev/null || true

# ─── 8. Permissions ───────────────────────────────────────────────────────────
echo "▶ [8/9] Setting permissions…"
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# ─── 9. Queue restart (graceful worker reload) ────────────────────────────────
echo "▶ [9/9] Restarting queue workers…"
php artisan queue:restart

echo ""
echo "✅ Deploy complete — $(date '+%H:%M:%S')"
