interface AppErrorScreenProps {
  error?: Error | null;
  errorId?: string;
  onRetry?: () => void;
}

const AppErrorScreen = ({ error, errorId, onRetry }: AppErrorScreenProps) => {
  return (
    <div className="error-screen" role="alert" aria-live="assertive">
      <div className="error-screen__card">
        <p className="error-screen__eyebrow">Application error</p>
        <h1>We could not load this app.</h1>
        <p className="error-screen__message">
          Something unexpected happened while the app was booting. Please try
          again or refresh the page.
        </p>

        {errorId ? (
          <p className="error-screen__meta">Reference ID: {errorId}</p>
        ) : null}

        {error ? (
          <pre className="error-screen__details">{error.message}</pre>
        ) : null}

        <button
          type="button"
          className="error-screen__button"
          onClick={onRetry ?? (() => window.location.reload())}
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default AppErrorScreen;
