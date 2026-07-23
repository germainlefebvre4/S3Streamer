import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { GridConfig } from '../hooks/useGridConfig';

interface GridConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: GridConfig;
  onApply: (newConfig: GridConfig) => void;
}

export function GridConfigModal({
  open,
  onOpenChange,
  config,
  onApply,
}: GridConfigModalProps) {
  const [cols, setCols] = useState(config.cols);
  const [rows, setRows] = useState(config.rows);
  const [width, setWidth] = useState(config.width);

  // Sync local state when the modal opens with the current configuration
  useEffect(() => {
    if (open) {
      setCols(config.cols);
      setRows(config.rows);
      setWidth(config.width);
    }
  }, [open, config]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ cols, rows, width });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 border border-slate-900 rounded-2xl p-6 shadow-2xl z-50 w-[95vw] max-w-md focus:outline-none animate-content-show">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold text-slate-100">
              Configuration de la grille
            </Dialog.Title>
            <Dialog.Close className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleApply} className="space-y-5">
            {/* Columns Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="config-cols" className="text-sm font-semibold text-slate-400">
                Colonnes (1 - 8)
              </label>
              <select
                id="config-cols"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'colonne' : 'colonnes'}
                  </option>
                ))}
              </select>
            </div>

            {/* Rows Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="config-rows" className="text-sm font-semibold text-slate-400">
                Lignes par page (1 - 6)
              </label>
              <select
                id="config-rows"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'ligne' : 'lignes'}
                  </option>
                ))}
              </select>
            </div>

            {/* Width Select */}
            <div className="flex flex-col gap-2">
              <label htmlFor="config-width" className="text-sm font-semibold text-slate-400">
                Largeur maximale de la page
              </label>
              <select
                id="config-width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-sm rounded-xl outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="900px">900px</option>
                <option value="1200px">1200px (Défaut)</option>
                <option value="1400px">1400px</option>
                <option value="1600px">1600px</option>
                <option value="100%">Pleine largeur</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-slate-100 text-sm font-medium rounded-xl transition-colors cursor-pointer select-none"
                >
                  Annuler
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer select-none"
              >
                Appliquer
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
