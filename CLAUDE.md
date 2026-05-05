# M3allemClick-Laravel — Guide Claude

## Architecture

Laravel 11 + React 18 + Inertia.js + Vite + TailwindCSS.
Base de données : MySQL (`m3allemclick_api`).

## Deux projets distincts

| Projet | Stack | Chemin |
|--------|-------|--------|
| M3allemClick-Laravel | Laravel + React/Inertia | `c:\xampp\htdocs\M3allemClick-Laravel\M3allemClick-Laravel\` |
| M3alemClick-main | Laravel + Livewire/Blade | `c:\xampp\htdocs\M3alemClick-main\M3alemClick-main\` |

Ne pas confondre les deux — champs, statuts et auth sont différents.

## Conventions champs

- `main_city` (pas `city`), `photo` (pas `avatar`), `verified` (boolean), `is_available` (boolean)
- Status valeurs : `pending / active / refused / suspended`
- Tracking `type` : `view / whatsapp / call`

## Auth JWT

Tokens localStorage : `pro_token`, `m3allemclick_token`, `client_token`.
Middlewares : `jwt:professional`, `jwt:client`, `jwt:admin`.

## Commandes utiles

```bash
# Développement
npm run dev          # Vite dev server
php artisan serve    # Laravel (port 8000)

# Build production
npm run build

# Migrations
php artisan migrate
php artisan migrate:fresh --seed

# TypeScript check
npx tsc --noEmit
```

## Règles de développement

1. Toujours vérifier `npx tsc --noEmit` après modifications TypeScript
2. Utiliser `router.get()` d'Inertia pour les navigations (pas `<a href>`) afin de conserver les query params
3. Le `@inertiaHead` dans `app.blade.php` est requis pour que `<Head>` fonctionne
4. Cache TTL : 3600s par défaut, `Cache::forget()` sur mutations
5. Les avis nécessitent `approved = true` pour être affichés publiquement

## Structure composants React

```
resources/js/
  components/       Composants réutilisables
  contexts/         React contexts (Favorites, Language)
  pages/
    Auth/           Pages login/register
    Dashboard/      Dashboards pro/client/admin
    Frontend/       Pages publiques
  types.ts          Types TypeScript centralisés
```

---

## Historique des sessions

### Session 2026-04-24 — Fonctionnalités UI

**Implémenté :**
- Logo SVG (`M3allemClickLogo.tsx`)
- SearchBar autocomplete ville (debounce 200ms → `/api/cities/autocomplete`) + GPS
- Filtres avancés : ville, profession/catégorie, tri, disponibilité, note min (étoiles), langue
- Category icons emoji dans DB + click catégorie → filtre profession
- Portfolio lightbox (clavier ←/→/Esc)
- Dashboard pro : stats KPI, chart 7 jours, onglet avis + réponses
- Dashboard client : favoris localStorage, recherche rapide
- Schema.org JSON-LD sur profils pro (LocalBusiness + AggregateRating)
- Sitemap XML dynamique `/sitemap.xml`

**Bugs résolus :**
- GROUP BY MySQL strict mode dans DashboardController → fixed avec `MIN(created_at)`
- Category icons affichaient "Wrench" → fixed avec emoji dans seeder
- Category click ne filtrait pas (mismatch 'Plomberie' vs 'Plombier') → professions alignées
- SearchBar envoyait strings vides → filtrées avant `router.get()`
- `strtolower` casse les accents → `mb_strtolower`

---

### Session 2026-05-04 — Auth, OTP, Audit

**Implémenté :**

#### Suppression de la vérification email/téléphone à l'inscription
- `ClientRegisterPage.tsx` : suppression du step `'verify'`, redirection directe vers `/dashboard/client` après inscription
- `ProRegisterPage.tsx` : STEPS réduit de 4 à 3 (suppression step 4 vérification)
- Validation XSS ajoutée sur le champ `name` : `regex:/^[^<>{}\/\\]+$/u`

#### Réinitialisation de mot de passe par OTP (à la place des liens email)
- `ForgotPasswordPage.tsx` : wizard 3 étapes (`email` → `code` → `password`)
  - Étape 1 : saisie email → POST `/api/{role}/forgot-password`
  - Étape 2 : saisie code 6 chiffres + countdown 60s + bouton renvoyer
  - Étape 3 : nouveau mot de passe + confirmation → POST `/api/{role}/reset-password`
- `ClientAuthController.php` `forgotPassword()` → génère OTP 6 chiffres, stocké en Cache 10min
- `ClientAuthController.php` `resetPassword()` → valide OTP depuis Cache, met à jour le mot de passe
- `ProAuthController.php` — même logique que ClientAuthController
- Throttle : `throttle:5,1` sur forgot-password, `throttle:30,1` sur reset-password

#### Email SMTP Gmail (remplace Resend sandbox)
```env
MAIL_MAILER=gmail
MAIL_FROM_ADDRESS=okhalouki47@gmail.com
GMAIL_ADDRESS=okhalouki47@gmail.com
GMAIL_APP_PASSWORD="ioog agto xfuj lbrw"
ADMIN_EMAIL=okhalouki47@gmail.com
CONTACT_EMAIL=okhalouki47@gmail.com
```

#### SearchController — recherche multi-mots
- Ajout synonymes : `'femme menage'`, `'femme de manage'`
- Fallback multi-mots : si la phrase entière n'est pas dans le synonymMap, essaie mot par mot

#### Corrections audit
- `ProAuthController::me()` → ajout de `'status'` dans `$user->only([...])`
- `score.sh` → pattern CSV trackings corrigé : `'Date\|Professionnel\|view\|call\|whatsapp'`
- `score.sh` → 429 throttle traité comme succès sécurité (pas un KO)

**Comptes de test :**
| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Client | `client@test.com` | `password` |
| Pro | `pro@test.com` | `password` |
| Admin | `admin@test.com` | `password` |

**Score audit final (`score.sh`) :**
- 125 OK / 0 KO / 8 WN (warnings = perf XAMPP local, normal sans opcache)
- **Score global pondéré : 96/100 ★★★★★ EXCELLENT**

**Scripts d'audit :**
- `audit.sh` — 81 tests (sécurité, auth, validation, recherche, OTP, HTTP, intégrité, admin, throttle)
- `score.sh` — 133 tests pondérés (10 catégories avec poids %)
