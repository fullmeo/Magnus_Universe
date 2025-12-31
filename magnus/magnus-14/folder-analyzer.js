/**
 * MAGNUS 14 FOLDER ANALYZER
 *
 * Analyzes a project folder structure to extract:
 * - Project name and description
 * - Technology domain
 * - Components and dependencies
 * - Complexity estimation
 *
 * Supports common patterns:
 * - package.json (Node.js/JavaScript)
 * - requirements.txt / setup.py (Python)
 * - Cargo.toml (Rust)
 * - go.mod (Go)
 * - pom.xml / build.gradle (Java)
 * - README.md (project description)
 */

const fs = require('fs');
const path = require('path');

class FolderAnalyzer {
  constructor(folderPath) {
    this.folderPath = folderPath;
    this.stats = {
      exists: false,
      isDirectory: false,
      fileCount: 0,
      totalSize: 0,
      files: [],
      directories: []
    };

    this.validate();
  }

  /**
   * Validate folder path
   */
  validate() {
    try {
      if (!fs.existsSync(this.folderPath)) {
        throw new Error(`Folder not found: ${this.folderPath}`);
      }

      const stat = fs.statSync(this.folderPath);
      if (!stat.isDirectory()) {
        throw new Error(`Path is not a directory: ${this.folderPath}`);
      }

      this.stats.exists = true;
      this.stats.isDirectory = true;
    } catch (error) {
      console.error('❌ Folder validation error:', error.message);
      this.stats.exists = false;
    }
  }

  /**
   * Recursively scan folder structure
   */
  scanFolder(dirPath = this.folderPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth > maxDepth || !this.stats.exists) {
      return [];
    }

    const files = [];
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip common ignored directories
        if (this.shouldIgnore(entry.name)) {
          continue;
        }

        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.relative(this.folderPath, fullPath);

