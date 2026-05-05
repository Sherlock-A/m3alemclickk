<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
  .header { background:#2563eb; padding:28px 32px; }
  .header h1 { color:#fff; margin:0; font-size:22px; }
  .header p  { color:#bfdbfe; margin:6px 0 0; font-size:14px; }
  .body { padding:28px 32px; color:#334155; line-height:1.6; }
  .field { margin-bottom:16px; }
  .label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#94a3b8; margin-bottom:4px; }
  .value { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; font-size:14px; color:#1e293b; }
  .message-value { white-space:pre-wrap; min-height:80px; }
  .cta { display:inline-block; margin-top:20px; background:#f97316; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:700; font-size:14px; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📩 Nouvelle demande de devis</h1>
    <p>Bonjour {{ $proName }}, un client vous a envoyé une demande.</p>
  </div>
  <div class="body">
    <div class="field">
      <div class="label">Client</div>
      <div class="value">{{ $clientName }}</div>
    </div>
    @if($clientEmail)
    <div class="field">
      <div class="label">Email du client</div>
      <div class="value"><a href="mailto:{{ $clientEmail }}" style="color:#2563eb;">{{ $clientEmail }}</a></div>
    </div>
    @endif
    @if($clientPhone)
    <div class="field">
      <div class="label">Téléphone</div>
      <div class="value"><a href="tel:{{ $clientPhone }}" style="color:#2563eb;">{{ $clientPhone }}</a></div>
    </div>
    @endif
    <div class="field">
      <div class="label">Objet</div>
      <div class="value">{{ $subject }}</div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="value message-value">{{ $message }}</div>
    </div>
    <a href="{{ $dashboardUrl }}" class="cta">Voir mes demandes →</a>
  </div>
  <div class="footer">
    Jobly — Demande de devis reçue le {{ now()->setTimezone('Africa/Casablanca')->format('d/m/Y à H:i') }}
  </div>
</div>
</body>
</html>
