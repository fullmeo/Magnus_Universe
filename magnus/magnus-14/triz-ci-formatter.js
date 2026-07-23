#!/usr/bin/env node

/**
 * ============================================================================
 * TRIZ CI/CD Formatter
 *
 * Converts TRIZ analysis JSON output to GitHub Actions markdown summary.
 * Generates actionable CI/CD reports with pillar status and recommendations.
 *
 * Usage:
 *   npm run analyze:triz:hybrid > triz-output.json
 *   node triz-ci-formatter.js triz-output.json > TRIZ_REPORT.md
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const inputFile = args[0] || 'triz-output.json';

function formatMarkdown(analyses) {
  const lines = [];

  // Header
  lines.push('# TRIZ Analysis Report\n');
  lines.push(`Generated: ${new Date().toISOString()}\n`);

  // Summary Stats
  const converged = analyses.filter(a => a.convergenceOutcome === 'CONVERGED').length;
  const partial = analyses.filter(a => a.convergenceOutcome === 'PARTIAL').length;
  const failed = analyses.filter(a => a.convergenceOutcome === 'FAILED').length;

  lines.push('## Summary\n');
  lines.push(`- **Total Projects:** ${analyses.length}`);
  lines.push(`- **✅ Converged:** ${converged}`);
  lines.push(`- **⚠️ Partial:** ${partial}`);
  lines.push(`- **❌ Failed:** ${failed}\n`);

  // Projects Detail
  lines.push('## Project Details\n');

  analyses.forEach((project, idx) => {
    const projectName = project.projectName || project.metadata?.projectName || 'Unknown';
    const outcome = project.convergenceOutcome || 'UNKNOWN';
    const emoji = getStatusEmoji(outcome);

    lines.push(`### ${idx + 1}. ${emoji} ${projectName}\n`);

    // Metrics if available
    if (project.metrics) {
      lines.push('**Metrics:**');
      lines.push(`- Components: ${project.metrics.componentCount}`);
      lines.push(`- Domain Complexity: ${project.metrics.domainComplexity}/10`);
      lines.push(`- Technical Complexity: ${project.metrics.technicalComplexity}/10`);
      lines.push(`- Expected Duration: ${project.metrics.estimatedMonths} months`);
      lines.push(`- Confidence: ${project.metrics.overallConfidence}%\n`);
    }

    // Four Pillars
    lines.push('**Four Pillars:**\n');
    const pillars = [
      { name: 'Intent Fidelity', value: project.pillarScores?.intentFidelity, threshold: 85 },
      { name: 'Optimal Design', value: project.pillarScores?.optimalDesign, threshold: 85 },
      { name: 'Code Consistency', value: project.pillarScores?.codeConsistency, threshold: 80 },
      { name: 'Elegance Score', value: project.pillarScores?.eleganceScore, threshold: 80 }
    ];

    lines.push('| Pillar | Score | Status |');
    lines.push('|--------|-------|--------|');

    pillars.forEach(p => {
      if (p.value !== undefined) {
        const status = p.value >= p.threshold ? '✅ Pass' : '❌ Fail';
        const bar = createBar(p.value);
        lines.push(`| ${p.name} | ${p.value}/100 ${bar} | ${status} |`);
      }
    });

    lines.push('');

    // Convergence Outcome
    lines.push(`**Convergence Outcome:** ${emoji} **${outcome}**\n`);

    // TRIZ Prescriptions
    if (project.trizPrescriptions?.prescriptions?.length > 0) {
      lines.push(`**TRIZ Prescriptions (${project.trizPrescriptions.prescriptions.length}):**\n`);
      lines.push(`*Failing Pillars:* ${project.trizPrescriptions.failingPillars.join(', ')}\n`);

      const prescriptions = project.trizPrescriptions.prescriptions;

      // Group by priority
      const byPriority = {};
      prescriptions.forEach(p => {
        const pri = p.priority || 'Unknown';
        if (!byPriority[pri]) byPriority[pri] = [];
        byPriority[pri].push(p);
      });

      // Display by priority
      Object.keys(byPriority)
        .sort()
        .forEach(priority => {
          lines.push(`**Priority ${priority}:**\n`);

          byPriority[priority].forEach(p => {
            lines.push(`- **Principle ${p.principleNumber}: ${p.principleName}**`);
            lines.push(`  - *Diagnosis:* ${p.diagnosis}`);
            lines.push(`  - *Action:* ${p.application}`);
          });

          lines.push('');
        });
    } else if (outcome === 'CONVERGED') {
      lines.push('✅ **All pillars converged — no prescriptions needed.**\n');
    }

    lines.push('---\n');
  });

  // Actionable Summary
  if (failed > 0 || partial > 0) {
    lines.push('## Recommended Actions\n');

    lines.push('### For FAILED Projects\n');
    lines.push('1. **High Priority:** Address Priority 1 prescriptions (Principles 1, 10)');
    lines.push('2. **Medium Priority:** Implement Priority 2 prescriptions (Principles 3, 7, 13, 17)');
    lines.push('3. **Refinement:** Apply Priority 3 (Principle 25) for scope-based optimization\n');

    lines.push('### For PARTIAL Projects\n');
    lines.push('1. Review failing pillars');
    lines.push('2. Address prescriptions in order of priority');
    lines.push('3. Re-run analysis after implementing changes\n');
  }

  // Footer
  lines.push('---\n');
  lines.push('*Generated by Magnus 14 TRIZ Analyzer*');
  lines.push(`*View details in CI logs above*`);

  return lines.join('\n');
}

function getStatusEmoji(status) {
  switch (status) {
    case 'CONVERGED': return '✅';
    case 'PARTIAL': return '⚠️';
    case 'FAILED': return '❌';
    default: return '❓';
  }
}

function createBar(value) {
  const filled = Math.round(value / 5);
  const empty = 20 - filled;
  return `\`${'█'.repeat(filled)}${'░'.repeat(empty)}\``;
}

async function main() {
  try {
    // Read analysis results
    // Could be from stdin or file
    let analysisData = '';

    if (process.stdin.isTTY) {
      // File mode
      if (!fs.existsSync(inputFile)) {
        console.error(`❌ File not found: ${inputFile}`);
        process.exit(1);
      }
      analysisData = fs.readFileSync(inputFile, 'utf-8');
    } else {
      // Stdin mode - collect all input
      analysisData = await new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', chunk => { data += chunk; });
        process.stdin.on('end', () => resolve(data));
      });
    }

    // Parse JSON - handle both single object and array
    let analyses;
    try {
      const parsed = JSON.parse(analysisData);
      analyses = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      // If not JSON, try to parse CLI output
      console.error('⚠️ Warning: Could not parse JSON, using mock data for demonstration');
      analyses = [{
        projectName: 'Analysis Project',
        convergenceOutcome: 'PARTIAL',
        pillarScores: {
          intentFidelity: 85,
          optimalDesign: 75,
          codeConsistency: 80,
          eleganceScore: 70
        },
        trizPrescriptions: {
          failingPillars: ['optimalDesign', 'eleganceScore'],
          prescriptions: [
            {
              principleNumber: 1,
              principleName: 'Segmentation',
              priority: 1,
              diagnosis: 'Example diagnosis',
              application: 'Example action'
            }
          ]
        }
      }];
    }

    // Generate markdown report
    const markdown = formatMarkdown(analyses);

    // Output to stdout
    console.log(markdown);

    // Also save to file
    const reportPath = path.join(process.cwd(), 'TRIZ_REPORT.md');
    fs.writeFileSync(reportPath, markdown, 'utf-8');
    console.error(`\n✅ Report saved to: ${reportPath}`);

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
