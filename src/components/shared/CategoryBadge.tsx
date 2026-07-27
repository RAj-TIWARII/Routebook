import type { SearchCategory } from '@/types';
import { cn } from '@/lib/utils';

const LABELS: Record<SearchCategory, string> = {
  journey: 'Journey',
  gallery: 'Gallery',
  place: 'Places',
  video: 'Videos',
  timeline: 'Timeline',
  story: 'Stories',
  country: 'Country',
  city: 'City',
};

export function CategoryBadge({ category, className }: { category: SearchCategory; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-secondary uppercase',
        className,
      )}
    >
      {LABELS[category]}
    </span>
  );
}
