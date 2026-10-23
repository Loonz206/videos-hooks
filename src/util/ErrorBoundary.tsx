import { Component, type ReactNode } from 'react';
import AppErrorScreen from '../components/AppErrorScreen';
import { logger } from './logger';

interface ErrorBoundaryProps {
  fallback?: ReactNode | ((error: Error | null, errorId: string) => ReactNode);
  children?: ReactNode;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

const createErrorId = () => {
  return `err-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
    };
    const { fallback } = props;

    if (fallback === undefined) {
      logger.warn({
        event: 'ui.error_boundary.fallback_missing',
        message: 'ErrorBoundary fallback not set!',
      });
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorId: createErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error({
      event: 'ui.error_boundary.caught',
      message: 'Unable to render React component tree',
      context: {
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
      },
      error,
    });
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
    });
  };

  render(): ReactNode {
    const { hasError, error, errorId } = this.state;
    const { children = null, fallback, showDetails = false } = this.props;

    if (hasError) {
      if (typeof fallback === 'function') {
        return fallback(error, errorId);
      }

      if (fallback !== undefined) {
        return fallback;
      }

      return (
        <AppErrorScreen
          error={showDetails ? error : null}
          errorId={errorId || 'unknown'}
          onRetry={this.handleRetry}
        />
      );
    }
    return children;
  }
}

export default ErrorBoundary;
