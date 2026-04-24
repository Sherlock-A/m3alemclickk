<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe – M3allemClick</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,.85); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 40px; }
        .body p { color: #374151; line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #f97316; color: #fff !important; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; }
        .btn:hover { background: #ea580c; }
        .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin: 24px 0; }
        .warning p { color: #9a3412; font-size: 13px; margin: 0; }
        .url-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; word-break: break-all; font-size: 12px; color: #6b7280; margin: 16px 0; }
        .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>🔐 M3allemClick</h1>
        <p>Plateforme des professionnels au Maroc</p>
    </div>
    <div class="body">
        <p>Bonjour <strong>{{ $user->name }}</strong>,</p>
        <p>Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte professionnel M3allemClick.</p>
        <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

        <div style="text-align: center;">
            <a href="{{ $resetUrl }}" class="btn">Réinitialiser mon mot de passe</a>
        </div>

        <div class="warning">
            <p>⏱ Ce lien est valable pendant <strong>{{ $expiresIn }}</strong> uniquement.</p>
        </div>

        <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.</p>

        <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
        <div class="url-box">{{ $resetUrl }}</div>
    </div>
    <div class="footer">
        <p>© {{ date('Y') }} M3allemClick – Plateforme des professionnels au Maroc</p>
        <p>Cet email a été envoyé à {{ $user->email }}</p>
    </div>
</div>
</body>
</html>
