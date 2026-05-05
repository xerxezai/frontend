/**
 * Documentation Build Script
 * Handles building and optimizing documentation for production
 * Uses soft coding approach for flexible configuration
 */

import fs from 'fs';
import path from 'path';
import config from '../frontend.config.js';

class DocsBuildManager {
  constructor() {
    this.config = config;
    this.sourcePath = path.resolve(this.config.paths.docs.src);
    this.targetPath = path.resolve(this.config.paths.docs.build);
  }

  /**
   * Copy documentation files to build directory
   */
  async copyFiles() {
    try {
      console.log('📄 Copying documentation files...');
      
      // Ensure target directory exists
      if (!fs.existsSync(this.targetPath)) {
        fs.mkdirSync(this.targetPath, { recursive: true });
      }

      // Copy all files from docs source to build
      await this.copyDirectory(this.sourcePath, this.targetPath);
      
      console.log('✅ Documentation files copied successfully');
    } catch (error) {
      console.error('❌ Error copying documentation files:', error);
      process.exit(1);
    }
  }

  /**
   * Recursively copy directory
   */
  async copyDirectory(source, target) {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
    }

    const files = fs.readdirSync(source);

    for (const file of files) {
      const sourcePath = path.join(source, file);
      const targetPath = path.join(target, file);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath);
      } else {
        fs.copyFileSync(sourcePath, targetPath);
      }
    }
  }

  /**
   * Update documentation paths for production
   */
  updatePaths() {
    console.log('🔧 Updating documentation paths for production...');
    
    const indexPath = path.join(this.targetPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8');
      
      // Update relative paths to work in production
      content = content.replace(/href="css\//g, 'href="./css/');
      content = content.replace(/src="js\//g, 'src="./js/');
      content = content.replace(/src="img\//g, 'src="./img/');
      
      // Update page title
      content = content.replace(
        /<title>.*<\/title>/,
        `<title>${this.config.integration.docs.title}</title>`
      );
      
      // Update meta description
      content = content.replace(
        /<meta name="description" content=".*"\/>/,
        `<meta name="description" content="${this.config.integration.docs.description}"/>`
      );
      
      fs.writeFileSync(indexPath, content);
      console.log('✅ Documentation paths updated');
    }
  }

  /**
   * Generate sitemap for documentation
   */
  generateSitemap() {
    if (!this.config.build.docs.generateSitemap) return;
    
    console.log('🗺️ Generating sitemap...');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${this.config.production.baseUrl}docs/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    fs.writeFileSync(path.join(this.targetPath, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated');
  }

  /**
   * Main build process
   */
  async build() {
    console.log('🚀 Building documentation...');
    console.log(`Source: ${this.sourcePath}`);
    console.log(`Target: ${this.targetPath}`);
    
    await this.copyFiles();
    this.updatePaths();
    this.generateSitemap();
    
    console.log('🎉 Documentation build completed successfully!');
  }
}

// Run the build process
const builder = new DocsBuildManager();
builder.build().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});