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
