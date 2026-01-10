#!/usr/bin/env node
/**
 * Multi-Repository XSS Vulnerability Scanner
 * GHSA-3cgp-3xvw-98x8 (React Router/Remix XSS)
 *
 * Scans multiple repositories for vulnerable dependencies and code patterns
 *
 * Usage:
 *   node scripts/audit-all-repos.js [options]
 *
 * Options:
 *   --github-user USERNAME    Scan all repos for GitHub user
 *   --github-org ORG          Scan all repos for GitHub organization
 *   --local PATH              Scan all repos in local directory
 *   --report-format FORMAT    Output format: json, markdown, html (default: markdown)
 *   --output FILE             Save report to file
 *
 * Examples:
 *   node scripts/audit-all-repos.js --github-user fullmeo
 *   node scripts/audit-all-repos.js --local ~/projects --output audit-report.md
 *
 * @version 1.0.0
 * @author Magnus Security Team
 */

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const c = (color, text) => `${colors[color]}${text}${colors.reset}`;

// Vulnerability configuration
const VULNERABILITY = {
  id: 'GHSA-3cgp-3xvw-98x8',
  title: 'XSS via script:ld+json in React Router/Remix SSR',
  severity: 'HIGH',
  publishedDate: '2026-01-09',
  packages: {
    '@remix-run/react': {
      vulnerableRange: '1.15.0 - 2.17.0',
      fixedVersion: '2.17.1',
    },
    'react-router': {
      vulnerableRange: '7.0.0 - 7.8.2',
      fixedVersion: '7.9.0',
    },
  },
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    githubUser: null,
    githubOrg: null,
    localPath: null,
    reportFormat: 'markdown',
    outputFile: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--github-user':
        options.githubUser = args[++i];
        break;
      case '--github-org':
        options.githubOrg = args[++i];
        break;
      case '--local':
        options.localPath = args[++i];
        break;
      case '--report-format':
        options.reportFormat = args[++i];
        break;
      case '--output':
        options.outputFile = args[++i];
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
${c('cyan', c('bold', 'Multi-Repository XSS Vulnerability Scanner'))}
${c('blue', 'GHSA-3cgp-3xvw-98x8 (React Router/Remix XSS)')}

${c('bold', 'Usage:')}
  node scripts/audit-all-repos.js [options]

${c('bold', 'Options:')}
  --github-user USERNAME    Scan all repos for GitHub user
  --github-org ORG          Scan all repos for GitHub organization
  --local PATH              Scan all repos in local directory
  --report-format FORMAT    Output format: json, markdown, html (default: markdown)
  --output FILE             Save report to file

${c('bold', 'Examples:')}
  node scripts/audit-all-repos.js --github-user fullmeo
  node scripts/audit-all-repos.js --local ~/projects --output audit-report.md
  node scripts/audit-all-repos.js --github-org mycompany --report-format json

${c('bold', 'Requirements:')}
  - For GitHub scanning: gh CLI installed and authenticated
  - For local scanning: repositories with package.json files
  `);
}

/**
 * Compare semver versions (simplified)
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

/**
 * Check if version is in vulnerable range
 */
function isVulnerable(version, minVersion, maxVersion) {
  return (
    compareVersions(version, minVersion) >= 0 &&
    compareVersions(version, maxVersion) <= 0
  );
}

/**
 * Analyze a single package.json file
 */
function analyzePackageJson(packageJsonPath) {
  if (!existsSync(packageJsonPath)) {
    return null;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const findings = {
    hasRemix: false,
    hasReactRouter: false,
    remixVersion: null,
    reactRouterVersion: null,
    isVulnerable: false,
    vulnerablePackages: [],
  };

  // Check @remix-run/react
  if (allDeps['@remix-run/react']) {
    const version = allDeps['@remix-run/react'].replace(/^[\^~]/, '');
    findings.hasRemix = true;
    findings.remixVersion = version;

    if (isVulnerable(version, '1.15.0', '2.17.0')) {
      findings.isVulnerable = true;
      findings.vulnerablePackages.push({
        name: '@remix-run/react',
        currentVersion: version,
        fixedVersion: VULNERABILITY.packages['@remix-run/react'].fixedVersion,
      });
    }
  }

  // Check react-router
  if (allDeps['react-router']) {
    const version = allDeps['react-router'].replace(/^[\^~]/, '');
    findings.hasReactRouter = true;
    findings.reactRouterVersion = version;

    if (isVulnerable(version, '7.0.0', '7.8.2')) {
      findings.isVulnerable = true;
      findings.vulnerablePackages.push({
        name: 'react-router',
        currentVersion: version,
        fixedVersion: VULNERABILITY.packages['react-router'].fixedVersion,
      });
    }
  }

  return findings;
}

/**
 * Scan repository for vulnerable code patterns
 */
function scanCodePatterns(repoPath) {
  const patterns = {
    metaExports: [],
    jsonLDUsage: [],
    ssrPatterns: [],
  };

  try {
    // Search for meta() exports
    const metaFiles = execSync(
      `find "${repoPath}" -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\) -exec grep -l "export.*meta" {} \\; 2>/dev/null || true`,
      { encoding: 'utf8' }
    );
    patterns.metaExports = metaFiles
      .split('\n')
      .filter(Boolean)
      .map((f) => f.replace(repoPath + '/', ''));

    // Search for script:ld+json
    const jsonLDFiles = execSync(
      `find "${repoPath}" -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\) -exec grep -l "script:ld+json" {} \\; 2>/dev/null || true`,
      { encoding: 'utf8' }
    );
    patterns.jsonLDUsage = jsonLDFiles
      .split('\n')
      .filter(Boolean)
      .map((f) => f.replace(repoPath + '/', ''));

    // Search for SSR patterns
    const ssrFiles = execSync(
      `find "${repoPath}" -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\) -exec grep -l "renderToString\\|renderToStaticMarkup" {} \\; 2>/dev/null || true`,
      { encoding: 'utf8' }
    );
    patterns.ssrPatterns = ssrFiles
      .split('\n')
      .filter(Boolean)
      .map((f) => f.replace(repoPath + '/', ''));
  } catch (error) {
    // Silently fail if commands not available
  }

  return patterns;
}

/**
 * Audit a single repository
 */
function auditRepository(repoPath) {
  const repoName = basename(repoPath);
  const packageJsonPath = join(repoPath, 'package.json');

  console.log(c('blue', c('bold', `\n📁 Scanning: ${repoName}`)));
  console.log(c('blue', `   Path: ${repoPath}`));

  const result = {
    name: repoName,
    path: repoPath,
    hasPackageJson: existsSync(packageJsonPath),
    timestamp: new Date().toISOString(),
    riskLevel: 'NONE',
    findings: null,
    patterns: null,
    recommendations: [],
  };

  if (!result.hasPackageJson) {
    console.log(c('yellow', '   ⚠️  No package.json found - skipping'));
    return result;
  }

  // Analyze dependencies
  result.findings = analyzePackageJson(packageJsonPath);

  if (!result.findings.hasRemix && !result.findings.hasReactRouter) {
    console.log(c('green', '   ✅ No React Router/Remix dependencies'));
    result.riskLevel = 'NONE';
    return result;
  }

  // Scan code patterns
  result.patterns = scanCodePatterns(repoPath);

  // Determine risk level
  if (result.findings.isVulnerable) {
    if (result.patterns.jsonLDUsage.length > 0) {
      result.riskLevel = 'CRITICAL';
      console.log(c('red', c('bold', '   🚨 CRITICAL: Vulnerable version + script:ld+json usage!')));
    } else {
      result.riskLevel = 'HIGH';
      console.log(c('red', '   ❌ HIGH: Vulnerable version detected'));
    }
  } else if (result.patterns.metaExports.length > 0 || result.patterns.jsonLDUsage.length > 0) {
    result.riskLevel = 'MEDIUM';
    console.log(c('yellow', '   ⚠️  MEDIUM: Safe version but vulnerable patterns present'));
  } else {
    result.riskLevel = 'LOW';
    console.log(c('green', '   ✅ LOW: Safe version, no vulnerable patterns'));
  }

  // Generate recommendations
  if (result.findings.isVulnerable) {
    result.findings.vulnerablePackages.forEach((pkg) => {
      result.recommendations.push(
        `Upgrade ${pkg.name} from ${pkg.currentVersion} to ${pkg.fixedVersion}`
      );
    });

    if (result.patterns.jsonLDUsage.length > 0) {
      result.recommendations.push(
        `Sanitize all script:ld+json data in ${result.patterns.jsonLDUsage.length} file(s)`
      );
    }
  }

  if (result.patterns.metaExports.length > 0) {
    result.recommendations.push(
      'Review all meta() exports for untrusted data sources'
    );
  }

  // Display findings
  if (result.findings.hasRemix) {
    console.log(c('cyan', `   📦 @remix-run/react: ${result.findings.remixVersion}`));
  }
  if (result.findings.hasReactRouter) {
    console.log(c('cyan', `   📦 react-router: ${result.findings.reactRouterVersion}`));
  }

  if (result.patterns.jsonLDUsage.length > 0) {
    console.log(c('magenta', `   🔍 script:ld+json found in ${result.patterns.jsonLDUsage.length} file(s)`));
  }

  return result;
}

/**
 * Find all repositories in a directory
 */
function findLocalRepositories(basePath) {
  const repos = [];

  try {
    const entries = readdirSync(basePath);

    for (const entry of entries) {
      const fullPath = join(basePath, entry);

      if (!statSync(fullPath).isDirectory()) continue;
      if (entry.startsWith('.')) continue;

      const packageJsonPath = join(fullPath, 'package.json');
      if (existsSync(packageJsonPath)) {
        repos.push(fullPath);
      }
    }
  } catch (error) {
    console.error(c('red', `Error scanning directory: ${error.message}`));
  }

  return repos;
}

/**
 * Get repositories from GitHub (requires gh CLI)
 */
function getGitHubRepositories(userOrOrg, isOrg = false) {
  try {
    const command = isOrg
      ? `gh repo list ${userOrOrg} --limit 1000 --json name`
      : `gh repo list ${userOrOrg} --limit 1000 --json name`;

    const output = execSync(command, { encoding: 'utf8' });
    const repos = JSON.parse(output);

    console.log(c('cyan', `Found ${repos.length} repositories for ${userOrOrg}`));
    console.log(c('yellow', '\n⚠️  GitHub scanning requires cloning repos locally first.'));
    console.log(c('yellow', 'Use --local option to scan already cloned repositories.\n'));

    return repos.map((r) => r.name);
  } catch (error) {
    console.error(c('red', `Error fetching GitHub repos: ${error.message}`));
    console.error(c('yellow', 'Make sure gh CLI is installed and authenticated: gh auth login'));
    return [];
  }
}

/**
 * Generate report in specified format
 */
function generateReport(results, format = 'markdown') {
  const totalRepos = results.length;
  const criticalCount = results.filter((r) => r.riskLevel === 'CRITICAL').length;
  const highCount = results.filter((r) => r.riskLevel === 'HIGH').length;
  const mediumCount = results.filter((r) => r.riskLevel === 'MEDIUM').length;
  const lowCount = results.filter((r) => r.riskLevel === 'LOW').length;
  const safeCount = results.filter((r) => r.riskLevel === 'NONE').length;

  if (format === 'json') {
    return JSON.stringify(
      {
        vulnerability: VULNERABILITY,
        summary: {
          totalRepositories: totalRepos,
          critical: criticalCount,
          high: highCount,
          medium: mediumCount,
          low: lowCount,
          safe: safeCount,
        },
        repositories: results,
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  if (format === 'markdown') {
    let report = `# XSS Security Audit Report (${VULNERABILITY.id})\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n\n`;
    report += `**Vulnerability:** ${VULNERABILITY.title}\n`;
    report += `**Severity:** ${VULNERABILITY.severity}\n\n`;

    report += `## 📊 Summary\n\n`;
    report += `| Risk Level | Count |\n`;
    report += `|------------|-------|\n`;
    report += `| 🚨 CRITICAL | ${criticalCount} |\n`;
    report += `| ❌ HIGH | ${highCount} |\n`;
    report += `| ⚠️  MEDIUM | ${mediumCount} |\n`;
    report += `| ✅ LOW | ${lowCount} |\n`;
    report += `| 🟢 SAFE | ${safeCount} |\n`;
    report += `| **TOTAL** | **${totalRepos}** |\n\n`;

    // Critical repositories
    const criticalRepos = results.filter((r) => r.riskLevel === 'CRITICAL');
    if (criticalRepos.length > 0) {
      report += `## 🚨 CRITICAL RISK Repositories\n\n`;
      criticalRepos.forEach((repo) => {
        report += `### ${repo.name}\n\n`;
        report += `- **Path:** \`${repo.path}\`\n`;
        repo.findings.vulnerablePackages.forEach((pkg) => {
          report += `- **Vulnerable:** ${pkg.name}@${pkg.currentVersion} → ${pkg.fixedVersion}\n`;
        });
        report += `- **script:ld+json files:** ${repo.patterns.jsonLDUsage.length}\n`;
        report += `\n**Recommendations:**\n`;
        repo.recommendations.forEach((rec) => {
          report += `- ${rec}\n`;
        });
        report += `\n`;
      });
    }

    // High risk repositories
    const highRepos = results.filter((r) => r.riskLevel === 'HIGH');
    if (highRepos.length > 0) {
      report += `## ❌ HIGH RISK Repositories\n\n`;
      highRepos.forEach((repo) => {
        report += `### ${repo.name}\n\n`;
        report += `- **Path:** \`${repo.path}\`\n`;
        repo.findings.vulnerablePackages.forEach((pkg) => {
          report += `- **Vulnerable:** ${pkg.name}@${pkg.currentVersion} → ${pkg.fixedVersion}\n`;
        });
        report += `\n**Recommendations:**\n`;
        repo.recommendations.forEach((rec) => {
          report += `- ${rec}\n`;
        });
        report += `\n`;
      });
    }

    // Safe repositories
    report += `## ✅ Safe Repositories\n\n`;
    results
      .filter((r) => r.riskLevel === 'NONE' || r.riskLevel === 'LOW')
      .forEach((repo) => {
        report += `- ${repo.name}\n`;
      });

    report += `\n## 📚 Resources\n\n`;
    report += `- [GitHub Advisory](https://github.com/remix-run/react-router/security/advisories/GHSA-3cgp-3xvw-98x8)\n`;
    report += `- [OWASP XSS Guide](https://owasp.org/www-community/attacks/xss/)\n`;

    return report;
  }

  return 'Unknown format';
}

