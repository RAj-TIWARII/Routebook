import { Link } from 'react-router-dom';
import { useJourneys } from '@/hooks/useJourneys';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

export function FeaturedGalleries() {
  const { data: journeys } = useJourneys();
  const featured = (journeys ?? []).filter((j) => j.photos.length > 0).slice(0, 3);

  return (
    <section id="galleries" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="In full resolution"
          title="Featured galleries"
          description="A closer look at three journeys, photo by photo."
        />

        <div className="flex flex-col gap-6">
          {featured.map((journey, i) => (
            <ScrollReveal key={journey.id} delay={i * 0.08}>
              <Link
                to={`/journey/${journey.slug}#gallery`}
                className="group grid grid-cols-1 gap-5 overflow-hidden rounded-[18px] border border-border bg-white/[0.03] p-5 transition-colors hover:border-white/20 sm:grid-cols-[1.1fr_1fr]"
              >
                <div className="grid grid-cols-3 gap-2">
                  {journey.photos.slice(0, 3).map((photo) => (
                    <div key={photo.id} className="aspect-square overflow-hidden rounded-[12px]">
                      <img
                        src={photo.url}
                        alt={photo.alt}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-mono-num text-[12px] tracking-wide text-accent">
                    {journey.photos.length} photos · {journey.country}
                  </p>
                  <h3 className="mt-1 font-display text-[22px] font-semibold text-primary">
                    {journey.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-secondary">
                    {journey.story}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
