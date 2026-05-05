#!/bin/bash
# ============================================================
# Script de déploiement — Jobly.ma sur O2Switch
# Usage : bash deploy-o2switch.sh
# À exécuter via SSH sur le serveur O2Switch
# ============================================================

set -e  # Stop on any error

PROJECT_DIR="$HOME/jobly"
PHP="$(command -v php8.2 || command -v php8.1 || command -v php)"
COMPOSER="$HOME/.composer/vendor/bin/composer"

echo "==> PHP version: $($PHP -r 'echo PHP_VERSION;')"
echo "==> Répertoire : $PROJECT_DIR"

cd "$PROJECT_DIR"

# ── 1. Récupérer le dernier code ──────────────────────────────────────────────
echo ""
echo "[1/8] Pull du dépôt Git..."
git pull origin main

# ── 2. Dépendances PHP (sans dev) ─────────────────────────────────────────────
echo ""
echo "[2/8] Composer install..."
$PHP $COMPOSER install --no-dev --optimize-autoloader --no-interaction

# ── 3. Build assets (si Node.js disponible) ───────────────────────────────────
echo ""
echo "[3/8] Build assets Vite..."
if command -v node &>/dev/null; then
    npm ci --silent
    npm run build
else
    echo "  ⚠️  Node.js absent — uploader public/build/ en FTP depuis le local"
fi

# ── 4. Cache Laravel (optimisation production) ────────────────────────────────
echo ""
echo "[4/8] Caches Laravel..."
$PHP artisan config:cache
$PHP artisan route:cache
$PHP artisan view:cache
$PHP artisan event:cache

# ── 5. Migrations ─────────────────────────────────────────────────────────────
echo ""
echo "[5/8] Migrations..."
$PHP artisan migrate --force

# ── 6. Geocoder les pros sans coordonnées ─────────────────────────────────────
echo ""
echo "[6/8] Geocoding pros..."
$PHP artisan pros:geocode-cities

# ── 7. Storage symlink ────────────────────────────────────────────────────────
echo ""
echo "[7/8] Storage link..."
$PHP artisan storage:link 2>/dev/null || echo "  (déjà lié)"

# ── 8. Permissions ────────────────────────────────────────────────────────────
echo ""
echo "[8/8] Permissions..."
chmod -R 755 storage bootstrap/cache
chmod -R 644 storage/logs/*.log 2>/dev/null || true

echo ""
echo "✅ Déploiement terminé — https://jobly.ma"
