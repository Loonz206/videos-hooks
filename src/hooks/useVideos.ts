import { useState, useEffect } from "react";
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

interface YoutubeResponse {
  items: Video[];
}

type UseVideosReturn = [Video[], (term: string) => Promise<void>];

const useVideos = (defaultSearchTerm: string): UseVideosReturn => {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    // Check cache before making a network call
    const cache = getSessionCache();
    const cachedItem = cache?.data?.[defaultSearchTerm];
    if (
      cachedItem &&
      Array.isArray(cachedItem.value) &&
      cachedItem.value.length > 0
    ) {
      setVideos(cachedItem.value);
    } else {
      search(defaultSearchTerm);
    }
  }, [defaultSearchTerm]);

  const search = async (term: string): Promise<void> => {
    if (!term) {
      console.error("An error occurred: no term was passed");
      return;
    }
    try {
      const response = await youtube.get<YoutubeResponse>("/search", {
        params: {
          q: term,
        },
      });
      if (response.status === 200) {
        const { data } = response;
        setVideos(data.items);
        setDataToCache(term, data.items);
      } else {
        console.error(
          "An error has occurred:",
          response.status,
          window.location.href,
        );
      }
    } catch (error) {
      console.error("An error has occurred", error);
    }
  };
  return [videos, search];
};

export default useVideos;
