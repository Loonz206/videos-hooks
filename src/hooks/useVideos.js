import { useState, useEffect } from "react";
import youtube from "../api/youtube";
import { getSessionCache, setDataToCache } from "../util/sessionCache";

const useVideos = (defaultSearchTerm) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Check cache before making a network call
    const cache = getSessionCache();
    const cachedItem = cache?.data && cache?.data[defaultSearchTerm];
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

  const search = async (term) => {
    if (!term) {
      console.error("An error occurred: no term was passed");
      return;
    }
    try {
      const response = await youtube.get("/search", {
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
