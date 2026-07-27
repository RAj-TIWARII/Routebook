import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through silently
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={handleShare}
      className="glass flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-primary transition-colors hover:bg-glass-strong"
    >
      {copied ? <Check size={15} className="text-accent" /> : <Share2 size={15} />}
      {copied ? 'Link copied' : 'Share'}
    </button>
  );
}
