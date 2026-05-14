<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatBotController extends Controller
{
    private string $systemPrompt = <<<'PROMPT'
Tu es l'assistant virtuel de Jobly (jobly.ma), une plateforme marocaine qui met en relation les clients avec des artisans et professionnels vérifiés (plombiers, électriciens, menuisiers, peintres, etc.).

Règles :
- Réponds toujours dans la même langue que l'utilisateur (français, arabe, darija marocaine)
- Sois concis : 2-3 phrases maximum par réponse
- Si quelqu'un cherche un artisan, dis-lui de visiter /professionals ou d'utiliser la barre de recherche
- Pour s'inscrire comme client : /client/register
- Pour s'inscrire comme professionnel : /pro/register
- Pour se connecter : /login
- Le service est GRATUIT pour les clients
- Les professionnels peuvent s'inscrire gratuitement et être contactés directement via WhatsApp
- En cas de question complexe, suggère de contacter contact@jobly.ma ou +212 617-776729
- Ne dis jamais que tu es Claude ou un produit Anthropic — tu es "l'assistant Jobly"
PROMPT;

    private array $faqFr = [
        'trouver'     => "Pour trouver un artisan, visitez [jobly.ma/professionals](/professionals) et filtrez par ville ou catégorie. Le contact se fait directement par WhatsApp ! 🔧",
        'artisan'     => "Nous avons plus de 500 artisans vérifiés dans 20+ villes du Maroc : plombiers, électriciens, peintres, menuisiers et bien plus. Visitez [la liste](/professionals) pour commencer !",
        'inscrire'    => "Pour vous inscrire comme **client**, c'est gratuit → [/client/register](/client/register). Vous êtes artisan ? → [/pro/register](/pro/register) pour rejoindre la plateforme.",
        'register'    => "Pour vous inscrire comme **client**, c'est gratuit → [/client/register](/client/register). Vous êtes artisan ? → [/pro/register](/pro/register) pour rejoindre la plateforme.",
        'gratuit'     => "Oui, Jobly est **100% gratuit** pour les clients ! Trouvez un artisan, contactez-le par WhatsApp, sans frais cachés. 🎉",
        'prix'        => "Pour les clients, c'est totalement **gratuit**. Pour les professionnels, l'inscription est également gratuite. Les prix des travaux sont négociés directement avec l'artisan.",
        'tarif'       => "Pour les clients, c'est totalement **gratuit**. Pour les professionnels, l'inscription est également gratuite. Les prix des travaux sont négociés directement avec l'artisan.",
        'whatsapp'    => "Oui ! Chaque artisan a un bouton WhatsApp direct sur son profil. Cliquez et chattez instantanément sans intermédiaire. 📱",
        'verifi'      => "Tous nos artisans passent par un processus de vérification : identité, compétences et avis clients. Vous voyez le badge ✅ sur les profils vérifiés.",
        'contact'     => "Vous pouvez nous contacter par email : **contact@jobly.ma** ou par téléphone : **+212 617-776729**. Notre équipe répond dans les 24h.",
        'login'       => "Pour vous connecter, visitez [/login](/login). Entrez votre email et mot de passe ou utilisez Google.",
        'connexion'   => "Pour vous connecter, visitez [/login](/login). Entrez votre email et mot de passe ou utilisez Google.",
        'plombier'    => "Trouvez un plombier certifié près de chez vous → [Voir les plombiers](/professionals?profession=Plombier) 🔧",
        'electricien' => "Trouvez un électricien certifié → [Voir les électriciens](/professionals?profession=Electricien) ⚡",
        'peintr'      => "Trouvez un peintre professionnel → [Voir les peintres](/professionals?profession=Peintre) 🎨",
        'menuisier'   => "Trouvez un menuisier qualifié → [Voir les menuisiers](/professionals?profession=Menuisier) 🪵",
        'avis'        => "Les avis clients sont vérifiés et publiés sur chaque profil. Vous pouvez laisser un avis après votre prestation depuis votre espace client.",
        'casablanca'  => "Nous avons de nombreux artisans à Casablanca ! Visitez [la liste](/professionals) et filtrez par ville. 🏙️",
        'bonjour'     => "Bonjour ! 👋 Je suis l'assistant Jobly. Comment puis-je vous aider aujourd'hui ?",
        'merci'       => "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Bonne journée ! 😊",
    ];

    private array $faqAr = [
        'حرفي'       => "للعثور على حرفي، زر [قائمة الحرفيين](/professionals) وابحث حسب المدينة أو التخصص. التواصل مباشرة عبر واتساب! 🔧",
        'سباك'       => "ابحث عن سباك محترف قريب منك ← [عرض السباكين](/professionals?profession=Plombier) 🔧",
        'كهربائي'    => "ابحث عن كهربائي معتمد ← [عرض الكهربائيين](/professionals?profession=Electricien) ⚡",
        'تسجيل'      => "التسجيل كعميل مجاني → [/client/register](/client/register). أنت حرفي؟ → [/pro/register](/pro/register) للانضمام.",
        'مجاني'      => "نعم! Jobly مجاني 100% للعملاء 🎉 ابحث عن حرفي، تواصل معه مباشرة عبر واتساب، بدون رسوم خفية.",
        'سعر'        => "الخدمة مجانية تماماً للعملاء. الاشتراك للحرفيين أيضاً مجاني. تتفاوض الأسعار مباشرة مع الحرفي.",
        'واتساب'     => "نعم! كل حرفي لديه زر واتساب مباشر على ملفه الشخصي. اضغط وتواصل فوراً! 📱",
        'موثوق'      => "جميع حرفيينا يمرون بعملية تحقق: الهوية والكفاءة وتقييمات العملاء. ستجد شارة ✅ على الملفات الموثقة.",
        'تواصل'      => "تواصل معنا عبر البريد الإلكتروني: **contact@jobly.ma** أو الهاتف: **+212 617-776729**",
        'دخول'       => "لتسجيل الدخول، زر [/login](/login). أدخل بريدك الإلكتروني وكلمة المرور أو استخدم Google.",
        'مرحبا'      => "مرحباً! 👋 أنا مساعد Jobly. كيف يمكنني مساعدتك اليوم؟",
        'شكرا'       => "بكل سرور! لا تتردد في السؤال عن أي شيء آخر. يوماً سعيداً! 😊",
        'الدار البيضاء' => "لدينا العديد من الحرفيين في الدار البيضاء! زر [القائمة](/professionals) وابحث حسب المدينة. 🏙️",
    ];

    public function reply(Request $request)
    {
        $request->validate([
            'message'  => 'required|string|max:500',
            'language' => 'nullable|string|max:10',
        ]);

        $message  = trim($request->input('message'));
        $language = $request->input('language', 'fr');

        // Rate limit: max 20 calls per minute per IP
        $cacheKey = 'chat_' . $request->ip();
        $count    = (int) cache()->get($cacheKey . '_count', 0);
        if ($count >= 20) {
            $tooMany = str_starts_with($language, 'ar') || $language === 'dz'
                ? 'رسائل كثيرة جداً. انتظر دقيقة.'
                : 'Trop de messages. Veuillez attendre une minute.';
            return response()->json(['reply' => $tooMany]);
        }
        cache()->put($cacheKey . '_count', $count + 1, 60);

        // 1) Google Gemini (GRATUIT) — priorité
        $geminiKey = config('services.gemini.key');
        if ($geminiKey) {
            return $this->replyWithGemini($message, $language, $geminiKey);
        }

        // 2) Anthropic Claude (payant) — fallback optionnel
        $claudeKey = config('services.anthropic.key');
        if ($claudeKey) {
            return $this->replyWithClaude($message, $language, $claudeKey);
        }

        // 3) FAQ statique — toujours disponible
        return response()->json(['reply' => $this->faqMatch($message, $language)]);
    }

    /**
     * Google Gemini — 100% gratuit
     * Clé : https://aistudio.google.com/app/apikey
     * Modèle : gemini-2.0-flash (gratuit, rapide)
     */
    private function replyWithGemini(string $message, string $language, string $apiKey): \Illuminate\Http\JsonResponse
    {
        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={$apiKey}";

            $res = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(15)
                ->post($url, [
                    'system_instruction' => [
                        'parts' => [['text' => $this->systemPrompt]],
                    ],
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => $message]]],
                    ],
                    'generationConfig' => [
                        'maxOutputTokens' => 300,
                        'temperature'     => 0.7,
                    ],
                ]);

            if ($res->successful()) {
                $reply = $res->json('candidates.0.content.parts.0.text');
                if ($reply) {
                    return response()->json(['reply' => trim($reply)]);
                }
            }
        } catch (\Exception) {}

        return response()->json(['reply' => $this->faqMatch($message, $language)]);
    }

    /**
     * Anthropic Claude — payant (optionnel)
     */
    private function replyWithClaude(string $message, string $language, string $apiKey): \Illuminate\Http\JsonResponse
    {
        try {
            $res = Http::withHeaders([
                'x-api-key'         => $apiKey,
                'anthropic-version' => '2023-06-01',
                'Content-Type'      => 'application/json',
            ])->timeout(15)->post('https://api.anthropic.com/v1/messages', [
                'model'      => 'claude-haiku-4-5-20251001',
                'max_tokens' => 300,
                'system'     => $this->systemPrompt,
                'messages'   => [['role' => 'user', 'content' => $message]],
            ]);

            if ($res->successful()) {
                $reply = $res->json('content.0.text');
                if ($reply) {
                    return response()->json(['reply' => trim($reply)]);
                }
            }
        } catch (\Exception) {}

        return response()->json(['reply' => $this->faqMatch($message, $language)]);
    }

    private function faqMatch(string $message, string $language): string
    {
        $lower = mb_strtolower($message);
        $isAr  = str_starts_with($language, 'ar') || $language === 'dz';
        $faq   = $isAr ? $this->faqAr : $this->faqFr;

        foreach ($faq as $keyword => $answer) {
            if (mb_strpos($lower, mb_strtolower($keyword)) !== false) {
                return $answer;
            }
        }

        // Default fallback
        return $isAr
            ? "شكراً على سؤالك! يمكنك زيارة [قائمة الحرفيين](/professionals) أو التواصل معنا على **contact@jobly.ma** للمساعدة المباشرة. 😊"
            : "Merci pour votre question ! Vous pouvez visiter [notre liste d'artisans](/professionals) ou nous contacter sur **contact@jobly.ma** pour une aide personnalisée. 😊";
    }
}
