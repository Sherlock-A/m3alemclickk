# Jobly — Changelog

## v2.1 — Sécurité + Pusher + Déploiement O2Switch (2026-05-06)

### Sécurité
- `/api/health` restreint à `jwt:admin` (exposait email admin en clair)
- `/api/auth/mock-login` désactivé en production (`APP_DEBUG=false`)
- CORS : méthodes explicites, origines auto depuis `APP_URL`
- `.htaccess` production : HTTPS forcé, cache assets, headers sécu, bloc `.env`/`.git`

### Pusher — notifications temps réel
- `pusher/pusher-php-server` + `laravel-echo` + `pusher-js` installés
- `config/broadcasting.php` créé, `routes/channels.php` créé
- `app/Events/ProNotification.php` : event broadcasté sur `private-pro.{id}`
- Route `/api/broadcasting/auth` protégée JWT pour authentifier les canaux privés
- `ContactRequestController` + `ReviewController` : broadcast au moment de la création
- `resources/js/echo.ts` : helper Echo/Pusher réutilisable
- `ProfessionalDashboardPage` : polling 60s remplacé par Echo temps réel (fallback 5min)

### Géolocalisation GPS (fix)
- Bug `HAVING distance` : alias non résolu dans la COUNT query de `paginate()` → remplacé par formule Haversine complète dans `havingRaw` et `orderByRaw`
- Commande `php artisan pros:geocode-cities` : assigne lat/lon aux pros à partir de leur ville (40+ villes marocaines)
- `DashboardController::updateProfessional()` : auto-geocode quand `main_city` change

### Déploiement O2Switch
- `.env.example` mis à jour pour `jobly.ma` + variables Pusher
- `deploy-o2switch.sh` : script complet (git pull → composer → vite build → caches → migrate → geocode → symlink)
- Crons O2Switch : `php artisan schedule:run` + `php artisan queue:work --stop-when-empty`

---

## v2.0 — Phase 3 (2026-05-05)

### PWA & Service Worker
- `sw.js` v2 : cache-first pour `/build/` et `/icons/`, network-first pour HTML
- `app.tsx` : enregistrement SW avec `updatefound` / `SKIP_WAITING`

### Analytics avancés (dashboard pro — onglet Stats)
- Taux de conversion 30j (vues → contacts) avec comparaison moyenne catégorie
- Graphique "Contacts par jour de la semaine" (barres, recharts)

### Pros similaires (profil public)
- 3 pros (même catégorie ou même ville) triés par note, affichés en bas du profil

---

## v2.0 — Phase 2 (2026-05-05)

### SEO villes/catégories
- Routes `/professionnels/{city}` et `/professionnels/{city}/{category}`
- `ProfessionalPageController::byCity()` avec h1, canonical, meta dédiés
- Sitemap étendu : top 10 villes × toutes catégories

### Comparateur pros
- `ComparePanel.tsx` : panel fixe bas de page, 2–3 pros côte à côte
- Checkbox "Comparer" sur chaque `ProfessionalCard`

### Signalement d'avis
- Migration `reported_at` / `report_reason` sur `reviews`
- `POST /api/reviews/{id}/report` + bouton inline sur profil public

### Calendrier disponibilité
- Table `professional_unavailabilities` (from_date, to_date, reason)
- `UnavailabilityCalendar` dans dashboard pro
- Affichage "Disponible à partir du..." sur profil public

---

## v2.0 — Phase 1 (2026-05-05)

### Emails asynchrones
- `app/Jobs/SendMailJob.php` : ShouldQueue, 3 retries, backoff 60s
- `MailService` : dispatch async (OTP/reset restent sync)

### Images WebP
- `UploadController` : Intervention/Image v3, scaleDown 1200px, WebP qualité 82

### Scheduler
- Nettoyage trackings >6 mois (dimanche 3h)
- Purge failed_jobs (lundi)
- `pros:weekly-report` : rapport email hebdo aux pros actifs

### Recherche géo "Artisans près de moi"
- Formule Haversine SQL dans `ProfessionalController` et `ProfessionalPageController`
- Bouton "Artisans près de moi" dans sidebar + badge filtre actif

### Badge notifications pro
- `GET /api/pro/notifications/count` (jwt:professional)
- Badge rouge sur onglet Devis (polling, remplacé par Pusher en v2.1)

---

## v1.0 — Base (commit initial)

- Auth multi-rôles JWT : admin, professional, client
- Profils pros : multi-catégories, portfolio, disponibilité
- Système devis/contact avec email
- Dashboard pro / client / admin
- Tracking (vues, WhatsApp, appels)
- Sitemap.xml dynamique, PWA manifest
- Google OAuth
