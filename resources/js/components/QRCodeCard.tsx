import { useState } from 'react';
import { QrCode, Download, Share2 } from 'lucide-react';

type Props = { url: string; name: string };

export function QRCodeCard({ url, name }: Props) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&bgcolor=ffffff&color=1e293b&margin=8`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encoded}&bgcolor=ffffff&color=1e293b&margin=16`;
    a.download = `qr-${name.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.target = '_blank';
    a.click();
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: name, url }).catch(() => {});
    } else {
      copyLink();
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 text-center space-y-4">
      <div className="flex items-center gap-2 justify-center mb-1">
        <QrCode className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-black text-slate-800 dark:text-white">Mon QR Code</h3>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Partagez votre profil en un scan</p>

      <div className="flex justify-center">
        <div className="rounded-2xl border-4 border-orange-100 dark:border-orange-900/30 p-2 bg-white shadow-sm">
          <img
            src={qrSrc}
            alt={`QR Code de ${name}`}
            className="h-40 w-40 rounded-xl"
            loading="lazy"
          />
        </div>
      </div>

      <p className="text-[10px] text-slate-400 break-all px-2">{url}</p>

      <div className="flex gap-2 justify-center">
        <button
          onClick={share}
          className="flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs font-semibold transition-colors"
        >
          <Share2 className="h-3.5 w-3.5" />
          {copied ? 'Copié !' : 'Partager'}
        </button>
        <button
          onClick={download}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 px-4 py-2 text-xs font-semibold transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Télécharger
        </button>
      </div>
    </div>
  );
}
