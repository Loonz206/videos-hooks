import React from "react";
import PropTypes from "prop-types";
import "./VideoItem.css";

const VideoItem = ({ video, onVideoSelect }) => {
  return (
    <div className="item video-item" onClick={() => onVideoSelect(video)}>
      <img
        className="ui image"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.description}
      />
      <div className="content">
        <div className="header"></div>
        {video.snippet.title}
      </div>
    </div>
  );
};

VideoItem.propTypes = {
  video: PropTypes.shape(),
  onVideoSelect: PropTypes.func,
};

export default VideoItem;
