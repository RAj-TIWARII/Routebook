import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useTimeline } from '@/hooks/useJourneys';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { formatFullDate } from '@/lib/utils';

export function Timeline() {
  const { data: entries } = useTimeline();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4'],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  return (
    <section id="timeline" className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Chronology"
          title="Travel timeline"
          description="Every journey, in the order it happened."
        />

        <div ref={containerRef} className="relative pl-10">
          {/* Track */}
          <div className="absolute left-[7px] top-0 h-full w-px bg-white/10" />
          {/* Animated progress */}
          <motion.div
            style={{ scaleY: lineProgress }}
            className="absolute left-[7px] top-0 h-full w-px origin-top bg-accent"
          />

          <div className="flex flex-col gap-10">
            {(entries ?? []).map((entry) => (
              <Link
                key={entry.id}
                to={`/journey/${entry.journey_slug}`}
                className="group relative flex items-center gap-5"
              >
                <span className="absolute -left-10 flex h-4 w-4 items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(110,168,255,0.18)] transition-transform duration-300 group-hover:scale-125" />
                </span>

                <img
                  src={entry.thumbnail}
                  alt={entry.place}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-[14px] border border-border object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="min-w-0">
                  <p className="font-mono-num text-[12px] tracking-wide text-accent">
                    {formatFullDate(entry.date)}
                  </p>
                  <h3 className="font-display text-[17px] font-medium text-primary group-hover:text-accent transition-colors">
                    {entry.place}
                  </h3>
                  <p className="text-[13px] text-secondary">{entry.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
