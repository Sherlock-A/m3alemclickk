import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallBanner() {
    const [prompt, setPrompt]     = useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible]   = useState(false);
    const [installing, setInstalling] = useState(false);

    useEffect(() => {
        // Don't show if already installed or dismissed recently
        const dismissed = localStorage.getItem('pwa_banner_dismissed');
        if (dismissed && Date.now() - parseInt(dismissed) < 7 * 86400 * 1000) return;

        const handler = (e: Event) => {
            e.preventDefault();
            setPrompt(e as BeforeInstallPromptEvent);
            setVisible(true);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const install = async () => {
        if (!prompt) return;
        setInstalling(true);
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
            setVisible(false);
        }
        setInstalling(false);
        setPrompt(null);
    };

    const dismiss = () => {
        localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-xs">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-4 flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                    <Download className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Installer Jobly</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Accédez à Jobly directement depuis votre écran d'accueil
                    </p>
                    <button
                        onClick={install}
                        disabled={installing}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white text-xs font-bold px-3 py-1.5 transition-colors"
                    >
                        {installing ? 'Installation...' : 'Installer l\'app'}
                    </button>
                </div>
                <button
                    onClick={dismiss}
                    className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
