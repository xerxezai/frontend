import React from "react";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";

interface PageErrorBoundaryProps {
  children: React.ReactNode;
}

const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ErrorBoundary
      fallback={({ error }) => (
        <div className="page-error-wrapper">
          <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
            <div className="page-error-card p-5 text-center">
              {/* Page Error Icon */}
              <div className="page-error-icon">💥</div>

              {/* Status Badge */}
              <div className="status-badge">PAGE ERROR</div>

              {/* Error Title */}
              <h1 className="mb-3 fw-bold text-dark">Page Error</h1>

              {/* Error Description */}
              <p className="text-muted mb-3 lead">
                We encountered an error while loading this page.
              </p>

              {/* Error Message Display */}
              {error.message && (
                <div className="error-message mb-4">
                  <strong>Error:</strong> {error.message}
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <button
                  className="btn btn-enhanced btn-primary-enhanced"
                  onClick={() => window.location.reload()}
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
                  Reload Page
                </button>
                <button
                  className="btn btn-enhanced btn-secondary-enhanced"
                  onClick={() => navigate("/")}
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
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9,22 9,12 15,12 15,22"></polyline>
                  </svg>
                  Go Home
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-4 pt-3 border-top">
                <small className="text-muted">
                  Try reloading the page or return to the homepage to continue
                  browsing.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
