<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compte suspendu – Jobly</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        .header { background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,.85); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 40px; }
        .body p { color: #374151; line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
        .reason-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .reason-box p { color: #991b1b; font-size: 14px; margin: 0 0 6px; }
        .reason-box p:last-child { margin: 0; }
        .info-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .info-box p { color: #0369a1; font-size: 14px; margin: 0 0 6px; }
        .info-box p:last-child { margin: 0; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #f97316; color: #fff !important; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; }
        .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>Jobly</h1>
        <p>Votre compte a été suspendu automatiquement</p>
    </div>
    <div class="body">
        <p>Bonjour <strong>{{ $proName }}</strong>,</p>
        <p>Suite à l'analyse automatique des avis clients de votre profil, votre compte a été suspendu.</p>

        <div class="reason-box">
            <p>📊 <strong>Note actuelle :</strong> {{ $rating }}/5</p>
            <p>Notre système suspend automatiquement les comptes dont la note est inférieure à 3/5 après 10 avis ou plus approuvés, afin de garantir la qualité de service sur Jobly.</p>
        </div>

        <div class="info-box">
            <p>💡 <strong>Comment réactiver votre compte ?</strong></p>
            <p>• Contactez notre équipe via le formulaire de contact</p>
            <p>• Expliquez les mesures correctives que vous avez prises</p>
            <p>• Notre équipe examinera votre demande de réactivation</p>
        </div>

        <p>Nous comprenons que cela peut être difficile. Notre objectif est de vous aider à améliorer votre service et à revenir sur la plateforme avec une meilleure réputation.</p>

        <div style="text-align: center;">
            <a href="{{ $contactUrl }}" class="btn">Contacter le support</a>
        </div>
    </div>
    <div class="footer">
        <p>© {{ date('Y') }} Jobly – Plateforme des professionnels au Maroc</p>
        <p>Cet email a été envoyé à {{ $proEmail }}</p>
    </div>
</div>
</body>
</html>
