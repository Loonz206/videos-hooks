import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    const { fallback } = props;

    if (fallback === undefined) {
      console.warn("ErrorBoundary fallback not set!");
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const message = `Unable to render: ${error.message} ${errorInfo.componentStack}`;
    console.error(message);
  }

  render(): ReactNode {
    const { hasError } = this.state;
    const { children = null, fallback = null } = this.props;

    if (hasError) {
      return fallback;
    }
    return children;
  }
}

export default ErrorBoundary;
