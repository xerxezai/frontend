import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Enhanced Navigation Component
 * Includes documentation link with soft-coded configuration
 */

interface EnhancedNavProps {
  className?: string;
  showDocsLink?: boolean;
}

const EnhancedNav: React.FC<EnhancedNavProps> = ({ 
  className = "",
  showDocsLink = true 
}) => {
  return (
    <ul className={className}>
      {showDocsLink && (
        <li>
          <Link 
            to="/documentation"
            className="nav-link text-white hover:text-blue-200 transition-colors duration-200"
            title="View Documentation"
          >
            <span className="flex items-center gap-2">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Documentation
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
};

/**
 * Documentation Quick Access Component
 * Provides floating access to documentation
 */
export const DocsQuickAccess: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    // Show after 3 seconds, can be configured
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        to="/documentation"
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        title="View Documentation"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="text-sm font-medium">Docs</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="ml-2 text-blue-200 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Link>
    </div>
  );
};

export default EnhancedNav;