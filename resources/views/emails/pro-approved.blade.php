<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profil approuvé – Jobly</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,.85); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 40px; }
        .body p { color: #374151; line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
        .badge { display: inline-block; background: #d1fae5; color: #065f46; border-radius: 99px; padding: 6px 18px; font-weight: 700; font-size: 14px; margin: 0 0 24px; }
        .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #f97316; color: #fff !important; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; }
        .info-box { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .info-box p { color: #92400e; font-size: 14px; margin: 0 0 8px; }
        .info-box p:last-child { margin: 0; }
        .footer { background: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>✅ Jobly</h1>
        <p>Votre profil professionnel est approuvé !</p>
    </div>
    <div class="body">
        <p>Bonjour <strong>{{ $proName }}</strong>,</p>
        <span class="badge">✅ Profil activé</span>
        <p>Nous avons le plaisir de vous informer que votre profil professionnel sur <strong>Jobly</strong> a été <strong>approuvé</strong> par notre équipe.</p>
        <p>Votre profil est maintenant <strong>visible par tous les clients</strong> et vous pouvez commencer à recevoir des contacts directement.</p>

        <div class="info-box">
            <p>📋 <strong>Récapitulatif de votre profil :</strong></p>
            <p>👤 Nom : {{ $proName }}</p>
            <p>🔧 Métier : {{ $proProfession }}</p>
            <p>📍 Ville principale : {{ $proCity }}</p>
        </div>

        <p>Connectez-vous à votre espace pour compléter votre profil, ajouter des photos de votre travail et activer votre disponibilité :</p>

        <div style="text-align: center;">
            <a href="{{ $dashboardUrl }}" class="btn">Accéder à mon espace</a>
        </div>

        <p style="font-size:13px;color:#6b7280;">Conseil : Un profil complet avec photo et description reçoit <strong>3× plus de contacts</strong>. Prenez quelques minutes pour le compléter.</p>
    </div>
    <div class="footer">
        <p>© {{ date('Y') }} Jobly – Plateforme des professionnels au Maroc</p>
        <p>Cet email a été envoyé à {{ $proEmail }}</p>
    </div>
</div>
</body>
</html>
