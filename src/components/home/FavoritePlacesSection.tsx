import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useJourneys } from '@/hooks/useJourneys';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export function FavoritePlacesSection() {
  const { data: journeys } = useJourneys();
  const favorites = (journeys ?? []).slice(0, 4);

  return (
    <section className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Kept close" title="Favorite places" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {favorites.map((journey, i) => (
            <ScrollReveal key={journey.id} delay={i * 0.06}>
              <Link
                to={`/journey/${journey.slug}`}
                className="group flex items-center gap-4 rounded-[18px] border border-border bg-white/[0.03] p-4 transition-colors hover:border-white/20"
              >
                <img
                  src={journey.cover_image}
                  alt={journey.title}
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-[14px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-[16px] font-medium text-primary">
                    {journey.location}
                  </h3>
                  <p className="truncate text-[13px] text-secondary">
                    {journey.city}, {journey.country}
                  </p>
                </div>
                <Heart size={16} className="shrink-0 text-accent" fill="currentColor" fillOpacity={0.15} />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
