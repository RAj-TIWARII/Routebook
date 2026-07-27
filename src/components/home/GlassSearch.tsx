import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import { useJourneys } from '@/hooks/useJourneys';
import { useSearch } from '@/hooks/useSearch';
import { SearchResultCard } from './SearchResultCard';

export function GlassSearch() {
  const { data: journeys } = useJourneys();
  const { query, setQuery, results } = useSearch(journeys);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong flex items-center gap-3 px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
      >
        <Search size={20} className="shrink-0 text-secondary" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search journeys, places, galleries, stories…"
          className="w-full bg-transparent font-body text-[15px] text-primary placeholder:text-secondary/70 focus:outline-none"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="shrink-0 rounded-full p-1 text-secondary hover:text-primary"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 right-0 top-[calc(100%+14px)] z-20 flex max-h-[60vh] flex-col gap-2 overflow-y-auto"
          >
            {results.map((result, i) => (
              <SearchResultCard key={result.id} result={result} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
