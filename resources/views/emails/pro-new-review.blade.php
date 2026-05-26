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
  .review-box { background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:20px 24px; margin:20px 0; }
  .stars { font-size:22px; letter-spacing:2px; margin-bottom:8px; }
  .comment { font-size:14px; color:#1e293b; font-style:italic; margin:0; }
  .client { font-size:12px; color:#94a3b8; margin-top:8px; }
  .cta { display:inline-block; margin-top:16px; background:#f97316; color:#fff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:700; font-size:14px; }
  .footer { padding:16px 32px; background:#f8fafc; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>⭐ Nouvel avis client approuvé</h1>
    <p>Bonjour {{ $proName }}, un client a laissé un avis sur votre profil !</p>
  </div>
  <div class="body">
    <p style="font-size:15px; color:#1e293b;">
      Bonne nouvelle ! L'avis de <strong>{{ $clientName }}</strong> a été approuvé et est maintenant visible sur votre profil public.
    </p>

    <div class="review-box">
      <div class="stars">{{ $stars }}</div>
      @if($comment)
        <p class="comment">"{{ $comment }}"</p>
      @endif
      <p class="client">— {{ $clientName }}</p>
    </div>

    <p style="font-size:13px; color:#64748b;">
      Vous pouvez répondre à cet avis depuis votre dashboard — les réponses augmentent la confiance des futurs clients.
    </p>

    <a href="{{ $dashboardUrl }}" class="cta">Répondre à l'avis</a>
  </div>
  <div class="footer">
    Vous recevez cet email car vous êtes inscrit sur <strong>Jobly.ma</strong>.
    <br>© 2026 Jobly — La plateforme des artisans au Maroc.
  </div>
</div>
</body>
</html>
