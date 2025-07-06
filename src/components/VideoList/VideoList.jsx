import React from "react";
import PropTypes from "prop-types";
import VideoItem from "../VideoItem/VideoItem.jsx";

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
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.shape({
        videoId: PropTypes.string.isRequired,
      }).isRequired,
      snippet: PropTypes.shape({
        title: PropTypes.string.isRequired,
        thumbnails: PropTypes.shape({
          medium: PropTypes.shape({
            url: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired,
    }),
  ).isRequired,
  onVideoSelect: PropTypes.func.isRequired,
};

export default VideoList;
