import { Search, Shuffle, Settings, X } from 'lucide-react';

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  shuffle: boolean;
  onShuffleToggle: () => void;
  onConfigClick: () => void;
}

export function Toolbar({
  search,
  onSearchChange,
  shuffle,
  onShuffleToggle,
  onConfigClick,
}: ToolbarProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/20 border border-slate-900/50 backdrop-blur-md rounded-2xl">
      {/* Search Input Container */}
      <div className="relative w-full sm:max-w-md flex items-center">
        <div className="absolute left-3.5 text-slate-500 pointer-events-none">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher une vidéo…"
          className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-900 hover:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-sm text-slate-100 placeholder-slate-500 rounded-xl outline-none transition-all duration-200"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 p-1 text-slate-500 hover:text-slate-300 rounded-full hover:bg-slate-900 transition-colors"
            title="Effacer la recherche"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Actions Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Shuffle Button */}
        <button
          onClick={onShuffleToggle}
          className={`relative p-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition-all duration-300 cursor-pointer select-none
            ${
              shuffle
                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:bg-indigo-600/20'
                : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
            }`}
          title="Mode aléatoire"
        >
          <Shuffle className={`w-4 h-4 ${shuffle ? 'animate-pulse' : ''}`} />
          <span>Aléatoire</span>
        </button>

        {/* Configuration Button */}
        <button
          onClick={onConfigClick}
          className="p-2.5 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/30 rounded-xl transition-all duration-300 cursor-pointer select-none"
          title="Configuration de la grille"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
