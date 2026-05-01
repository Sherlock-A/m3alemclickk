<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
  .header { background:#f97316; padding:28px 32px; }
  .header h1 { color:#fff; margin:0; font-size:22px; }
  .body { padding:28px 32px; color:#334155; line-height:1.6; }
  .field { margin-bottom:16px; }
  .label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; margin-bottom:4px; }
  .value { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; font-size:14px; color:#1e293b; }
  .message-value { white-space:pre-wrap; min-height:80px; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📬 Nouveau message de contact</h1>
  </div>
  <div class="body">
    <div class="field">
      <div class="label">Nom</div>
      <div class="value">{{ $fromName }}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:{{ $fromEmail }}" style="color:#f97316;">{{ $fromEmail }}</a></div>
    </div>
    <div class="field">
      <div class="label">Sujet</div>
      <div class="value">{{ $subject }}</div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="value message-value">{{ $message }}</div>
    </div>
  </div>
  <div class="footer">
    Jobly — Formulaire de contact public · {{ now()->format('d/m/Y à H:i') }}
  </div>
</div>
</body>
</html>
