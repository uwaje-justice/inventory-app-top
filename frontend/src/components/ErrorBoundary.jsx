import { Component } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Catches JavaScript errors anywhere in the child component tree, logs them,
 * and displays a fallback UI instead of crashing the entire app.
 *
 * This is critical for production because:
 * - If a lazy-loaded chunk fails to load (network error), React throws and
 *   the entire app would show a blank white screen with no recovery path.
 * - If any component throws during render, the same blank screen happens.
 * - This component catches both cases and gives the user a way to retry.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, or Datadog instead of just logging.
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    // Force a full page reload to reset all component state.
    // A softer approach would be to use React's key prop to remount
    // the children, but a reload is simpler and more reliable here.
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-surface-container-low to-background px-5 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-error/10">
            <AlertCircle size={40} className="text-error" aria-hidden="true" />
          </div>
          <h1 className="mb-2 font-heading text-2xl font-bold text-on-surface">
            Something went wrong
          </h1>
          <p className="mb-8 max-w-sm text-sm text-on-surface-variant">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
