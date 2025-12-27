import { useQuery, useQueryClient } from "@tanstack/react-query";
import youtube from "../api/youtube";
import { getSessionCache, setDataToCache } from "../util/sessionCache";

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

interface CacheData {
  [key: string]: {
    value: Video[];
    timestamp: number;
  };
}

interface YoutubeResponse {
  items: Video[];
}

type UseVideosReturn = [Video[], (term: string) => Promise<void>];

const fetchVideos = async (term: string): Promise<Video[]> => {
  if (!term) {
    throw new Error("No search term provided");
  }

  const cache = getSessionCache();
  const cachedItem = cache?.data?.[term];

  if (cachedItem?.value && Array.isArray(cachedItem.value)) {
    return cachedItem.value;
  }

  const response = await youtube.get<YoutubeResponse>("/search", {
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
  const queryClient = useQueryClient();

  const { data: videos = [], refetch } = useQuery({
    queryKey: ["videos", defaultSearchTerm],
    queryFn: () => fetchVideos(defaultSearchTerm),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 1,
  });

  const search = async (term: string): Promise<void> => {
    // Invalidate the current query and fetch with new term
    await queryClient.invalidateQueries({ queryKey: ["videos"] });
    // Prefetch the new term
    await queryClient.prefetchQuery({
      queryKey: ["videos", term],
      queryFn: () => fetchVideos(term),
    });
    // Trigger a refetch with the new term
    await refetch();
  };

  return [videos, search];
};

export default useVideos;