        if (entry.isDirectory()) {
          this.stats.directories.push(relativePath);
          if (currentDepth < maxDepth) {
            files.push(...this.scanFolder(fullPath, maxDepth, currentDepth + 1));
          }
        } else {
          const size = fs.statSync(fullPath).size;
          this.stats.fileCount++;
          this.stats.totalSize += size;
          files.push({
            name: entry.name,
            path: relativePath,
            size: size,
            ext: path.extname(entry.name)
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dirPath}:`, error.message);
    }

    return files;
  }

  /**
   * Determine if path should be ignored
   */
  shouldIgnore(name) {
    const ignoreList = [
      'node_modules', '.git', '.vscode', '.idea', 'dist', 'build',
      'target', '__pycache__', '.pytest_cache', '.venv', 'venv',
      '.env', '.DS_Store', 'Thumbs.db', '.cache', 'coverage',
      '.gradle', '.m2', 'vendor', '.bundle', 'tmp', 'log'
    ];
    return ignoreList.includes(name);
  }

  /**
   * Detect technology stack from files
   */
  detectTechStack() {
    const files = this.stats.files;
    const tech = {
      languages: [],
      frameworks: [],
      domains: [],
      primaryDomain: 'unknown'
    };

    const fileExtensions = {};
    files.forEach(f => {
      fileExtensions[f.ext] = (fileExtensions[f.ext] || 0) + 1;
    });

    // Detect languages
    if (fileExtensions['.js'] || fileExtensions['.ts'] || fileExtensions['.jsx']) {
      tech.languages.push('JavaScript/TypeScript');
    }
    if (fileExtensions['.py']) {
      tech.languages.push('Python');
    }
    if (fileExtensions['.java']) {
      tech.languages.push('Java');
    }
    if (fileExtensions['.rs']) {
      tech.languages.push('Rust');
    }
    if (fileExtensions['.go']) {
      tech.languages.push('Go');
    }
    if (fileExtensions['.cpp'] || fileExtensions['.c']) {
      tech.languages.push('C/C++');
    }
    if (fileExtensions['.sol']) {
      tech.languages.push('Solidity');
      tech.domains.push('blockchain');
    }

    // Check for package files
    const fileNames = files.map(f => f.name);

    if (fileNames.includes('package.json')) {
      const pkg = this.readJSON(path.join(this.folderPath, 'package.json'));
      if (pkg) {
        if (pkg.dependencies) {
          if (pkg.dependencies['react'] || pkg.dependencies['@react']) {
            tech.frameworks.push('React');
            tech.domains.push('web');
          }
          if (pkg.dependencies['express']) {
            tech.frameworks.push('Express');
            tech.domains.push('web');
          }
          if (pkg.dependencies['vue'] || pkg.dependencies['nuxt']) {
            tech.frameworks.push('Vue');
            tech.domains.push('web');
          }
          if (pkg.dependencies['tensorflow'] || pkg.dependencies['torch']) {
            tech.domains.push('ai');
          }
          if (pkg.dependencies['web3'] || pkg.dependencies['ethers']) {
            tech.domains.push('blockchain');
          }
        }
      }
    }

    if (fileNames.includes('requirements.txt') || fileNames.includes('setup.py')) {
      const reqFile = fileNames.includes('requirements.txt') ? 'requirements.txt' : 'setup.py';
      const content = this.readFile(path.join(this.folderPath, reqFile)) || '';
      if (content.includes('django') || content.includes('flask')) {
        tech.frameworks.push('Django/Flask');
        tech.domains.push('web');
      }
      if (content.includes('tensorflow') || content.includes('torch') || content.includes('keras')) {
        tech.frameworks.push('TensorFlow/PyTorch');
        tech.domains.push('ai');
      }
    }

    if (fileNames.includes('pom.xml')) {
      tech.frameworks.push('Spring/Maven');
      tech.domains.push('web');
    }

    if (fileNames.includes('Cargo.toml')) {
      const cargo = this.readFile(path.join(this.folderPath, 'Cargo.toml')) || '';
      if (cargo.includes('wasm') || cargo.includes('web-sys')) {
        tech.domains.push('web');
      }
    }

    if (fileNames.includes('go.mod')) {
      tech.frameworks.push('Go modules');
    }

    // Determine primary domain
    const domainCounts = {};
    tech.domains.forEach(d => {
      domainCounts[d] = (domainCounts[d] || 0) + 1;
    });

    if (Object.keys(domainCounts).length > 0) {
      tech.primaryDomain = Object.keys(domainCounts).reduce((a, b) =>
        domainCounts[a] > domainCounts[b] ? a : b
      );
    } else if (tech.languages.length > 0) {
      tech.primaryDomain = tech.languages[0].toLowerCase();
    }

    return tech;
  }

  /**
   * Read JSON file safely
   */
  readJSON(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  /**
   * Read file safely
   */
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract project metadata
   */
  extractMetadata() {
    const metadata = {
      projectName: path.basename(this.folderPath),
      description: '',
      domain: 'unknown',
      components: [],
      complexity: 5,
      fileStats: {
        totalFiles: this.stats.fileCount,
        totalSize: (this.stats.totalSize / 1024).toFixed(2) + ' KB',
        directories: this.stats.directories.length
      }
    };

    // Try to read README
    const readmeFile = this.stats.files.find(f =>
      f.name.toLowerCase().includes('readme') && f.ext === '.md'
    );

    if (readmeFile) {
      const readmeContent = this.readFile(
        path.join(this.folderPath, readmeFile.path)
      );
      if (readmeContent) {
        // Extract first few lines as description
        const lines = readmeContent.split('\n').slice(0, 5);
        metadata.description = lines
          .filter(l => l.trim() && !l.startsWith('#'))
          .join(' ')
          .substring(0, 200);
      }
    }

    // Detect tech stack
    const tech = this.detectTechStack();
    metadata.domain = tech.primaryDomain;
    metadata.technologies = tech;

    // Estimate complexity based on file count and structure
    const complexity = Math.min(10, Math.max(1,
      Math.floor(this.stats.fileCount / 20) + Math.floor(this.stats.directories.length / 5)
    ));
    metadata.complexity = complexity;

    // Identify main components from folder structure
    const topLevelDirs = this.stats.directories
      .filter(d => !d.includes(path.sep))
      .slice(0, 6);

    metadata.components = topLevelDirs.map(dir => ({
      name: dir,
      complexity: Math.floor(Math.random() * 4) + 4 // 4-7
    }));

    return metadata;
  }

  /**
   * Generate full analysis
   */
  analyze() {
    if (!this.stats.exists) {
      return {
        success: false,
        error: 'Folder does not exist'
      };
    }

    console.log(`📂 Scanning folder: ${this.folderPath}`);
    this.stats.files = this.scanFolder();
    console.log(`✅ Found ${this.stats.fileCount} files in ${this.stats.directories.length} directories`);

    const metadata = this.extractMetadata();

    return {
      success: true,
      metadata,
      stats: this.stats
    };
  }
}

module.exports = FolderAnalyzer;
