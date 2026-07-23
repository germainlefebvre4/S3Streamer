import { useState } from 'react';

export interface GridConfig {
  cols: number;
  rows: number;
  width: string;
}

const DEFAULT_CONFIG: GridConfig = {
  cols: 6,
  rows: 3,
  width: '1200px',
};

const LOCAL_STORAGE_KEY = 's3streamer_grid_config';

export function useGridConfig() {
  const [config, setConfig] = useState<GridConfig>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) return DEFAULT_CONFIG;
      const parsed = JSON.parse(stored);
      // Validate structure and ranges
      if (
        typeof parsed.cols === 'number' && parsed.cols >= 1 && parsed.cols <= 8 &&
        typeof parsed.rows === 'number' && parsed.rows >= 1 && parsed.rows <= 6 &&
        typeof parsed.width === 'string'
      ) {
        return parsed as GridConfig;
      }
      return DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const updateConfig = (newConfig: GridConfig) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (err) {
      console.error('Error saving grid config to localStorage:', err);
    }
  };

  return [config, updateConfig] as const;
}
