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
  .badge { display:inline-flex; align-items:center; gap:8px; background:{{ $type === 'whatsapp_click' ? '#dcfce7' : '#dbeafe' }}; color:{{ $type === 'whatsapp_click' ? '#16a34a' : '#1d4ed8' }}; border-radius:999px; padding:6px 16px; font-size:13px; font-weight:700; margin-bottom:20px; }
  .info-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:16px 20px; margin-bottom:20px; }
  .info-box p { margin:0; font-size:14px; color:#9a3412; }
  .cta { display:inline-block; margin-top:8px; background:#f97316; color:#fff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:700; font-size:14px; }
  .cta-secondary { display:inline-block; margin:8px 0 0 12px; color:#f97316; text-decoration:none; font-size:13px; font-weight:600; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
  .stat { display:inline-block; background:#f1f5f9; border-radius:8px; padding:8px 16px; font-size:13px; color:#475569; margin:4px 4px 4px 0; }
  .stat strong { color:#0f172a; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>{{ $type === 'whatsapp_click' ? '💬 Nouveau contact WhatsApp' : '📞 Nouveau appel reçu' }}</h1>
    <p>Bonjour {{ $proName }}, un client vous a contacté sur Jobly !</p>
  </div>
  <div class="body">
    <div class="badge">
      {{ $type === 'whatsapp_click' ? '💬 Via WhatsApp' : '📞 Via Appel' }}
      &nbsp;·&nbsp; {{ $city }}
    </div>

    <p style="font-size:15px; color:#1e293b; margin-bottom:20px;">
      Un client depuis <strong>{{ $city }}</strong> a cliqué pour vous contacter
      {{ $type === 'whatsapp_click' ? 'sur WhatsApp' : 'par téléphone' }}.
      Répondez rapidement pour maximiser vos chances de décrocher la mission !
    </p>

    <div class="info-box">
      <p>⚡ <strong>Conseil Jobly :</strong> Les artisans qui répondent en moins de 5 minutes ont un taux de conversion 3× supérieur.</p>
    </div>

    <div style="margin-bottom:24px;">
      <span class="stat">👁️ Vues totales : <strong>{{ $totalViews }}</strong></span>
      <span class="stat">💬 Contacts WA : <strong>{{ $totalWhatsapp }}</strong></span>
      <span class="stat">📞 Appels : <strong>{{ $totalCalls }}</strong></span>
    </div>

    <a href="{{ $dashboardUrl }}" class="cta">Voir mon dashboard</a>
    <a href="{{ $profileUrl }}" class="cta-secondary">Mon profil public →</a>
  </div>
  <div class="footer">
    Vous recevez cet email car vous êtes inscrit sur <strong>Jobly.ma</strong>.
    Pour ne plus recevoir ces notifications, désactivez-les dans votre dashboard.
    <br>© 2026 Jobly — La plateforme des artisans au Maroc.
  </div>
</div>
</body>
</html>
