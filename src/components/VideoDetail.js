import React, { useContext } from "react";
import PropTypes from "prop-types";
import { SearchContext } from "./App";

const VideoDetail = ({ video }) => {
  // literally testing grabbing context that was at the App level
  const value = useContext(SearchContext);
  console.log("VALUE", value);
  if (!video) {
    return <div>Loading....</div>;
  }
  const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;
  return (
    <div>
      <div className="ui embed">
        <iframe title="video player" src={videoSrc} frameBorder="0"></iframe>
      </div>
      <div className="ui segment">
        <h4>{video.snippet.title}</h4>
        <p>{video.snippet.description}</p>
      </div>
    </div>
  );
};

VideoDetail.propTypes = {
  video: PropTypes.shape(),
};

export default VideoDetail;
