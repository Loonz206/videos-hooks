import { useState, useEffect } from "react";
import youtube from "../api/youtube";

const useVideos = (defaultSearchTerm) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    search(defaultSearchTerm);
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
      } else {
        console.error(
          `An error has occurred:`,
          response.status,
          window.location.href
        );
      }
    } catch (error) {
      console.error("An error has occurred", error);
    }
  };
  return [videos, search];
};

export default useVideos;