/**
 * Main execution
 */
async function main() {
  const options = parseArgs();

  console.log(c('cyan', c('bold', '╔════════════════════════════════════════════════════════════════╗')));
  console.log(c('cyan', c('bold', '║   Multi-Repository XSS Audit (GHSA-3cgp-3xvw-98x8)            ║')));
  console.log(c('cyan', c('bold', '╚════════════════════════════════════════════════════════════════╝')));

  let repositories = [];

  if (options.localPath) {
    repositories = findLocalRepositories(options.localPath);
    console.log(c('green', `\nFound ${repositories.length} repositories in ${options.localPath}`));
  } else if (options.githubUser) {
    const repoNames = getGitHubRepositories(options.githubUser, false);
    console.log(c('yellow', '\nPlease clone repositories locally and use --local option.'));
    return;
  } else if (options.githubOrg) {
    const repoNames = getGitHubRepositories(options.githubOrg, true);
    console.log(c('yellow', '\nPlease clone repositories locally and use --local option.'));
    return;
  } else {
    console.log(c('yellow', '\nNo scan target specified. Use --help for options.'));
    return;
  }

  // Audit all repositories
  const results = [];
  for (const repo of repositories) {
    const result = auditRepository(repo);
    results.push(result);
  }

  // Generate report
  console.log(c('cyan', c('bold', '\n\n═══════════════════════════════════════════════════════════════')));
  console.log(c('cyan', c('bold', '                    AUDIT SUMMARY')));
  console.log(c('cyan', c('bold', '═══════════════════════════════════════════════════════════════\n')));

  const summary = {
    total: results.length,
    critical: results.filter((r) => r.riskLevel === 'CRITICAL').length,
    high: results.filter((r) => r.riskLevel === 'HIGH').length,
    medium: results.filter((r) => r.riskLevel === 'MEDIUM').length,
    low: results.filter((r) => r.riskLevel === 'LOW').length,
    safe: results.filter((r) => r.riskLevel === 'NONE').length,
  };

  console.log(`Total Repositories: ${summary.total}`);
  console.log(c('red', `🚨 CRITICAL: ${summary.critical}`));
  console.log(c('red', `❌ HIGH: ${summary.high}`));
  console.log(c('yellow', `⚠️  MEDIUM: ${summary.medium}`));
  console.log(c('green', `✅ LOW: ${summary.low}`));
  console.log(c('green', `🟢 SAFE: ${summary.safe}`));

  const report = generateReport(results, options.reportFormat);

  if (options.outputFile) {
    writeFileSync(options.outputFile, report, 'utf8');
    console.log(c('cyan', `\n💾 Report saved to: ${options.outputFile}`));
  } else {
    console.log('\n' + report);
  }

  // Exit with error code if vulnerabilities found
  if (summary.critical > 0 || summary.high > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(c('red', `Fatal error: ${error.message}`));
  process.exit(1);
});
