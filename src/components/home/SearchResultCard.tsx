import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SearchResult } from '@/types';
import { CategoryBadge } from '@/components/shared/CategoryBadge';

export function SearchResultCard({ result, index }: { result: SearchResult; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={result.href}
        className="group glass flex items-center gap-4 p-3 pr-4 hover:bg-glass-strong hover:border-white/20 transition-all duration-300"
      >
        <img
          src={result.image}
          alt=""
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-[12px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-[15px] font-medium text-primary">
              {result.title}
            </h3>
            <CategoryBadge category={result.category} />
          </div>
          <p className="mt-0.5 truncate text-[13px] text-secondary">{result.description}</p>
        </div>
        <ArrowUpRight
          size={18}
          className="shrink-0 text-secondary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
        />
      </Link>
    </motion.div>
  );
}
