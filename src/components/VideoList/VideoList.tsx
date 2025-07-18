import VideoItem from "../VideoItem/VideoItem.tsx";

const VideoList = ({
  videos,
  onVideoSelect,
}: {
  videos: any[];
  onVideoSelect: (video: any) => void;
}) => {
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

export default VideoList;
