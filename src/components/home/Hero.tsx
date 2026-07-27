import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GlassSearch } from './GlassSearch';

/**
 * Swap HERO_IMAGE for the user-provided cinematic photograph once supplied.
 * Until then this gradient stands in so the vignette/composition can be
 * judged in place.
 */
const HERO_IMAGE = '';

export function Hero() {
  return (
    <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0">
        {HERO_IMAGE ? (
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_#151821_0%,_#050505_70%)]" />
        )}
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(5,5,5,0.55)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 font-mono-num text-[13px] tracking-[0.25em] text-secondary uppercase"
        >
          A private atlas
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.05] text-primary"
        >
          Every place you've
          <br />
          ever been.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-md text-balance text-[16px] leading-relaxed text-secondary"
        >
          RouteBook is where your journeys live — mapped, timed, and
          remembered in full resolution.
        </motion.p>

        <div className="mt-10 w-[min(90vw,42rem)]">
          <GlassSearch />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-9 z-10 flex flex-col items-center gap-2 text-secondary"
      >
        <span className="text-[11px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
