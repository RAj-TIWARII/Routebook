import { Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-14 sm:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2 font-display text-[15px] font-semibold">
          <Compass size={16} className="text-accent" />
          RouteBook
        </div>
        <p className="max-w-sm text-[13px] leading-relaxed text-secondary">
          A private atlas of everywhere you've been — built to remember, not to perform.
        </p>
        <p className="font-mono-num text-[11px] tracking-wide text-secondary/60">
          © {new Date().getFullYear()} RouteBook. All journeys kept privately.
        </p>
      </div>
    </footer>
  );
}
