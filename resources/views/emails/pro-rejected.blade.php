<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profil non approuvé – Jobly</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
        .header { background: linear-gradient(135deg, #64748b, #475569); padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 26px; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,.85); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 40px; }
        .body p { color: #374151; line-height: 1.7; font-size: 15px; margin: 0 0 16px; }
        .reason-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0; }
        .reason-box p { color: #991b1b; font-size: 14px; margin: 0; }
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
        <p>Mise à jour sur votre demande d'inscription</p>
    </div>
    <div class="body">
        <p>Bonjour <strong>{{ $proName }}</strong>,</p>
        <p>Après examen de votre profil professionnel, notre équipe n'a pas pu l'approuver pour le moment.</p>

        @if($rejectionReason)
        <div class="reason-box">
            <p>📋 <strong>Motif :</strong> {{ $rejectionReason }}</p>
        </div>
        @endif

        <div class="info-box">
            <p>💡 <strong>Que faire maintenant ?</strong></p>
            <p>• Vérifiez les informations de votre profil (nom, métier, téléphone)</p>
            <p>• Assurez-vous que votre numéro WhatsApp est valide</p>
            <p>• Vous pouvez créer un nouveau compte avec des informations complètes</p>
        </div>

        <p>Si vous pensez qu'il s'agit d'une erreur ou si vous avez des questions, contactez-nous via le formulaire de contact sur notre site.</p>

        <div style="text-align: center;">
            <a href="{{ $contactUrl }}" class="btn">Nous contacter</a>
        </div>
    </div>
    <div class="footer">
        <p>© {{ date('Y') }} Jobly – Plateforme des professionnels au Maroc</p>
        <p>Cet email a été envoyé à {{ $proEmail }}</p>
    </div>
</div>
</body>
</html>
