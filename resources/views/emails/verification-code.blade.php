<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Code de vérification — Jobly</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f1f5f9;color:#1e293b}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
  .header{background:linear-gradient(135deg,#f97316,#ea580c);padding:36px 40px;text-align:center}
  .header h1{color:#fff;font-size:22px;font-weight:800;letter-spacing:-.3px}
  .header p{color:rgba(255,255,255,.85);font-size:13px;margin-top:4px}
  .body{padding:40px}
  .greeting{font-size:16px;color:#334155;margin-bottom:24px}
  .otp-box{background:#fff7ed;border:2px dashed #f97316;border-radius:12px;padding:28px;text-align:center;margin:24px 0}
  .otp-code{font-size:48px;font-weight:900;letter-spacing:10px;color:#ea580c;font-variant-numeric:tabular-nums}
  .otp-label{font-size:12px;color:#94a3b8;margin-top:8px;text-transform:uppercase;letter-spacing:1px}
  .expiry{background:#fef9c3;border-left:4px solid #facc15;padding:12px 16px;border-radius:0 8px 8px 0;font-size:13px;color:#713f12;margin:20px 0}
  .divider{border:none;border-top:1px solid #e2e8f0;margin:28px 0}
  .footer{background:#f8fafc;padding:24px 40px;text-align:center}
  .footer p{font-size:12px;color:#94a3b8;line-height:1.8}
  .footer a{color:#f97316;text-decoration:none}
  .logo{display:inline-flex;align-items:center;gap:6px;font-weight:900;font-size:18px;color:#fff}
  .logo span{color:rgba(255,255,255,.7)}
  .security{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;font-size:12px;color:#166534;margin-top:16px}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="logo">🔍 Jobly</div>
    <h1>Vérification de votre compte</h1>
    <p>Artisans vérifiés au Maroc</p>
  </div>
  <div class="body">
    <p class="greeting">Bonjour <strong>{{ $userName }}</strong>,</p>
    <p style="color:#64748b;font-size:14px;line-height:1.7">
      Vous avez demandé la vérification de votre compte Jobly.
      Voici votre code de vérification à usage unique :
    </p>

    <div class="otp-box">
      <div class="otp-code">{{ $code }}</div>
      <div class="otp-label">Code à 6 chiffres</div>
    </div>

    <div class="expiry">
      ⏱️ <strong>Ce code expire dans 10 minutes</strong> — à partir de {{ $sentAt }}
    </div>

    <p style="font-size:14px;color:#64748b;line-height:1.7">
      Entrez ce code dans l'application pour valider votre compte.
      Ne partagez jamais ce code avec qui que ce soit.
    </p>

    <div class="security">
      🔒 Si vous n'avez pas demandé ce code, ignorez cet email en toute sécurité.
      Votre compte reste protégé.
    </div>

    <hr class="divider">
    <p style="font-size:12px;color:#94a3b8;text-align:center">
      Envoyé à : <strong>{{ $toEmail }}</strong>
    </p>
  </div>
  <div class="footer">
    <p>
      Jobly — Trouvez un artisan vérifié au Maroc<br>
      <a href="https://jobly.ma">jobly.ma</a> ·
      <a href="mailto:support@jobly.ma">support@jobly.ma</a>
    </p>
    <p style="margin-top:8px">Ne répondez pas à cet email — boîte non surveillée.</p>
  </div>
</div>
</body>
</html>
