import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "node:url";

// Import frontend configuration
// @ts-ignore
import frontendConfig from './frontend.config.js';

// ESM equivalent of __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Health check plugin
    {
      name: 'health-check',
      configureServer(server) {
        server.middlewares.use('/health', (req, res, next) => {
          if (req.method === 'GET') {
            const healthStatus = {
              status: 'healthy',
              timestamp: new Date().toISOString(),
              version: process?.env?.npm_package_version || '1.0.0',
              environment: process?.env?.NODE_ENV || 'development',
              uptime: typeof process !== 'undefined' ? process.uptime() : 0,
              memory: typeof process !== 'undefined' ? process.memoryUsage() : { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 },
              frontend: {
                status: 'healthy',
                framework: 'React + Vite',
                mode: server.config.mode,
              }
            };
            
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(healthStatus, null, 2));
          } else {
            next();
          }
        });
      }
    }
  ],
  base: frontendConfig.production.baseUrl,
  
  // Development server configuration
  server: {
    port: frontendConfig.dev.port,
    host: frontendConfig.dev.host,
    open: frontendConfig.dev.openBrowser,
    // Serve documentation files
    proxy: {
      '/docs': {
        target: `http://localhost:${frontendConfig.dev.port}`,
        rewrite: (path) => path.replace(/^\/docs/, '/docs')
      }
    }
  },

  // Build configuration
  build: {
    outDir: frontendConfig.build.app.outDir,
    sourcemap: frontendConfig.build.app.sourcemap,
    minify: frontendConfig.build.app.minify,
    target: frontendConfig.build.app.target,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor:     ['react', 'react-dom', 'react-router-dom'],
          animations: ['gsap', 'split-type', 'aos'],
          ui:         ['swiper'],
          erp:        ['./src/components/erp/ERPDashboard', './src/components/erp/ERPLogin'],
        },
      },
    }
  },

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/page'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@assets': path.resolve(__dirname, './public/assets'),
      '@docs': path.resolve(__dirname, './public/docs'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
    }
  },

  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },

  // Optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
