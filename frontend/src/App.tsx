import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { VideoGrid } from './components/VideoGrid';
import { Pagination } from './components/Pagination';
import { TagPanel } from './components/TagPanel';
import { VideoPlayerDialog } from './components/VideoPlayerDialog';
import { GridConfigModal } from './components/GridConfigModal';
import { useFetchVideos } from './hooks/useFetchVideos';
import type { Video } from './hooks/useFetchVideos';
import { useGridConfig } from './hooks/useGridConfig';
import { AlertCircle } from 'lucide-react';

export default function App() {
  // 1. Grid Configuration Hook
  const [config, setConfig] = useGridConfig();

  // 2. Query/Page States (with URL search sync)
  const [search, setSearch] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });
  
  const [page, setPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('page') || '1', 10) || 1;
  });

  const [shuffle, setShuffle] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // 3. UI Dialog States
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [pendingVideoSelect, setPendingVideoSelect] = useState<'first' | 'last' | null>(null);

  // 4. Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search query
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync state with URL search params (excludes default/temporary states like shuffle)
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) {
      params.set('page', page.toString());
    }
    if (search) {
      params.set('search', search);
    }
    const relativePath = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState(null, '', relativePath);
  }, [page, search]);

  // 5. API Fetch Hook
  const {
    videos,
    pagination,
    tags,
    loading,
    tagsLoading,
    error,
    refetchVideos,
    deleteVideo,
  } = useFetchVideos({
    page,
    pageSize: config.cols * config.rows,
    search: debouncedSearch,
    shuffle,
  });

  // Calculate active index inside the current list of videos
  const activeVideoIndex = activeVideo ? videos.findIndex((v) => v.key === activeVideo.key) : -1;

  // Handle adjacent-page video preloading and selection
  useEffect(() => {
    if (pendingVideoSelect && videos.length > 0 && !loading) {
      if (pendingVideoSelect === 'first') {
        setActiveVideo(videos[0]);
      } else if (pendingVideoSelect === 'last') {
        setActiveVideo(videos[videos.length - 1]);
      }
      setPendingVideoSelect(null);
    }
  }, [videos, pendingVideoSelect, loading]);

  // 6. Navigation Logic (Within page buffer + Page-spanning)
  const handleNavigatePrev = () => {
    if (activeVideoIndex > 0) {
      setActiveVideo(videos[activeVideoIndex - 1]);
    } else if (pagination?.hasPrevPage) {
      setPendingVideoSelect('last');
      setPage((p) => p - 1);
    }
  };

  const handleNavigateNext = () => {
    if (activeVideoIndex < videos.length - 1) {
      setActiveVideo(videos[activeVideoIndex + 1]);
    } else if (pagination?.hasNextPage) {
      setPendingVideoSelect('first');
      setPage((p) => p + 1);
    }
  };

  // Determine prev/next availability
  const hasPrev = activeVideoIndex > 0 || (pagination?.hasPrevPage ?? false);
  const hasNext = activeVideoIndex < videos.length - 1 || (pagination?.hasNextPage ?? false);

  const isLoadingPrev = loading && pendingVideoSelect === 'last';
  const isLoadingNext = loading && pendingVideoSelect === 'first';

  // 7. Video Deletion handler
  const handleDeleteVideo = async (key: string): Promise<boolean> => {
    const index = videos.findIndex((v) => v.key === key);
    const success = await deleteVideo(key);
    
    if (success) {
      const remainingVideos = videos.filter((v) => v.key !== key);
      if (remainingVideos.length === 0) {
        setActiveVideo(null);
      } else if (index < remainingVideos.length) {
        setActiveVideo(remainingVideos[index]);
      } else {
        setActiveVideo(remainingVideos[index - 1]);
      }
    }
    return success;
  };

  // Shuffle toggle handler
  const handleShuffleToggle = () => {
    setShuffle((prev) => {
      const next = !prev;
      setPage(1); // Reset page on shuffle
      return next;
    });
  };

  // Grid Config apply handler
  const handleGridConfigApply = (newConfig: typeof config) => {
    setConfig(newConfig);
    setPage(1); // Reset to page 1 on layout restructure
  };

  // Tag badge click handler
  const handleTagClick = (tag: string) => {
    setSearch(tag);
    setPage(1); // Reset to page 1 on tag select
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* 1. Header Area */}
      <Header />

      {/* 2. Primary Page Content Container with dynamic sizing from config */}
      <main
        className="flex-1 w-full mx-auto px-4 py-8 flex flex-col gap-6"
        style={{ maxWidth: config.width }}
      >
        {/* 2.1 Toolbar (Search + Shuffle + Settings) */}
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          shuffle={shuffle}
          onShuffleToggle={handleShuffleToggle}
          onConfigClick={() => setIsConfigOpen(true)}
        />

        {/* 2.2 Error Display (if any) */}
        {error && (
          <div className="w-full max-w-5xl mx-auto p-4 bg-red-950/20 border border-red-900/40 text-red-400 text-sm font-semibold rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* 2.3 Video Grid list */}
        <div className="flex-1">
          <VideoGrid
            videos={videos}
            cols={config.cols}
            loading={loading && !pendingVideoSelect}
            onVideoSelect={setActiveVideo}
          />
        </div>

        {/* 2.4 Pagination bar */}
        {pagination && (
          <Pagination
            page={page}
            totalPages={pagination.totalPages}
            hasPrevPage={pagination.hasPrevPage}
            hasNextPage={pagination.hasNextPage}
            shuffleMode={shuffle}
            onPageChange={setPage}
            onReroll={refetchVideos}
          />
        )}

        {/* 2.5 Word Cloud Tag Cloud Filter Area */}
        <TagPanel
          tags={tags}
          activeTag={search}
          onTagClick={handleTagClick}
          loading={tagsLoading}
        />
      </main>

      {/* 3. Global Dialog Windows (Radix UI) */}
      
      {/* 3.1 Grid Configuration Modal */}
      <GridConfigModal
        open={isConfigOpen}
        onOpenChange={setIsConfigOpen}
        config={config}
        onApply={handleGridConfigApply}
      />

      {/* 3.2 Immersive Video Player & Navigation Dialog */}
      <VideoPlayerDialog
        open={activeVideo !== null}
        onOpenChange={(open) => !open && setActiveVideo(null)}
        video={activeVideo}
        onNavigatePrev={handleNavigatePrev}
        onNavigateNext={handleNavigateNext}
        hasPrev={hasPrev}
        hasNext={hasNext}
        isLoadingPrev={isLoadingPrev}
        isLoadingNext={isLoadingNext}
        onDeleteVideo={handleDeleteVideo}
      />
    </div>
  );
}
