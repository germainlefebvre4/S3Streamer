import { Tag as TagIcon, Hash } from 'lucide-react';
import type { Tag } from '../hooks/useFetchVideos';

interface TagPanelProps {
  tags: Tag[];
  activeTag: string;
  onTagClick: (tag: string) => void;
  loading: boolean;
}

export function TagPanel({ tags, activeTag, onTagClick, loading }: TagPanelProps) {
  // If loading and tags are empty, render a loading state
  if (loading && tags.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 border-t border-slate-900 mt-12 select-none animate-pulse">
        <div className="h-6 bg-slate-900/60 rounded-md w-24 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-8 bg-slate-900/40 rounded-xl w-20" />
          ))}
        </div>
      </div>
    );
  }

  // If there are no tags, do not display the section
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 border-t border-slate-900/60 mt-12 select-none">
      <div className="flex items-center gap-2 mb-5">
        <TagIcon className="w-4 h-4 text-indigo-400" />
        <h2 className="text-base font-bold text-slate-300 tracking-wide uppercase">
          Tags populaires
        </h2>
      </div>

      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {tags.map(({ word, count }) => {
          const isActive = activeTag.toLowerCase() === word.toLowerCase();
          return (
            <button
              key={word}
              onClick={() => onTagClick(isActive ? '' : word)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer
                ${
                  isActive
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                    : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
            >
              <Hash className={`w-3 h-3 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
              <span>{word}</span>
              <span
                className={`text-[10px] font-bold px-1 py-0.2 rounded-md
                  ${isActive ? 'bg-indigo-500/20 text-indigo-400/80' : 'bg-slate-900 text-slate-500 group-hover:text-slate-400'}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
