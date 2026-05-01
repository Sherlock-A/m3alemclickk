<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Nouveau professionnel — Jobly</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;color:#1e293b}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .header{background:linear-gradient(135deg,#1e3a8a,#1e40af);padding:32px 40px;text-align:center}
  .header h1{color:#fff;font-size:20px;font-weight:800}
  .header p{color:rgba(255,255,255,.75);font-size:13px;margin-top:4px}
  .body{padding:36px 40px}
  .badge{display:inline-block;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:20px;padding:4px 12px;font-size:12px;font-weight:600;margin-bottom:20px}
  .info-grid{background:#f8fafc;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e2e8f0}
  .info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px}
  .info-row:last-child{border-bottom:none}
  .info-label{color:#64748b;font-weight:500}
  .info-val{color:#1e293b;font-weight:600;text-align:right}
  .cta{display:block;background:#f97316;color:#fff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:10px;font-weight:700;font-size:15px;margin:24px 0}
  .footer{background:#f8fafc;padding:20px 40px;text-align:center}
  .footer p{font-size:12px;color:#94a3b8}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>🔔 Nouveau professionnel inscrit</h1>
    <p>Action requise — validation du profil</p>
  </div>
  <div class="body">
    <span class="badge">⏳ EN ATTENTE DE VALIDATION</span>
    <p style="font-size:14px;color:#64748b;line-height:1.7;margin-bottom:16px">
      Un nouveau professionnel vient de s'inscrire sur Jobly et attend votre validation.
    </p>

    <div class="info-grid">
      <div class="info-row">
        <span class="info-label">Nom</span>
        <span class="info-val">{{ $pro['name'] }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email</span>
        <span class="info-val">{{ $pro['email'] }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Téléphone</span>
        <span class="info-val">{{ $pro['phone'] }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Métier</span>
        <span class="info-val">{{ $pro['profession'] }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Ville</span>
        <span class="info-val">{{ $pro['city'] }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Inscrit le</span>
        <span class="info-val">{{ $pro['registered_at'] }}</span>
      </div>
    </div>

    <a class="cta" href="{{ $adminUrl }}">
      Valider / Refuser ce professionnel →
    </a>

    <p style="font-size:12px;color:#94a3b8;text-align:center">
      Ou rendez-vous dans votre tableau de bord admin → Gestion des professionnels
    </p>
  </div>
  <div class="footer">
    <p>Jobly Admin — Notification automatique</p>
    <p style="margin-top:4px">Ne répondez pas à cet email.</p>
  </div>
</div>
</body>
</html>
