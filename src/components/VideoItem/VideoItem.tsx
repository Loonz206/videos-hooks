import './VideoItem.css';

const VideoItem = ({
  video,
  onVideoSelect,
}: {
  video: any;
  onVideoSelect: (video: any) => void;
}) => {
  if (!video) return null;

  const handleSelect = () => {
    onVideoSelect(video);
  };

  return (
    <button type="button" className="item video-item" onClick={handleSelect}>
      <img
        className="ui image"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.description}
      />
      <div className="content">
        <div className="header" />
        {video.snippet.title}
      </div>
    </button>
  );
};

export default VideoItem;
