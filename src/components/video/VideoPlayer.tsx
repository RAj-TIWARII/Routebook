import { useRef, useState } from 'react';
import { Play, Pause, Maximize } from 'lucide-react';
import type { Video } from '@/types';

export function VideoPlayer({ video }: { video: Video }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function fullscreen() {
    videoRef.current?.requestFullscreen?.();
  }

  return (
    <div className="group relative overflow-hidden rounded-[18px] border border-border bg-black">
      <video
        ref={videoRef}
        poster={video.poster}
        src={video.url}
        playsInline
        preload="none"
        onClick={toggle}
        onEnded={() => setPlaying(false)}
        className="aspect-video w-full cursor-pointer object-cover"
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={playing ? 'Pause video' : 'Play video'}
            className="glass flex h-10 w-10 items-center justify-center text-primary"
          >
            {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
          <span className="text-[13px] font-medium text-white">{video.title}</span>
        </div>
        <button
          onClick={fullscreen}
          aria-label="Fullscreen"
          className="pointer-events-auto glass flex h-10 w-10 items-center justify-center text-primary"
        >
          <Maximize size={16} />
        </button>
      </div>
    </div>
  );
}
