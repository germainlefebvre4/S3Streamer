import { useState, useEffect } from 'react';
import { VideoCard } from './VideoCard';
import type { Video } from '../hooks/useFetchVideos';
import { Film } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  cols: number;
  loading: boolean;
  onVideoSelect: (video: Video) => void;
}

export function VideoGrid({ videos, cols, loading, onVideoSelect }: VideoGridProps) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading Skeleton rendering
  if (loading) {
    const skeletonCount = cols * 3; // Fill up the view nicely
    return (
      <div
        className={isDesktop ? 'grid gap-6' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'}
        style={isDesktop ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-48 p-4 bg-slate-900/10 border border-slate-900/40 rounded-2xl animate-pulse"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-900/60 rounded-xl" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-slate-900/60 rounded-md w-3/4" />
                <div className="h-3 bg-slate-900/60 rounded-md w-1/2" />
              </div>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-900/30">
              <div className="h-3 bg-slate-900/60 rounded-md w-1/4" />
              <div className="h-3 bg-slate-900/60 rounded-md w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state rendering
  if (videos.length === 0) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center border border-dashed border-slate-900 rounded-3xl bg-slate-950/20">
        <Film className="w-12 h-12 text-slate-700 stroke-1 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-400">Aucune vidéo trouvée</h3>
        <p className="text-sm text-slate-500 mt-1">Essayez de modifier vos critères de recherche ou de tags.</p>
      </div>
    );
  }

  return (
    <div
      className={isDesktop ? 'grid gap-6' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'}
      style={isDesktop ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
    >
      {videos.map((video) => (
        <VideoCard
          key={video.key}
          video={video}
          onClick={() => onVideoSelect(video)}
        />
      ))}
    </div>
  );
}
