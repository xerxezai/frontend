/**
 * Error Boundary Component with Soft-Coded Configuration
 * Provides graceful error handling for React components
 */

import React from 'react';

interface ErrorInfo {
  componentStack: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);

    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      prevProps.children !== this.props.children
    ) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="error-boundary" 
          style={{
            padding: '20px',
            margin: '10px',
            border: '1px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#fdf2f2',
            color: '#c53030'
          }}
        >
          <h2 style={{ marginTop: 0, color: '#c53030' }}>
            âš ï¸ Something went wrong
          </h2>
          
          <p>
            We're sorry, but something unexpected happened.
            {import.meta.env.DEV ? ' Please check the console for more details.' : ''}
          </p>
          
          <div style={{ marginTop: '15px' }}>
            <button 
              onClick={this.handleRetry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#c53030',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              ðŸ”„ Try Again
            </button>
            
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#718096',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ðŸ”ƒ Reload Page
            </button>
          </div>
          
          {this.props.showDetails && import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '15px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                ðŸ” Technical Details
              </summary>
              <div style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f7fafc',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <strong>Error:</strong> {this.state.error.message}
                <br /><br />
                <strong>Stack:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {this.state.error.stack}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <br />
                    <strong>Component Stack:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = 
    `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithErrorBoundaryComponent;
}

export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    const enableErrorReporting = import.meta.env.VITE_ENABLE_DEBUG === 'true';
    
    if (import.meta.env.DEV || enableErrorReporting) {
      console.error('Captured error:', error);
    }
    
    setError(error);
  }, []);

  if (error) {
    throw error;
  }

  return { captureError, resetError };
}

export default ErrorBoundary;
