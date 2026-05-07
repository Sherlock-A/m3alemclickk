#!/bin/bash
# ============================================================
# Script de déploiement — Jobly sur O2Switch
# Usage depuis SSH : bash ~/jobly/deploy-o2switch.sh
# ============================================================
set -e

PROJECT_DIR="$HOME/jobly"

# O2Switch : PHP 8.2 est à cet emplacement (ou via cPanel PHP Selector)
PHP=$(command -v php8.2 2>/dev/null || command -v php82 2>/dev/null || command -v php 2>/dev/null)
COMPOSER="$HOME/bin/composer"   # installé manuellement (voir STEP 0)

echo "==> PHP    : $($PHP -r 'echo PHP_VERSION;')"
echo "==> Projet : $PROJECT_DIR"

cd "$PROJECT_DIR"

# ── 1. Git pull ───────────────────────────────────────────────────────────────
echo ""
echo "[1/9] Pull du dépôt Git..."
git pull origin main

# ── 2. Composer ───────────────────────────────────────────────────────────────
echo ""
echo "[2/9] Composer install..."
$PHP $COMPOSER install --no-dev --optimize-autoloader --no-interaction

# ── 3. Build assets (Node.js via NVM) ────────────────────────────────────────
echo ""
echo "[3/9] Build assets Vite..."
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

if command -v node &>/dev/null; then
    echo "  Node $(node -v) détecté"
    npm ci --silent
    npm run build
else
    echo "  ⚠️  Node.js absent — uploadez public/build/ via FTP depuis votre PC :"
    echo "       scp -r public/build/ $USER@$(hostname):$PROJECT_DIR/public/"
fi

# ── 4. Caches Laravel ─────────────────────────────────────────────────────────
echo ""
echo "[4/9] Caches Laravel..."
$PHP artisan config:cache
$PHP artisan route:cache
$PHP artisan view:cache
$PHP artisan event:cache

# ── 5. Migrations ─────────────────────────────────────────────────────────────
echo ""
echo "[5/9] Migrations..."
$PHP artisan migrate --force

# ── 6. Queue (table) ──────────────────────────────────────────────────────────
echo ""
echo "[6/9] Queue table..."
$PHP artisan queue:table 2>/dev/null || true
$PHP artisan migrate --force 2>/dev/null || true

# ── 7. Geocoding ──────────────────────────────────────────────────────────────
echo ""
echo "[7/9] Geocoding pros..."
$PHP artisan pros:geocode-cities

# ── 8. Storage symlink ────────────────────────────────────────────────────────
echo ""
echo "[8/9] Storage link..."
$PHP artisan storage:link 2>/dev/null || echo "  (déjà lié)"

# ── 9. Permissions ────────────────────────────────────────────────────────────
echo ""
echo "[9/9] Permissions..."
find storage bootstrap/cache -type d -exec chmod 755 {} \;
find storage bootstrap/cache -type f -exec chmod 644 {} \;

echo ""
echo "✅ Déploiement terminé !"
echo "   → URL test : voir cPanel → Domaines → URL provisoire"
