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
  .row { display:flex; gap:8px; margin-bottom:10px; font-size:14px; }
  .row .label { color:#64748b; min-width:120px; }
  .row .value { color:#0f172a; font-weight:600; }
  .info-box { background:#fff7ed; border:1px solid #fed7aa; border-radius:10px; padding:16px 20px; margin:20px 0; }
  .info-box p { margin:0; font-size:14px; color:#9a3412; }
  .cta { display:inline-block; margin-top:8px; background:#f97316; color:#fff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:700; font-size:14px; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📅 Nouvelle demande de rendez-vous</h1>
    <p>Bonjour {{ $proName }}, un client souhaite prendre rendez-vous avec vous !</p>
  </div>
  <div class="body">
    <p style="font-size:15px; color:#1e293b; margin-bottom:20px;">
      Voici les détails de la demande :
    </p>

    <div class="row"><span class="label">👤 Client :</span><span class="value">{{ $clientName }}</span></div>
    <div class="row"><span class="label">📞 Téléphone :</span><span class="value">{{ $clientPhone }}</span></div>
    @if($service)
    <div class="row"><span class="label">🔧 Service :</span><span class="value">{{ $service }}</span></div>
    @endif
    @if($preferredDate)
    <div class="row"><span class="label">📅 Date souhaitée :</span><span class="value">{{ $preferredDate }}</span></div>
    @endif

    <div class="info-box">
      <p>⚡ <strong>Conseil :</strong> Confirmez rapidement la demande depuis votre tableau de bord pour rassurer le client et maximiser vos chances de conversion.</p>
    </div>

    <a href="{{ $dashboardUrl }}" class="cta">Gérer mes rendez-vous</a>
  </div>
  <div class="footer">
    Vous recevez cet email car vous êtes inscrit sur <strong>Jobly.ma</strong>.<br>
    © 2026 Jobly — La plateforme des artisans au Maroc.
  </div>
</div>
</body>
</html>
