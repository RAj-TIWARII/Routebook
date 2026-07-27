import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import type { Photo } from '@/types';
import { formatFullDate } from '@/lib/utils';

interface LightboxProps {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export function Lightbox({ photos, index, onClose, onIndexChange }: LightboxProps) {
  const [zoomed, setZoomed] = useState(false);
  const x = useMotionValue(0);
  const photo = photos[index];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndexChange((index + 1) % photos.length);
      if (e.key === 'ArrowLeft') onIndexChange((index - 1 + photos.length) % photos.length);
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, photos.length, onClose, onIndexChange]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <div className="flex items-center justify-between px-6 py-5" onClick={(e) => e.stopPropagation()}>
          <div className="text-[13px] text-secondary">
            <span className="font-mono-num text-primary">{index + 1}</span> / {photos.length}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
              className="text-secondary hover:text-primary"
            >
              {zoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
            </button>
            <button onClick={onClose} aria-label="Close" className="text-secondary hover:text-primary">
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
            className="absolute left-3 z-10 rounded-full p-2 text-secondary hover:bg-white/10 hover:text-primary sm:left-6"
          >
            <ChevronLeft size={24} />
          </button>

          <motion.img
            key={photo.id}
            drag={zoomed ? false : 'x'}
            style={{ x }}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onIndexChange((index + 1) % photos.length);
              if (info.offset.x > 80) onIndexChange((index - 1 + photos.length) % photos.length);
            }}
            src={photo.url}
            alt={photo.alt}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: zoomed ? 1.6 : 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[75vh] max-w-full cursor-grab select-none rounded-[12px] object-contain active:cursor-grabbing"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % photos.length);
            }}
            aria-label="Next photo"
            className="absolute right-3 z-10 rounded-full p-2 text-secondary hover:bg-white/10 hover:text-primary sm:right-6"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div
          className="flex items-center justify-center gap-4 px-6 py-5 text-[12px] text-secondary"
          onClick={(e) => e.stopPropagation()}
        >
          {photo.camera && <span>{photo.camera}</span>}
          {photo.taken_on && <span>{formatFullDate(photo.taken_on)}</span>}
          {photo.location && <span>{photo.location}</span>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
