import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useJourneys } from '@/hooks/useJourneys';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { formatMonthYear } from '@/lib/utils';

export function RecentJourneys() {
  const { data: journeys } = useJourneys();
  const recent = (journeys ?? []).slice(0, 4);

  return (
    <section className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Latest"
          title="Recent journeys"
          description="The most recently logged trips, freshest memories first."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((journey, i) => (
            <ScrollReveal key={journey.id} delay={i * 0.08}>
              <Link
                to={`/journey/${journey.slug}`}
                className="group block overflow-hidden rounded-[18px] border border-border bg-white/[0.03] transition-colors hover:border-white/20"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={journey.cover_image}
                    alt={journey.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <ArrowUpRight
                    size={18}
                    className="absolute right-3 top-3 text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-mono-num text-[11px] tracking-wide text-white/70">
                      {formatMonthYear(journey.date_start)} · {journey.country}
                    </p>
                    <h3 className="mt-1 font-display text-[17px] font-medium text-white">
                      {journey.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
