import { useJourneys } from '@/hooks/useJourneys';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import { VideoPlayer } from './VideoPlayer';

export function VideoGallerySection() {
  const { data: journeys } = useJourneys();
  const videos = (journeys ?? []).flatMap((j) => j.videos).slice(0, 3);

  if (!videos.length) return null;

  return (
    <section className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="In motion"
          title="Videos"
          description="Short clips from along the way."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {videos.map((video, i) => (
            <ScrollReveal key={video.id} delay={i * 0.1}>
              <VideoPlayer video={video} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
