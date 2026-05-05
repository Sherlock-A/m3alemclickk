#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════════════
#  Jobly — Script de préparation production
#  Usage : bash reset-production.sh
# ══════════════════════════════════════════════════════════════════════════════
set -e

BASE="$(cd "$(dirname "$0")" && pwd)"
cd "$BASE"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║        JOBLY — Lancement Production                  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── Vérifier que php et artisan existent ──────────────────────────────────────
command -v php >/dev/null 2>&1 || { echo "ERREUR: php non trouvé"; exit 1; }
[ -f "artisan" ] || { echo "ERREUR: artisan non trouvé (lancer depuis la racine du projet)"; exit 1; }

# ── Étape 1 : Afficher l'état actuel ─────────────────────────────────────────
echo "ÉTAPE 1 — Vérification de l'état actuel"
php artisan jobly:prepare-production --verify
echo ""

# ── Étape 2 : Nettoyage des données de test ──────────────────────────────────
echo "ÉTAPE 2 — Nettoyage des données de test"
php artisan jobly:prepare-production
echo ""

# ── Étape 3 : Recréer le compte admin production ──────────────────────────────
echo "ÉTAPE 3 — Création du compte admin production"
php artisan db:seed --class=AdminSeeder
echo ""

# ── Étape 4 : Vérification finale ─────────────────────────────────────────────
echo "ÉTAPE 4 — Vérification finale"
php artisan jobly:prepare-production --verify
echo ""

# ── Étape 5 : Build assets production ─────────────────────────────────────────
if command -v npm >/dev/null 2>&1; then
    echo "ÉTAPE 5 — Build des assets (npm run build)"
    npm run build
    echo ""
else
    echo "ÉTAPE 5 — npm non trouvé, build ignoré (lancer manuellement : npm run build)"
    echo ""
fi

# ── Étape 6 : Optimisations Laravel production ────────────────────────────────
echo "ÉTAPE 6 — Optimisations production"
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo ""

# ── Rapport final ─────────────────────────────────────────────────────────────
echo "══════════════════════════════════════════════════════"
echo "  Jobly est prêt pour le lancement !"
echo ""
echo "  Compte admin : $(grep ADMIN_EMAIL .env | cut -d= -f2)"
echo "  URL locale   : http://127.0.0.1:8000"
echo "══════════════════════════════════════════════════════"
echo ""
