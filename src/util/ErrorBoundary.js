import { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    const { fallback } = props;
    if (fallback === undefined) {
      console.warn("ErrorBoundary fallback not set!");
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    if (error) {
      return { hasError: true };
    }
  }

  componentDidCatch(error, errorInfo) {
    const message = `Unable to render: ${error} ${errorInfo}`;
    console.error(message);
  }

  render() {
    const { hasError } = this.state;
    const { children = null, fallback = null } = this.props;
    if (hasError) {
      return fallback;
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  fallback: PropTypes.string,
  children: PropTypes.element,
};

export default ErrorBoundary;
