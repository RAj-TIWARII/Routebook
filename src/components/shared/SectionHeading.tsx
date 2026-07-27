import { ScrollReveal } from './ScrollReveal';

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <ScrollReveal className="mb-12 max-w-xl">
      <p className="mb-3 font-mono-num text-[12px] tracking-[0.2em] text-accent uppercase">
        {eyebrow}
      </p>
      <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight text-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-secondary">{description}</p>
      )}
    </ScrollReveal>
  );
}
