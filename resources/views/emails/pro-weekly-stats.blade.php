<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#f97316,#c05000); padding:28px 32px; }
  .header h1 { color:#fff; margin:0; font-size:22px; }
  .header p  { color:#fed7aa; margin:6px 0 0; font-size:14px; }
  .body { padding:28px 32px; color:#334155; line-height:1.6; }
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin:20px 0; }
  .stat-card { background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:16px; text-align:center; }
  .stat-card .num { font-size:28px; font-weight:800; color:#0f172a; line-height:1; }
  .stat-card .label { font-size:11px; color:#94a3b8; margin-top:4px; text-transform:uppercase; letter-spacing:.5px; }
  .highlight { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:14px 18px; font-size:13px; color:#9a3412; margin:16px 0; }
  .cta { display:inline-block; margin-top:16px; background:#f97316; color:#fff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:700; font-size:14px; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📊 Vos stats de la semaine</h1>
    <p>Bonjour {{ $proName }}, voici votre bilan Jobly de cette semaine.</p>
  </div>
  <div class="body">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="num">{{ $views }}</div>
        <div class="label">👁️ Vues du profil</div>
      </div>
      <div class="stat-card">
        <div class="num">{{ $whatsappClicks }}</div>
        <div class="label">💬 Contacts WhatsApp</div>
      </div>
      <div class="stat-card">
        <div class="num">{{ $calls }}</div>
        <div class="label">📞 Appels</div>
      </div>
      <div class="stat-card">
        <div class="num">{{ $rating > 0 ? number_format($rating, 1) : '—' }}</div>
        <div class="label">⭐ Note moyenne ({{ $totalReviews }} avis)</div>
      </div>
    </div>

    @if($whatsappClicks + $calls > 0)
    <div class="highlight">
      🎉 <strong>{{ $whatsappClicks + $calls }} client(s)</strong> vous ont contacté cette semaine. Répondez vite pour maximiser vos missions !
    </div>
    @else
    <div class="highlight">
      💡 <strong>Conseil :</strong> Complétez votre profil (photo, description, photos de travaux) pour recevoir plus de contacts.
    </div>
    @endif

    <p style="font-size:13px; color:#64748b; margin-top:12px;">
      Pour voir vos statistiques détaillées, les avis clients et gérer votre disponibilité, rendez-vous sur votre tableau de bord.
    </p>

    <a href="{{ $dashboardUrl }}" class="cta">Voir mon tableau de bord</a>
  </div>
  <div class="footer">
    Vous recevez cet email chaque lundi car vous êtes inscrit sur <strong>Jobly.ma</strong>.<br>
    © 2026 Jobly — La plateforme des artisans au Maroc.
  </div>
</div>
</body>
</html>
