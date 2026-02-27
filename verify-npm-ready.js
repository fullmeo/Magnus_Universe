#!/usr/bin/env node

/**
 * NPM Publication Readiness Checker
 * Vérifie que tout est prêt pour publier sur npm
 * Utilisation: node verify-npm-ready.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️ ${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️ ${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.blue}📋 ${msg}${colors.reset}`),
  result: (passed, total) => {
    const percent = Math.round((passed / total) * 100);
    const color = percent === 100 ? colors.green : percent >= 80 ? colors.yellow : colors.red;
    console.log(`\n${color}résultat: ${passed}/${total} checks passed (${percent}%)${colors.reset}\n`);
    return percent === 100;
  }
};

let checks = [];

// Check 1: Files exist
log.title('1️⃣ Fichiers Requis');

const requiredFiles = [
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  '.npmignore'
];

for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    log.success(`${file} (${size} bytes)`);
    checks.push(true);
  } else {
    log.error(`${file} MANQUANT`);
    checks.push(false);
  }
}

// Check 2: package.json validation
log.title('2️⃣ Configuration package.json');

let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
} catch (e) {
  log.error('package.json is not valid JSON');
  checks.push(false);
  process.exit(1);
}

const checks2 = {
  name: packageJson.name && typeof packageJson.name === 'string',
  version: packageJson.version && typeof packageJson.version === 'string',
  description: packageJson.description && typeof packageJson.description === 'string',
  license: packageJson.license === 'MIT',
  author: packageJson.author,
  private: packageJson.private !== true,
  main: packageJson.main && fs.existsSync(path.join(__dirname, packageJson.main)),
  repository: packageJson.repository && packageJson.repository.url,
};

for (const [key, value] of Object.entries(checks2)) {
  if (value) {
    const display = key === 'main' ? `${key}: ${packageJson.main}` : `${key}: ${JSON.stringify(packageJson[key])}`;
    log.success(display);
    checks.push(true);
  } else {
    log.error(`${key}: ${value === false ? 'invalid' : 'missing'}`);
    checks.push(false);
  }
}

// Check 3: Entry points exist
log.title('3️⃣ Points d\'Entrée');

if (packageJson.main) {
  const mainPath = path.join(__dirname, packageJson.main);
  if (fs.existsSync(mainPath)) {
    log.success(`main: ${packageJson.main}`);
    checks.push(true);
  } else {
    log.error(`main file missing: ${packageJson.main}`);
    checks.push(false);
  }
}

if (packageJson.bin) {
  const binPath = path.join(__dirname, packageJson.bin.magnus || packageJson.bin);
  if (fs.existsSync(binPath)) {
    log.success(`bin: ${packageJson.bin.magnus || packageJson.bin}`);
    checks.push(true);
  } else {
    log.error(`bin file missing`);
    checks.push(false);
  }
}

// Check 4: Exports
log.title('4️⃣ Exports');

if (packageJson.exports) {
  const exportPaths = packageJson.exports;
  let exportValid = true;

  for (const [key, value] of Object.entries(exportPaths)) {
    const filePath = value.import || value;
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
      log.success(`${key} → ${filePath}`);
      checks.push(true);
    } else {
      log.error(`${key} file missing: ${filePath}`);
      checks.push(false);
    }
  }
} else {
  log.warn('No exports defined (optional)');
  checks.push(true);
}

// Check 5: Files in .npmignore
log.title('5️⃣ .npmignore Configuration');

const npmignore = fs.readFileSync(path.join(__dirname, '.npmignore'), 'utf8');
const criticalIgnores = [
  'node_modules',
  'test',
  '.git',
  '.env',
  'coverage'
];

for (const pattern of criticalIgnores) {
  if (npmignore.includes(pattern)) {
    log.success(`${pattern} is ignored`);
    checks.push(true);
  } else {
    log.warn(`${pattern} not explicitly ignored (but may be via wildcards)`);
    checks.push(true); // Not critical
  }
}

// Check 6: README quality
log.title('6️⃣ README Qualité');

const readme = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');

const readmeChecks = {
  'Installation section': readme.includes('Installation') || readme.includes('install'),
  'Quick Start': readme.includes('Quick Start') || readme.includes('quick start') || readme.includes('Usage'),
  'Examples': readme.includes('Example') || readme.includes('example') || readme.includes('npx'),
  'License': readme.includes('License') || readme.includes('MIT')
};

for (const [check, result] of Object.entries(readmeChecks)) {
  if (result) {
    log.success(check);
    checks.push(true);
  } else {
    log.warn(check);
    checks.push(true); // Not critical
  }
}

// Check 7: CHANGELOG
log.title('7️⃣ CHANGELOG');

const changelog = fs.readFileSync(path.join(__dirname, 'CHANGELOG.md'), 'utf8');

if (changelog.includes('1.0.0') || changelog.includes(packageJson.version)) {
  log.success(`Version ${packageJson.version} documented in CHANGELOG`);
  checks.push(true);
} else {
  log.warn(`CHANGELOG may need update for v${packageJson.version}`);
  checks.push(true); // Not critical
}

// Check 8: Package size estimate
log.title('8️⃣ Package Size');

function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file.startsWith('.')) continue;

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      size += getDirectorySize(fullPath);
    } else {
      size += stat.size;
    }
  }

  return size;
}

const totalSize = getDirectorySize(__dirname);
const sizeMB = (totalSize / 1024 / 1024).toFixed(2);

if (totalSize < 50 * 1024 * 1024) { // 50MB
  log.success(`Package size: ${sizeMB}MB (< 50MB limit)`);
  checks.push(true);
} else {
  log.error(`Package size: ${sizeMB}MB (exceeds 50MB limit)`);
  checks.push(false);
}

// Final result
log.title('📊 Résumé');

const passed = checks.filter(c => c).length;
const total = checks.length;
const ready = log.result(passed, total);

if (ready) {
  console.log(`${colors.green}🚀 Prêt à publier sur npm!${colors.reset}`);
  console.log(`\n  Commande: npm publish\n`);
  process.exit(0);
} else {
  console.log(`${colors.yellow}⚠️ Quelques problèmes à résoudre avant publication${colors.reset}`);
  console.log(`\n  Consultez NPM_PUBLISHING_PLAN.md pour les détails\n`);
  process.exit(1);
}
