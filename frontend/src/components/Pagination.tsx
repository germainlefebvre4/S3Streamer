import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  shuffleMode: boolean;
  onPageChange: (newPage: number) => void;
  onReroll: () => void;
}

export function Pagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  shuffleMode,
  onPageChange,
  onReroll,
}: PaginationProps) {
  // Build the list of page numbers/ellipses to display
  const getPageNumbers = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const delta = 2;
    const pages = new Set<number>([1, total]);
    for (let i = current - delta; i <= current + delta; i++) {
      if (i >= 1 && i <= total) pages.add(i);
    }
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: (number | string)[] = [];
    let prev: number | null = null;
    for (const p of sorted) {
      if (prev !== null && p - prev > 1) result.push('…');
      result.push(p);
      prev = p;
    }
    return result;
  };

  // If shuffle mode is on, render a "Reroll" button
  if (shuffleMode) {
    return (
      <div className="w-full py-8 flex justify-center">
        <button
          onClick={onReroll}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer select-none"
        >
          <Shuffle className="w-4 h-4" />
          <span>Nouveau tirage</span>
        </button>
      </div>
    );
  }

  // If there's 1 or fewer pages, don't render pagination controls
  if (totalPages <= 1) {
    return null;
  }

  const pageItems = getPageNumbers(page, totalPages);

  return (
    <nav className="w-full py-8 flex justify-center items-center gap-2 select-none">
      {/* Previous Button */}
      <button
        onClick={() => hasPrevPage && onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="p-2 bg-slate-900/60 border border-slate-900 disabled:opacity-30 hover:border-slate-800 hover:text-slate-100 disabled:hover:border-slate-900 disabled:hover:text-slate-400 text-slate-400 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Page précédente"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pageItems.map((item, index) => {
          if (item === '…') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-slate-500 text-sm font-medium"
              >
                …
              </span>
            );
          }

          const isCurrent = item === page;
          return (
            <button
              key={`page-${item}`}
              onClick={() => onPageChange(item as number)}
              className={`w-10 h-10 flex items-center justify-center text-sm font-bold rounded-xl transition-all border cursor-pointer
                ${
                  isCurrent
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => hasNextPage && onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="p-2 bg-slate-900/60 border border-slate-900 disabled:opacity-30 hover:border-slate-800 hover:text-slate-100 disabled:hover:border-slate-900 disabled:hover:text-slate-400 text-slate-400 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
        title="Page suivante"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
