<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
  .header { background:#1d4ed8; padding:28px 32px; }
  .header h1 { color:#fff; margin:0; font-size:22px; }
  .header p  { color:#bfdbfe; margin:6px 0 0; font-size:14px; }
  .body { padding:28px 32px; color:#334155; line-height:1.6; }
  .stats { display:flex; gap:16px; margin:24px 0; }
  .stat { flex:1; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; text-align:center; }
  .stat-value { font-size:32px; font-weight:700; color:#1d4ed8; }
  .stat-label { font-size:12px; color:#64748b; margin-top:4px; }
  .cta { display:inline-block; margin-top:20px; background:#f97316; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:700; font-size:14px; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
  .rating-row { margin-top:16px; color:#64748b; font-size:14px; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📊 Rapport hebdomadaire</h1>
    <p>Bonjour {{ $proName }}, voici vos statistiques de la semaine.</p>
  </div>
  <div class="body">
    <div class="stats">
      <div class="stat">
        <div class="stat-value">{{ $views }}</div>
        <div class="stat-label">Vues de profil</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ $contacts }}</div>
        <div class="stat-label">Contacts (WhatsApp / Appels)</div>
      </div>
      <div class="stat">
        <div class="stat-value">{{ $newQuotes }}</div>
        <div class="stat-label">Nouvelles demandes de devis</div>
      </div>
    </div>
    @if($rating > 0)
    <div class="rating-row">⭐ Note moyenne : <strong>{{ number_format($rating, 1) }} / 5</strong></div>
    @endif
    <p>Connectez-vous à votre tableau de bord pour répondre aux devis et gérer votre profil.</p>
    <a href="{{ $dashboardUrl }}" class="cta">Accéder à mon tableau de bord →</a>
  </div>
  <div class="footer">
    M3allemClick — Rapport du {{ now()->setTimezone('Africa/Casablanca')->format('d/m/Y') }} &nbsp;·&nbsp;
    Vous recevez ce rapport en tant que professionnel inscrit.
  </div>
</div>
</body>
</html>
