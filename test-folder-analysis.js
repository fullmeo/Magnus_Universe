const path = require('path');
const FolderAnalyzer = require('./magnus/magnus-14/folder-analyzer');
const Magnus14 = require('./magnus/magnus-14/magnus-14-core');

// Test folder path
const folderPath = 'C:/Users/diase/OneDrive/Bureau/my-fuzzy-oracle';

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         TESTING FOLDER ANALYSIS FEATURE                       ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log(`📂 Analyzing folder: ${folderPath}\n`);

// Create analyzer
const analyzer = new FolderAnalyzer(folderPath);
const result = analyzer.analyze();

if (!result.success) {
  console.error(`❌ Error: ${result.error}`);
  process.exit(1);
}

const metadata = result.metadata;

console.log(`✅ Folder analysis complete!\n`);
console.log(`📋 DETECTED PROJECT INFORMATION:`);
console.log(`──────────────────────────────────────────────────────────────────`);
console.log(`Project Name: ${metadata.projectName}`);
console.log(`Domain: ${metadata.domain}`);
console.log(`Description: ${metadata.description || '(No description found)'}`);
console.log();

console.log(`📊 FILE STATISTICS:`);
console.log(`──────────────────────────────────────────────────────────────────`);
console.log(`Total Files: ${metadata.fileStats.totalFiles}`);
console.log(`Total Size: ${metadata.fileStats.totalSize}`);
console.log(`Directories: ${metadata.fileStats.directories}`);
console.log(`Detected Complexity: ${metadata.complexity}/10`);
console.log();

console.log(`🔧 TECHNOLOGIES:`);
console.log(`──────────────────────────────────────────────────────────────────`);
console.log(`Languages: ${metadata.technologies.languages.length > 0 ? metadata.technologies.languages.join(', ') : 'None detected'}`);
console.log(`Frameworks: ${metadata.technologies.frameworks.length > 0 ? metadata.technologies.frameworks.join(', ') : 'None detected'}`);
console.log(`Domains: ${metadata.technologies.domains.length > 0 ? metadata.technologies.domains.join(', ') : 'None detected'}`);
console.log();

console.log(`📦 DETECTED COMPONENTS:`);
console.log(`──────────────────────────────────────────────────────────────────`);
metadata.components.forEach((comp, idx) => {
  console.log(`${idx + 1}. ${comp.name} (complexity: ${comp.complexity})`);
});
console.log();

// Now analyze with Magnus 14
console.log(`📊 Running Magnus 14 analysis...\n`);

const storageDir = path.join(__dirname, 'magnus/magnus-14/storage');
const magnus14 = new Magnus14({ storageDir });

const projectInput = {
  projectName: metadata.projectName,
  domain: metadata.domain,
  description: metadata.description || `Project at ${folderPath}`,
  currentClarity: 50,
  estimatedComplexity: metadata.complexity,
  components: metadata.components,
  blockers: [],
  teamSize: 1,
  timeline: 'flexible',
  folderPath: folderPath
};

console.log('⚙️  Running all 6 signature engines...\n');

const analysis = magnus14.analyzeProject(projectInput);

console.log('✅ Analysis complete!\n');
console.log(`Project ID: ${analysis.projectId}`);
console.log(`Timestamp: ${analysis.timestamp}`);

// Generate report
console.log('\n📄 ANALYSIS REPORT:\n');
const report = magnus14.generateReport(analysis.projectId);
console.log(report.substring(0, 2000));
console.log('\n... [full report continues] ...\n');

console.log(`✅ Folder analysis feature is working correctly!`);
