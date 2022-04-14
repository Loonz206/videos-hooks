import React from "react";
import PropTypes from "prop-types";
import VideoItem from "../components/VideoItem";

const VideoList = ({ videos, onVideoSelect }) => {
  const renderedList = videos.map((video) => {
    return (
      <VideoItem
        key={video.id.videoId}
        video={video}
        onVideoSelect={onVideoSelect}
      />
    );
  });
  return <div className="ui relaxed divided list">{renderedList}</div>;
};

VideoList.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.shape()),
  onVideoSelect: PropTypes.func,
};

export default VideoList;
