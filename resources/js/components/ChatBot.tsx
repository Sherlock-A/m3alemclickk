import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Send, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, Minimize2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'bot' | 'user';
  content: string;
  ts: Date;
  liked?: boolean | null;
  copied?: boolean;
};

/* Simple markdown renderer: **bold**, [link](url), newlines */
function MdContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\n)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part === '\n') return <br key={i} />;
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) return (
          <a key={i} href={link[2]}
            className="underline font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700"
            target={link[2].startsWith('http') ? '_blank' : '_self'}
            rel="noopener noreferrer">
            {link[1]}
          </a>
        );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function RobotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <rect x="8" y="14" width="24" height="18" rx="4" fill="currentColor" opacity="0.9"/>
      <rect x="13" y="19" width="5" height="5" rx="1.5" fill="white"/>
      <rect x="22" y="19" width="5" height="5" rx="1.5" fill="white"/>
      <rect x="16" y="27" width="8" height="2" rx="1" fill="white" opacity="0.7"/>
      <rect x="18" y="8" width="4" height="6" rx="2" fill="currentColor" opacity="0.9"/>
      <circle cx="20" cy="7" r="3" fill="currentColor" opacity="0.7"/>
      <rect x="4" y="18" width="4" height="8" rx="2" fill="currentColor" opacity="0.7"/>
      <rect x="32" y="18" width="4" height="8" rx="2" fill="currentColor" opacity="0.7"/>
    </svg>
  );
}

export function ChatBot() {
  const { t, i18n } = useTranslation();
  const { rtl } = useLanguage();
  const lang = i18n.language;

  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showPulse, setShowPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  /* ── Initial greeting ────────────────────────────────────────────────────── */
  const greeting = (): Message => ({
    id: 'greet',
    role: 'bot',
    content: lang.startsWith('ar')
      ? 'مرحباً بك! 👋 أنا مساعد Jobly الذكي. كيف يمكنني مساعدتك في إيجاد حرفي اليوم؟'
      : 'Bonjour ! 👋 Je suis l\'assistant Jobly. Comment puis-je vous aider à trouver le bon artisan aujourd\'hui ?',
    ts: new Date(),
  });

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([greeting()]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
    // Stop pulse once opened
    if (open) setShowPulse(false);
  }, [open]);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, minimized]);

  /* ── Send message ────────────────────────────────────────────────────────── */
  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text, ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res  = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ message: text, language: lang }),
      });
      const data = await res.json();
      const botMsg: Message = {
        id:      crypto.randomUUID(),
        role:    'bot',
        content: data.reply ?? (lang.startsWith('ar') ? 'عذراً، حدث خطأ.' : 'Désolé, une erreur est survenue.'),
        ts:      new Date(),
        liked:   null,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id:      crypto.randomUUID(),
        role:    'bot',
        content: lang.startsWith('ar') ? 'خطأ في الشبكة. حاول مجدداً.' : 'Erreur réseau. Veuillez réessayer.',
        ts:      new Date(),
        liked:   null,
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, lang]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const copyMsg = (id: string, content: string) => {
    navigator.clipboard.writeText(content).catch(() => {});
    setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: true } : m));
    setTimeout(() => setMessages(prev => prev.map(m => m.id === id ? { ...m, copied: false } : m)), 2000);
  };

  const likeMsg = (id: string, val: boolean) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, liked: m.liked === val ? null : val } : m));
  };

  const reset = () => {
    setMessages([greeting()]);
    setInput('');
  };

  const placeholder = lang.startsWith('ar')
    ? 'اسأل عن مشكلتك...'
    : 'Posez votre question...';

  /* ── Render ──────────────────────────────────────────────────────────────── */
  return (
    <div className={`fixed bottom-5 z-50 ${rtl ? 'left-5' : 'right-5'} flex flex-col items-end gap-3`}>

      {/* ── Chat panel ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="w-80 sm:w-96 flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/30 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          style={{ maxHeight: minimized ? 0 : '520px', transition: 'max-height 0.3s ease' }}
          dir={rtl ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
              <RobotIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {lang.startsWith('ar') ? 'مساعد Jobly' : 'Assistant Jobly'}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-xs text-slate-400">
                  {lang.startsWith('ar') ? 'متصل' : 'En ligne'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={reset} aria-label="Réinitialiser"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setMinimized(v => !v)} aria-label="Minimiser"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors">
                <Minimize2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setOpen(false)} aria-label="Fermer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!minimized && <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950" style={{ maxHeight: 340 }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? (rtl ? 'justify-start' : 'justify-end') : (rtl ? 'justify-end' : 'justify-start')} gap-2`}>
                  {msg.role === 'bot' && (
                    <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-1">
                      <RobotIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-1.5">
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700'
                    }`}>
                      {msg.role === 'bot' ? <MdContent text={msg.content} /> : msg.content}
                    </div>
                    {msg.role === 'bot' && (
                      <div className="flex items-center gap-1">
                        <button onClick={() => copyMsg(msg.id, msg.content)} aria-label="Copier"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                          <Copy className={`h-3 w-3 ${msg.copied ? 'text-green-500' : ''}`} />
                        </button>
                        <button onClick={() => likeMsg(msg.id, false)} aria-label="Pas utile"
                          className={`p-1 rounded-lg transition-colors ${msg.liked === false ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-700'}`}>
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                        <button onClick={() => likeMsg(msg.id, true)} aria-label="Utile"
                          className={`p-1 rounded-lg transition-colors ${msg.liked === true ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-700'}`}>
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className={`flex ${rtl ? 'justify-end' : 'justify-start'} gap-2`}>
                  <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-1">
                    <RobotIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (quick replies) */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pt-2 pb-1 flex flex-wrap gap-1.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                {(lang.startsWith('ar')
                  ? ['كيف أجد حرفي؟', 'كيف أسجل؟', 'هل الخدمة مجانية؟']
                  : ['Trouver un artisan', 'Comment s\'inscrire ?', 'Prix et tarifs']
                ).map(q => (
                  <button key={q} onClick={() => { setInput(q); setTimeout(() => send(), 0); }}
                    className="text-xs px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:bg-orange-100 transition-colors font-medium">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={placeholder}
                disabled={loading}
                dir={rtl ? 'rtl' : 'ltr'}
                className="flex-1 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-400 transition-colors disabled:opacity-50"
              />
              <button onClick={send} disabled={!input.trim() || loading} aria-label="Envoyer"
                className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 disabled:opacity-40 active:scale-95 transition-all shrink-0 shadow-lg shadow-orange-500/30">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>}
        </div>
      )}

      {/* ── Floating trigger button ─────────────────────────────────────────── */}
      <button
        onClick={() => { setOpen(v => !v); setMinimized(false); }}
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat'}
        className={`h-14 w-14 rounded-full shadow-xl shadow-orange-500/30 flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-slate-800 hover:bg-slate-700 rotate-0' : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        {open
          ? <X className="h-6 w-6 text-white" />
          : <>
              <RobotIcon className="h-8 w-8 text-white" />
              {showPulse && (
                <span className="absolute h-14 w-14 rounded-full bg-orange-500 animate-ping opacity-30" />
              )}
            </>
        }
      </button>
    </div>
  );
}
