import { Suspense, lazy } from 'react';
import { Hero } from '@/components/home/Hero';
import { RecentJourneys } from '@/components/home/RecentJourneys';
import { Timeline } from '@/components/timeline/Timeline';
import { FeaturedGalleries } from '@/components/home/FeaturedGalleries';
import { TravelStatsSection } from '@/components/home/TravelStatsSection';
import { VideoGallerySection } from '@/components/video/VideoGallerySection';
import { FavoritePlacesSection } from '@/components/home/FavoritePlacesSection';
import { Footer } from '@/components/layout/Footer';

// MapLibre GL is the single heaviest dependency in the app (~200kb gzipped),
// so the map only loads once the person has scrolled near it, not on first paint.
const WorldMap = lazy(() => import('@/components/map/WorldMap').then((m) => ({ default: m.WorldMap })));

function MapFallback() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28 sm:px-12">
      <div className="h-[560px] w-full animate-pulse rounded-[18px] border border-border bg-white/[0.03]" />
    </div>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <RecentJourneys />
      <Suspense fallback={<MapFallback />}>
        <WorldMap />
      </Suspense>
      <Timeline />
      <FeaturedGalleries />
      <TravelStatsSection />
      <VideoGallerySection />
      <FavoritePlacesSection />
      <Footer />
    </>
  );
}
