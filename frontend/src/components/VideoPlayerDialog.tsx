import { useEffect, useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { Video } from '../hooks/useFetchVideos';

interface VideoPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: Video | null;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isLoadingPrev: boolean;
  isLoadingNext: boolean;
  onDeleteVideo: (key: string) => Promise<boolean>;
  onSaveProgress: (key: string, currentTime: number, duration: number) => void;
  onClearProgress: (key: string) => void;
  progress?: { currentTime: number; duration: number; updatedAt: number };
}

export function VideoPlayerDialog({
  open,
  onOpenChange,
  video,
  onNavigatePrev,
  onNavigateNext,
  hasPrev,
  hasNext,
  isLoadingPrev,
  isLoadingNext,
  onDeleteVideo,
  onSaveProgress,
  onClearProgress,
  progress,
}: VideoPlayerDialogProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Keyboard navigation interception
  useEffect(() => {
    if (!open || isConfirmOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (hasPrev && !isLoadingPrev) {
          onNavigatePrev();
        }
      } else if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        if (hasNext && !isLoadingNext) {
          onNavigateNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isConfirmOpen, hasPrev, hasNext, isLoadingPrev, isLoadingNext, onNavigatePrev, onNavigateNext]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastSaveTimeRef = useRef<number>(0);
  const activeVideoKeyRef = useRef<string | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (video) {
      activeVideoKeyRef.current = video.key;
    }
  }, [video]);

  useEffect(() => {
    if (videoRef.current) {
      activeVideoRef.current = videoRef.current;
    }
  });

  useEffect(() => {
    return () => {
      const key = activeVideoKeyRef.current;
      const videoEl = activeVideoRef.current;
      if (key && videoEl) {
        const currentTime = videoEl.currentTime;
        const duration = videoEl.duration;
        if (duration && !isNaN(duration)) {
          const percent = currentTime / duration;
          if (percent < 0.95) {
            onSaveProgress(key, currentTime, duration);
          } else {
            onClearProgress(key);
          }
        }
      }
    };
  }, [video?.key, onSaveProgress, onClearProgress]);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const videoEl = e.currentTarget;
    if (progress && progress.duration) {
      const percent = progress.currentTime / progress.duration;
      if (percent < 0.95) {
        videoEl.currentTime = progress.currentTime;
      } else {
        videoEl.currentTime = 0;
      }
    } else {
      videoEl.currentTime = 0;
    }
    lastSaveTimeRef.current = Date.now();
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!video) return;
    const videoEl = e.currentTarget;
    const currentTime = videoEl.currentTime;
    const duration = videoEl.duration;
    if (!duration || isNaN(duration)) return;

    const percent = currentTime / duration;
    if (percent >= 0.95) {
      onClearProgress(video.key);
      return;
    }

    const now = Date.now();
    if (now - lastSaveTimeRef.current >= 5000) {
      onSaveProgress(video.key, currentTime, duration);
      lastSaveTimeRef.current = now;
    }
  };

  const handlePause = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!video) return;
    const videoEl = e.currentTarget;
    const currentTime = videoEl.currentTime;
    const duration = videoEl.duration;
    if (!duration || isNaN(duration)) return;

    const percent = currentTime / duration;
    if (percent < 0.95) {
      onSaveProgress(video.key, currentTime, duration);
    } else {
      onClearProgress(video.key);
    }
  };

  const handleEnded = () => {
    if (!video) return;
    onClearProgress(video.key);
  };

  if (!video) return null;

  const fileName = video.key.split('/').pop() || video.key;

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const success = await onDeleteVideo(video.key);
    setIsDeleting(false);
    setIsConfirmOpen(false);
    if (success) {
      // If deleted, the caller should automatically advance/close from useFetchVideos state update
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          {/* Deep dark blur glass overlay */}
          <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 animate-fade-in" />
          
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl z-40 w-[95vw] max-w-5xl focus:outline-none animate-content-show">
            
            {/* Header: Title & Actions */}
            <div className="flex justify-between items-center mb-4 gap-4">
              <Dialog.Title className="text-lg font-bold text-slate-100 truncate flex-1" title={fileName}>
                {fileName}
              </Dialog.Title>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Delete Trigger */}
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="p-2 bg-slate-900/60 border border-slate-900 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer select-none"
                  title="Supprimer la vidéo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Close Button */}
                <Dialog.Close className="p-2 bg-slate-900/60 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer select-none">
                  <X className="w-4 h-4" />
                </Dialog.Close>
              </div>
            </div>

            {/* Video Player & Clickable Lateral Navigation Zones Container */}
            <div className="relative w-full aspect-video bg-black/40 border border-slate-900/80 rounded-2xl overflow-hidden flex items-center justify-center">
              
              {/* Native Video Player */}
              <video
                ref={videoRef}
                key={video.key} // Force re-render on video change to refresh stream
                src={video.streamUrl}
                controls
                autoPlay
                className="w-full h-full max-h-[70vh] rounded-xl z-10"
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPause={handlePause}
                onEnded={handleEnded}
              />

              {/* LATERAL NAVIGATION ZONES */}
              
              {/* Left Zone */}
              {hasPrev && (
                <button
                  onClick={onNavigatePrev}
                  disabled={isLoadingPrev}
                  className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-black/40 via-black/10 to-transparent hover:from-black/60 hover:via-black/20 text-white flex items-center justify-center opacity-0 hover:opacity-100 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 z-20 cursor-pointer"
                  title="Vidéo précédente"
                >
                  {isLoadingPrev ? (
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  ) : (
                    <ChevronLeft className="w-8 h-8 filter drop-shadow-(0_0_4px_rgba(0,0,0,0.6))" />
                  )}
                </button>
              )}

              {/* Right Zone */}
              {hasNext && (
                <button
                  onClick={onNavigateNext}
                  disabled={isLoadingNext}
                  className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-black/40 via-black/10 to-transparent hover:from-black/60 hover:via-black/20 text-white flex items-center justify-center opacity-0 hover:opacity-100 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 z-20 cursor-pointer"
                  title="Vidéo suivante"
                >
                  {isLoadingNext ? (
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  ) : (
                    <ChevronRight className="w-8 h-8 filter drop-shadow-(0_0_4px_rgba(0,0,0,0.6))" />
                  )}
                </button>
              )}
            </div>

            {/* Hint / Metadata caption bar */}
            <div className="mt-4 flex justify-between items-center text-[11px] font-medium text-slate-500">
              <span>Utilisez <kbd className="px-1 py-0.5 bg-slate-900 border border-slate-800 rounded">Ctrl + ←</kbd> et <kbd className="px-1 py-0.5 bg-slate-900 border border-slate-800 rounded">Ctrl + →</kbd> pour naviguer entre les vidéos.</span>
              <span>Chemin S3: {video.key}</span>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* NESTED DELETION CONFIRMATION DIALOG */}
      <Dialog.Root open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <Dialog.Portal>
          {/* Deep dark blur glass overlay specifically for confirmation */}
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl z-50 w-[90vw] max-w-md focus:outline-none animate-content-show">
            <Dialog.Title className="text-lg font-bold text-red-400 mb-2">
              Confirmer la suppression
            </Dialog.Title>
            <Dialog.Description className="text-sm text-slate-300 leading-relaxed mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement la vidéo <span className="font-semibold text-slate-100 break-all">"{fileName}"</span> de votre bucket AWS S3 ? Cette action est irréversible.
            </Dialog.Description>
            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={isDeleting}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-medium rounded-xl transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </Dialog.Close>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 border border-red-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-600/10 hover:shadow-red-600/20 transition-all cursor-pointer flex items-center gap-1.5 select-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <span>Confirmer</span>
                )}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
