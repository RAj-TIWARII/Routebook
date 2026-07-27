import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

/**
 * The brief calls for no floating nav "unless beautifully integrated" — so
 * this one stays invisible over the hero and fades in as a slim glass pill
 * once the person scrolls past it, never competing with the search bar.
 */
export function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-1/2 top-5 z-50 -translate-x-1/2"
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <div className="glass-strong flex items-center gap-6 px-5 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <Link to="/" className="flex items-center gap-2 font-display text-[14px] font-semibold">
          <Compass size={16} className="text-accent" />
          RouteBook
        </Link>
        <nav className="hidden items-center gap-5 text-[13px] text-secondary sm:flex">
          <a href="#map" className="hover:text-primary transition-colors">Map</a>
          <a href="#timeline" className="hover:text-primary transition-colors">Timeline</a>
          <a href="#galleries" className="hover:text-primary transition-colors">Galleries</a>
          <Link to="/admin" className="hover:text-primary transition-colors">Admin</Link>
        </nav>
      </div>
    </motion.header>
  );
}
