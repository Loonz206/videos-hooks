const AppLoadingScreen = () => {
  return (
    <div
      className="loading-screen"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loading-screen__spinner" aria-hidden="true" />
      <div className="loading-screen__content">
        <p className="loading-screen__eyebrow">
          Preparing your video experience
        </p>
        <h1>Loading videos…</h1>
        <p>We are setting up the app and fetching the latest content.</p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
