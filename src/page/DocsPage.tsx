import React from 'react';

/**
 * Documentation Route Component
 * Handles routing and loading of documentation within the React app
 * Uses soft coding approach for flexible configuration
 */

interface DocsPageProps {
  title?: string;
  description?: string;
}

const DocsPage: React.FC<DocsPageProps> = ({ 
  title = "XERXEZ Documentation",
  description = "Technical documentation for XERXEZ platform"
}) => {
  // Dynamically load documentation content
  const documentationUrl = "/docs/index.html";
  
  const handleDocumentationLoad = () => {
    // Redirect to documentation in same tab
    window.location.href = documentationUrl;
  };

  return (
    <div className="docs-wrapper min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-lg text-gray-600 mb-6">{description}</p>
              
              <div className="space-y-4">
                <button
                  onClick={handleDocumentationLoad}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Documentation
                </button>
                
                <div className="mt-4">
                  <a 
                    href={documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open in New Tab
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Getting Started</h3>
                  <p className="text-sm text-gray-600">Learn how to set up and customize the template</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Components</h3>
                  <p className="text-sm text-gray-600">Explore all available React components</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Customization</h3>
                  <p className="text-sm text-gray-600">Guide to styling and theming</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Deployment</h3>
                  <p className="text-sm text-gray-600">Instructions for production deployment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
