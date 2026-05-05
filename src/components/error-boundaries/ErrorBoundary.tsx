import type { ErrorInfo, ReactNode } from "react";
import React from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Example of logging to an external service (uncomment and replace with actual service)
    // logErrorToService(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback: CustomFallback } = this.props;

      // If a custom fallback component is provided, render it
      if (CustomFallback) {
        return <CustomFallback error={this.state.error as Error} />;
      }

      // Enhanced default fallback UI
      return (
        <div className="error-boundary-wrapper">
          <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
            <div className="error-card p-5 text-center">
              {/* Error Icon */}
              <div className="error-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="red"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>

              {/* Status Badge */}
              <div className="status-badge">APPLICATION ERROR</div>

              {/* Error Title */}
              <h2 className="mb-3 fw-bold text-dark">
                Oops! Something went wrong
              </h2>

              {/* Error Description */}
              <p className="text-muted mb-4 lead">
                We encountered an unexpected error while loading this page.
                Don't worry, our team has been notified and we're working on a
                fix.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-4">
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-enhanced btn-primary-enhanced"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="me-2"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M3 21v-5h5"></path>
                  </svg>
                  Refresh Page
                </button>
                <button
                  onClick={() =>
                    this.setState({
                      hasError: false,
                      error: null,
                      errorInfo: null,
                    })
                  }
                  className="btn btn-enhanced btn-secondary-enhanced"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="me-2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  Try Again
                </button>
              </div>

              {/* Error Details Section */}
              {this.props.showDetails && this.state.error && (
                <div className="error-details text-start">
                  <details>
                    <summary>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="me-2"
                      >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                      </svg>
                      Technical Details
                    </summary>

                    <div className="mt-3">
                      <strong className="d-block mb-2">Error Message:</strong>
                      <div className="error-code">
                        {this.state.error.toString()}
                      </div>

                      {this.state.errorInfo && (
                        <>
                          <strong className="d-block mb-2 mt-3">
                            Component Stack:
                          </strong>
                          <div className="error-code">
                            {this.state.errorInfo.componentStack}
                          </div>
                        </>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Help Text */}
              <div className="mt-4 pt-3 border-top">
                <small className="text-muted">
                  If this problem persists, please contact our support team with
                  the error details above.
                </small>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
