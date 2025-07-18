import "./VideoItem.css";

const VideoItem = ({
  video,
  onVideoSelect,
}: {
  video: any;
  onVideoSelect: (video: any) => void;
}) => {
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

export default VideoItem;
