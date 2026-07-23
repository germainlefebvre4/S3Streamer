import { useState, useEffect, useCallback } from 'react';

export interface Video {
  key: string;
  size: number;
  lastModified: string;
  streamUrl: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalPages: number;
  totalVideos: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Tag {
  word: string;
  count: number;
}

interface UseFetchVideosProps {
  page: number;
  pageSize: number;
  search: string;
  shuffle: boolean;
}

export function useFetchVideos({ page, pageSize, search, shuffle }: UseFetchVideosProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) {
        params.set('search', search);
      }
      if (shuffle) {
        params.set('shuffle', 'true');
      }

      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideos(data.videos || []);
      setPagination(data.pagination || null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching videos');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, shuffle]);

  const fetchTags = useCallback(async () => {
    setTagsLoading(true);
    try {
      const response = await fetch('/api/videos/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
    } finally {
      setTagsLoading(false);
    }
  }, []);

  const deleteVideo = useCallback(async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/videos/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete video');
      }
      const data = await response.json();
      if (data.success) {
        // Optimistically remove from local state
        setVideos((prev) => prev.filter((v) => v.key !== key));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting video:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    videos,
    pagination,
    tags,
    loading,
    tagsLoading,
    error,
    refetchVideos: fetchVideos,
    refetchTags: fetchTags,
    deleteVideo,
  };
}
