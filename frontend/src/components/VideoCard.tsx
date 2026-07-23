import { Film } from 'lucide-react';
import type { Video } from '../hooks/useFetchVideos';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  progress?: { currentTime: number; duration: number; updatedAt: number };
}

export function VideoCard({ video, onClick, progress }: VideoCardProps) {
  // Extract filename from the key
  const fileName = video.key.split('/').pop() || video.key;

  // Format size in MB
  const sizeInMB = (video.size / (1024 * 1024)).toFixed(2);

  // Format date
  const formattedDate = new Date(video.lastModified).toLocaleDateString();

  const percent = progress && progress.duration ? (progress.currentTime / progress.duration) * 100 : 0;
  const showProgress = progress && percent < 95;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between h-48 p-4 bg-slate-900/40 border border-slate-900 hover:border-indigo-500/50 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] select-none"
    >
      {/* Decorative top glass bar */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent group-hover:via-indigo-500/30 transition-all duration-300" />

      {/* Video Icon representation / Simulated Thumbnail area */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-slate-950 border border-slate-900 group-hover:border-indigo-500/20 group-hover:text-indigo-400 rounded-xl text-slate-500 shadow-inner transition-colors duration-300">
          <Film className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="block text-sm font-semibold text-slate-200 group-hover:text-indigo-300 truncate transition-colors duration-200"
            title={fileName}
          >
            {fileName}
          </span>
          <span className="block text-xs text-slate-500 truncate mt-0.5">
            {video.key}
          </span>
        </div>
      </div>

      {/* Glowing Emerald Progress Bar */}
      {showProgress && (
        <div className="w-full h-1.5 bg-slate-950/60 rounded-full overflow-hidden mt-2 shadow-inner">
          <div
            className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981] rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* Metadata section aligned at bottom */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-900/60 mt-4 text-xs font-semibold text-slate-500 group-hover:text-slate-400 transition-colors">
        <span>{sizeInMB} MB</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
