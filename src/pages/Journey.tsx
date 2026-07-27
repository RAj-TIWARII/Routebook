import { Suspense, lazy } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Calendar, Route as RouteIcon, ArrowLeft } from 'lucide-react';
import { useJourney, useJourneys } from '@/hooks/useJourneys';
import { MasonryGallery } from '@/components/gallery/MasonryGallery';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { ShareButton } from '@/components/journey/ShareButton';
import { GlassCard } from '@/components/shared/GlassCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { Footer } from '@/components/layout/Footer';
import { formatFullDate } from '@/lib/utils';

const JourneyRouteMap = lazy(() =>
  import('@/components/map/JourneyRouteMap').then((m) => ({ default: m.JourneyRouteMap })),
);

export function JourneyPage() {
  const { slug } = useParams();
  const { data: journey, isLoading } = useJourney(slug);
  const { data: allJourneys } = useJourneys();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-secondary">Loading…</div>;
  }

  if (!journey) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="font-display text-2xl">Journey not found</p>
        <Link to="/" className="text-accent hover:underline">
          Back to RouteBook
        </Link>
      </div>
    );
  }

  const nearby = (allJourneys ?? [])
    .filter((j) => j.country === journey.country && j.id !== journey.id)
    .slice(0, 3);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${journey.lat},${journey.lng}`;

  return (
    <div>
      {/* Hero banner */}
      <section className="relative flex h-[70vh] min-h-[480px] w-full items-end overflow-hidden">
        <img src={journey.hero_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-black/30" />

        <Link
          to="/"
          className="absolute left-6 top-6 z-10 glass flex h-10 w-10 items-center justify-center sm:left-12 sm:top-8"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-14 sm:px-12"
        >
          <p className="mb-3 font-mono-num text-[12px] tracking-[0.2em] text-accent uppercase">
            {journey.country}
          </p>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-tight text-primary">
            {journey.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[14px] text-secondary">
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {journey.city}, {journey.country}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatFullDate(journey.date_start)} – {formatFullDate(journey.date_end)}
            </span>
          </div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-12">
        {/* Story + actions */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
          <ScrollReveal>
            <p className="max-w-2xl text-[17px] leading-relaxed text-secondary">{journey.story}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="flex flex-col gap-3 lg:items-end">
              <ShareButton title={journey.title} />
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="glass flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-primary transition-colors hover:bg-glass-strong"
              >
                <ExternalLink size={15} /> Open in Google Maps
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats */}
        <ScrollReveal className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <GlassCard className="p-5">
            <p className="font-mono-num text-[24px] text-primary">{journey.distance_km}</p>
            <p className="text-[12px] text-secondary">Kilometers traveled</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="font-mono-num text-[24px] text-primary">{journey.photos.length}</p>
            <p className="text-[12px] text-secondary">Photos</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="font-mono-num text-[24px] text-primary">{journey.videos.length}</p>
            <p className="text-[12px] text-secondary">Videos</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="font-mono-num text-[24px] text-primary">{journey.places_visited.length}</p>
            <p className="text-[12px] text-secondary">Places visited</p>
          </GlassCard>
        </ScrollReveal>

        {/* Route map */}
        <div className="mt-20">
          <SectionHeading eyebrow="On the ground" title="Route" />
          <ScrollReveal>
            <Suspense
              fallback={
                <div className="h-[380px] w-full animate-pulse rounded-[18px] border border-border bg-white/[0.03]" />
              }
            >
              <JourneyRouteMap journey={journey} />
            </Suspense>
          </ScrollReveal>
        </div>

        {/* Places visited */}
        <div className="mt-20">
          <SectionHeading eyebrow="Stops along the way" title="Places visited" />
          <ScrollReveal className="flex flex-wrap gap-3">
            {journey.places_visited.map((place) => (
              <span
                key={place}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[13px] text-secondary"
              >
                <RouteIcon size={13} className="text-accent" /> {place}
              </span>
            ))}
          </ScrollReveal>
        </div>

        {/* Gallery */}
        {journey.photos.length > 0 && (
          <div className="mt-20">
            <SectionHeading eyebrow={`${journey.photos.length} photos`} title="Gallery" />
            <ScrollReveal>
              <MasonryGallery photos={journey.photos} />
            </ScrollReveal>
          </div>
        )}

        {/* Videos */}
        {journey.videos.length > 0 && (
          <div id="videos" className="mt-20">
            <SectionHeading eyebrow={`${journey.videos.length} clips`} title="Videos" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {journey.videos.map((video) => (
                <ScrollReveal key={video.id}>
                  <VideoPlayer video={video} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Nearby places */}
        {nearby.length > 0 && (
          <div className="mt-20">
            <SectionHeading eyebrow="Also in the region" title="Nearby places" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {nearby.map((n) => (
                <ScrollReveal key={n.id}>
                  <Link
                    to={`/journey/${n.slug}`}
                    className="group block overflow-hidden rounded-[18px] border border-border"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={n.cover_image}
                        alt={n.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-display text-[14px] font-medium text-primary">{n.title}</p>
                      <p className="text-[12px] text-secondary">{n.city}</p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
