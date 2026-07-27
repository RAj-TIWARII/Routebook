import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Mounts a single Lenis instance for the app's lifetime and drives it from
 * requestAnimationFrame. GSAP's ScrollTrigger (if used) should sync to the
 * same rAF loop — see ScrollReveal for the pattern.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
