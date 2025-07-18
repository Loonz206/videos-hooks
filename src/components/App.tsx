import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar.tsx";
import VideoDetail from "./VideoDetail/VideoDetail.tsx";
import VideoList from "./VideoList/VideoList.tsx";
import useVideos from "../hooks/useVideos.ts";
import { setDataToCache } from "../util/sessionCache.ts";

export const SearchContext = React.createContext("");

const App = () => {
  // Always call hooks at the top level
  const [selectedVideo, setSelectedVideo] = useState("");
  const [videos, search] = useVideos("bacon cheeseburgers");

  useEffect(() => {
    if (videos.length > 0) {
      setSelectedVideo(videos[0]);
    }
  }, [videos]);

  useEffect(() => {
    setDataToCache(selectedVideo, "selectedVideo");
  }, [selectedVideo]);

  return (
    <SearchContext.Provider value={selectedVideo}>
      <div className="ui container">
        <SearchBar onFormSubmit={search} />
        <div className="ui grid">
          <div className="ui row">
            <div className="eleven wide column">
              <VideoDetail video={selectedVideo} />
            </div>
            <div className="five wide column">
              <VideoList onVideoSelect={setSelectedVideo} videos={videos} />
            </div>
          </div>
        </div>
      </div>
    </SearchContext.Provider>
  );
};

export default App;
