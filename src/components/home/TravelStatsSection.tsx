import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useTravelStats } from '@/hooks/useJourneys';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { GlassCard } from '@/components/shared/GlassCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, to]);

  return (
    <span ref={ref} className="font-mono-num">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

export function TravelStatsSection() {
  const { data: stats } = useTravelStats();
  if (!stats) return null;

  const items = [
    { label: 'Countries visited', value: stats.countries_visited },
    { label: 'Cities explored', value: stats.cities_visited },
    { label: 'Journeys logged', value: stats.total_journeys },
    { label: 'Kilometers traveled', value: stats.total_distance_km },
    { label: 'Photos captured', value: stats.total_photos },
    { label: 'Videos recorded', value: stats.total_videos },
  ];

  return (
    <section className="px-6 py-28 sm:px-12">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="By the numbers" title="Travel statistics" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.05}>
              <GlassCard className="flex flex-col gap-2 p-6">
                <span className="text-[32px] font-semibold text-primary">
                  <Counter to={item.value} />
                </span>
                <span className="text-[13px] text-secondary">{item.label}</span>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
