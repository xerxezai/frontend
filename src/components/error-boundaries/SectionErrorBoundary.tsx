import React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName: string;
}

const SectionErrorBoundary: React.FC<SectionErrorBoundaryProps> = ({
  children,
  sectionName,
}) => (
  <ErrorBoundary
    fallback={({ error }) => (
      <div className="section-error-wrapper">
        <div className="section-error-card">
          {/* Section Error Icon */}
          <div className="section-error-icon">⚠️</div>

          {/* Status Badge */}
          <div className="section-status-badge">Section Error</div>

          {/* Section Title */}
          <h3 className="section-error-title">{sectionName} Unavailable</h3>

          {/* Error Description */}
          <p className="section-error-description">
            This section is temporarily unavailable. The content could not be
            loaded due to an unexpected error.
          </p>

          {/* Error Message Display */}
          {error.message && (
            <div className="section-error-message">
              <strong>Error Details:</strong> {error.message}
            </div>
          )}

          {/* Footer */}
          <div className="section-error-footer">
            <small>
              Please try refreshing the page or contact support if the problem
              persists.
            </small>
          </div>
        </div>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);

export default SectionErrorBoundary;
