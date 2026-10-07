import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import youtube from '../api/youtube';
import { getSessionCache, setDataToCache } from '../util/sessionCache';

interface Video {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
  };
}

interface YoutubeResponse {
  items: Video[];
}

type UseVideosReturn = [Video[], (term: string) => Promise<void>];

const fetchVideos = async (term: string): Promise<Video[]> => {
  if (!term) {
    throw new Error('No search term provided');
  }

  const cache = getSessionCache();
  const cachedItem = cache?.data?.[term];

  if (cachedItem?.value && Array.isArray(cachedItem.value)) {
    return cachedItem.value;
  }

  const response = await youtube.get<YoutubeResponse>('/search', {
    params: { q: term },
  });

  if (response.status !== 200) {
    throw new Error(`API Error: ${response.status}`);
  }

  const videos = response.data.items;
  setDataToCache(term, videos);
  return videos;
};

const useVideos = (defaultSearchTerm: string): UseVideosReturn => {
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);

  const { data: videos = [] } = useQuery({
    queryKey: ['videos', searchTerm],
    queryFn: () => fetchVideos(searchTerm),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 1,
  });

  const search = async (term: string): Promise<void> => {
    const normalizedTerm = term.trim();

    if (!normalizedTerm) {
      return;
    }

    setSearchTerm(normalizedTerm);
  };

  return [videos, search];
};

export default useVideos;
