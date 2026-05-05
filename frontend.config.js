/**
 * Frontend Configuration
 * Central configuration for managing both React app and documentation
 * Using soft coding approach for maximum flexibility
 */

const config = {
  // Project metadata
  project: {
    name: "SEOZ Frontend",
    description: "Unified frontend containing React app and documentation",
    version: "1.0.0"
  },

  // Paths configuration (soft coded for easy maintenance)
  paths: {
    // React app paths
    app: {
      src: "./src",
      public: "./public",
      assets: "./public/assets",
      components: "./src/components",
      pages: "./src/page",
      styles: "./src/styles",
      build: "./dist"
    },
    // Documentation paths
    docs: {
      src: "./public/docs",
      assets: "./public/docs/img",
      css: "./public/docs/css",
      js: "./public/docs/js",
      build: "./dist/docs"
    }
  },

  // Build configuration
  build: {
    // React app build settings
    app: {
      outDir: "dist",
      sourcemap: true,
      minify: true,
      target: "es2020"
    },
    // Documentation build settings
    docs: {
      copyFiles: true,
      optimize: true,
      generateSitemap: true
    }
  },

  // Development settings
  dev: {
    port: 5173,
    host: "localhost",
    openBrowser: false,
    // Routes configuration
    routes: {
      app: "/",
      docs: "/docs"
    }
  },

  // Production settings
  production: {
    // Base URL for deployment
    baseUrl: "/",
    // CDN configuration
    cdn: {
      enabled: false,
      url: ""
    },
    // Asset optimization
    assets: {
      compression: true,
      caching: true
    }
  },

  // Integration settings
  integration: {
    // Documentation integration
    docs: {
      enabled: true,
      route: "/docs",
      title: "SEOZ Documentation",
      description: "Complete documentation for SEOZ React Template"
    },
    // Analytics (placeholder for future integration)
    analytics: {
      enabled: false,
      provider: "",
      trackingId: ""
    }
  }
};

export default config;