interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
  };
}

const VideoDetail = ({ video }: { video: Video | null }) => {
  if (!video) {
    return <div>Loading....</div>;
  }
  const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;
  return (
    <div>
      <div className="ui embed video-detail__embed">
        <iframe
          title="video player"
          src={videoSrc}
          loading="lazy"
          style={{ border: 0 }}
        />
      </div>
      <div className="ui segment">
        <h4>{video.snippet.title}</h4>
        <p>{video.snippet.description}</p>
      </div>
    </div>
  );
};

export default VideoDetail;
