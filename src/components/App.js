import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar";
import VideoDetail from "./VideoDetail/VideoDetail";
import VideoList from "./VideoList/VideoList";
import useVideos from "../hooks/useVideos";
import { setDataToCache } from "../util/sessionCache";

export const SearchContext = React.createContext("");

const App = () => {
  // Always call hooks at the top level
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, search] = useVideos("bacon cheeseburgers");

  useEffect(() => {
    setSelectedVideo(videos[0]);
    setDataToCache(selectedVideo);
  }, [videos, selectedVideo]);

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
