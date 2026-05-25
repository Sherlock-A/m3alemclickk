<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
  .header { background:linear-gradient(135deg,#dc2626,#b91c1c); padding:28px 32px; }
  .header h1 { color:#fff; margin:0; font-size:24px; }
  .header p  { color:#fca5a5; margin:6px 0 0; font-size:14px; }
  .body { padding:28px 32px; color:#334155; line-height:1.6; }
  .sos-badge { display:inline-flex; align-items:center; gap:8px; background:#fee2e2; color:#dc2626; border-radius:999px; padding:6px 16px; font-size:13px; font-weight:700; margin-bottom:20px; }
  .info-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:16px 20px; margin-bottom:20px; }
  .info-box p { margin:0; font-size:14px; color:#9a3412; }
  .msg-box { background:#fef2f2; border:1px solid #fca5a5; border-radius:10px; padding:16px 20px; margin-bottom:20px; }
  .msg-box p { margin:0; font-size:15px; color:#1e293b; }
  .cta { display:inline-block; margin-top:8px; background:#dc2626; color:#fff; text-decoration:none; padding:14px 32px; border-radius:8px; font-weight:700; font-size:15px; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>🚨 SOS Urgent — {{ $city }}</h1>
    <p>Bonjour {{ $pro->name }}, un client a besoin de vous maintenant !</p>
  </div>
  <div class="body">
    <div class="sos-badge">🚨 Demande urgente · {{ $city }}</div>

    <p style="font-size:15px; color:#1e293b; margin-bottom:20px;">
      <strong>{{ $clientName }}</strong> recherche un <strong>{{ $pro->profession }}</strong>
      disponible <strong>immédiatement</strong> à <strong>{{ $city }}</strong>.
    </p>

    @if($message)
    <div class="msg-box">
      <p>💬 <strong>Message du client :</strong><br>{{ $message }}</p>
    </div>
    @endif

    <div class="info-box">
      <p>⚡ <strong>Conseil Jobly :</strong> Les artisans qui répondent aux SOS en moins de 5 minutes décrochent 80% des missions. Connectez-vous dès maintenant !</p>
    </div>

    <a href="{{ $dashboardUrl }}" class="cta">🚀 Voir le dashboard maintenant</a>
  </div>
  <div class="footer">
    Vous recevez cet email car vous êtes inscrit comme professionnel disponible sur <strong>Jobly.ma</strong>.
    <br>© 2026 Jobly — La plateforme des artisans au Maroc.
  </div>
</div>
</body>
</html>
