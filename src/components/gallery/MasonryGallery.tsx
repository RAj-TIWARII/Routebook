import { useState } from 'react';
import type { Photo } from '@/types';
import { Lightbox } from './Lightbox';

export function MasonryGallery({ photos }: { photos: Photo[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Split into balanced columns for a masonry effect without extra libraries.
  const columns = 3;
  const cols: Photo[][] = Array.from({ length: columns }, () => []);
  photos.forEach((photo, i) => cols[i % columns].push(photo));

  return (
    <>
      <div id="gallery" className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cols.map((col, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-4">
            {col.map((photo) => {
              const globalIndex = photos.indexOf(photo);
              return (
                <button
                  key={photo.id}
                  onClick={() => setOpenIndex(globalIndex)}
                  className="group relative overflow-hidden rounded-[16px] border border-border bg-white/[0.03]"
                  style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox
          photos={photos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}
