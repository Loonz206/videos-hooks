import React from "react";
import PropTypes from "prop-types";
import "./VideoItem.css";

const VideoItem = ({ video, onVideoSelect }) => {
  if (!video) return null;
  return (
    <div className="item video-item" onClick={() => onVideoSelect(video)}>
      <img
        className="ui image"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.description}
      />
      <div className="content">
        <div className="header" />
        {video.snippet.title}
      </div>
    </div>
  );
};

VideoItem.propTypes = {
  video: PropTypes.shape({
    snippet: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      thumbnails: PropTypes.shape({
        medium: PropTypes.shape({
          url: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }),
  onVideoSelect: PropTypes.func.isRequired,
};

export default VideoItem;
