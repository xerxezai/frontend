/**
 * Frontend Migration Utility
 * Helps migrate and maintain the integrated frontend structure
 * Uses soft coding principles for flexibility
 */

const fs = require('fs');
const path = require('path');
const config = require('../frontend.config.js');

class FrontendMigrator {
  constructor() {
    this.config = config;
    this.rootPath = process.cwd();
  }

  /**
   * Verify the current frontend structure
   */
  verifyStructure() {
    console.log('🔍 Verifying frontend structure...');
    
    const requiredPaths = [
      this.config.paths.app.src,
      this.config.paths.app.public,
      this.config.paths.docs.src,
      './scripts',
      './frontend.config.js'
    ];

    const missingPaths = [];

    requiredPaths.forEach(pathToCheck => {
      const fullPath = path.resolve(this.rootPath, pathToCheck);
      if (!fs.existsSync(fullPath)) {
        missingPaths.push(pathToCheck);
      }
    });

    if (missingPaths.length > 0) {
      console.log('❌ Missing required paths:');
      missingPaths.forEach(p => console.log(`   - ${p}`));
      return false;
    }

    console.log('✅ Frontend structure verified successfully');
    return true;
  }

  /**
   * Update documentation paths
   */
  updateDocumentationPaths() {
    console.log('🔧 Updating documentation paths...');
    
    const indexPath = path.join(this.config.paths.docs.src, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.log('❌ Documentation index.html not found');
      return false;
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Update relative paths
    const updates = [
      { from: /href="css\//g, to: 'href="./css/' },
      { from: /src="js\//g, to: 'src="./js/' },
      { from: /src="img\//g, to: 'src="./img/' }
    ];

    updates.forEach(update => {
      content = content.replace(update.from, update.to);
    });

    fs.writeFileSync(indexPath, content);
    console.log('✅ Documentation paths updated');
    return true;
  }

  /**
   * Generate environment configuration
   */
  generateEnvConfig() {
    console.log('📝 Generating environment configuration...');
    
    const envConfig = `# Frontend Environment Configuration
# Generated automatically - modify frontend.config.js instead

# Development
VITE_DEV_PORT=${this.config.dev.port}
VITE_DEV_HOST=${this.config.dev.host}

# Build
VITE_BUILD_SOURCEMAP=${this.config.build.app.sourcemap}
VITE_BUILD_MINIFY=${this.config.build.app.minify}

# Production
VITE_BASE_URL=${this.config.production.baseUrl}
VITE_CDN_ENABLED=${this.config.production.cdn.enabled}

# Integration
VITE_DOCS_ENABLED=${this.config.integration.docs.enabled}
VITE_DOCS_ROUTE=${this.config.integration.docs.route}
VITE_DOCS_TITLE="${this.config.integration.docs.title}"
VITE_DOCS_DESCRIPTION="${this.config.integration.docs.description}"
`;

    fs.writeFileSync(path.join(this.rootPath, '.env'), envConfig);
    console.log('✅ Environment configuration generated');
  }

  /**
   * Create backup of current configuration
   */
  createBackup() {
    console.log('💾 Creating configuration backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.rootPath, 'backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const configBackup = path.join(backupDir, `frontend.config.${timestamp}.js`);
    fs.copyFileSync(
      path.join(this.rootPath, 'frontend.config.js'),
      configBackup
    );

    console.log(`✅ Backup created: ${configBackup}`);
  }

  /**
   * Health check for the integrated frontend
   */
  healthCheck() {
    console.log('🏥 Running health check...');
    
    const checks = [
      { name: 'Structure', fn: () => this.verifyStructure() },
      { name: 'Package.json', fn: () => fs.existsSync('package.json') },
      { name: 'Vite Config', fn: () => fs.existsSync('vite.config.ts') },
      { name: 'Documentation', fn: () => fs.existsSync(this.config.paths.docs.src) },
      { name: 'Build Script', fn: () => fs.existsSync('./scripts/build-docs.js') }
    ];

    const results = checks.map(check => ({
      name: check.name,
      passed: check.fn()
    }));

    console.log('\n📊 Health Check Results:');
    results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`   ${icon} ${result.name}`);
    });

    const allPassed = results.every(result => result.passed);
    console.log(`\n${allPassed ? '🎉' : '⚠️'} Overall Health: ${allPassed ? 'Good' : 'Issues Found'}`);
    
    return allPassed;
  }

  /**
   * Main migration process
   */
  async migrate() {
    console.log('🚀 Starting frontend migration...');
    console.log('='.repeat(50));
    
    try {
      this.createBackup();
      
      if (!this.verifyStructure()) {
        throw new Error('Structure verification failed');
      }

      this.updateDocumentationPaths();
      this.generateEnvConfig();
      
      const healthPassed = this.healthCheck();
      
      console.log('\n' + '='.repeat(50));
      console.log(healthPassed ? '🎉 Migration completed successfully!' : '⚠️ Migration completed with issues');
      
      return healthPassed;
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      return false;
    }
  }
}

// Command line interface
if (require.main === module) {
  const migrator = new FrontendMigrator();
  
  const command = process.argv[2] || 'migrate';
  
  switch (command) {
    case 'verify':
      migrator.verifyStructure();
      break;
    case 'health':
      migrator.healthCheck();
      break;
    case 'backup':
      migrator.createBackup();
      break;
    case 'migrate':
    default:
      migrator.migrate();
      break;
  }
}

module.exports = FrontendMigrator;