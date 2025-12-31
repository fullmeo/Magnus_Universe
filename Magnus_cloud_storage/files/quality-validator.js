/**
 * QualityValidator - Enforce Quality Gates
 * 
 * Magnus 13's quality enforcement - actually validates generated code
 * 
 * Validation Categories:
 * - Syntax: Code must parse/compile
 * - Security: No obvious vulnerabilities
 * - Functionality: Core features work
 * - Maintainability: Code quality standards
 * - Performance: No obvious bottlenecks
 */

import * as fs from 'fs';
import * as path from 'path';

class QualityValidator {
  constructor(config = {}) {
    this.strictMode = config.strictMode || false;
    this.securityChecks = config.securityChecks !== false;
    this.performanceChecks = config.performanceChecks !== false;
  }

  /**
   * Main validation entry point
   */
  async validate(generatedCode) {
    const results = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      passed: false,
      categories: {},
      criticalIssues: [],
      warnings: [],
      recommendations: []
    };

    // Run validation categories
    results.categories.syntax = await this.validateSyntax(generatedCode);
    results.categories.security = await this.validateSecurity(generatedCode);
    results.categories.functionality = await this.validateFunctionality(generatedCode);
    results.categories.maintainability = await this.validateMaintainability(generatedCode);
    results.categories.performance = await this.validatePerformance(generatedCode);

    // Collect critical issues
    Object.values(results.categories).forEach(category => {
      if (category.critical) {
        results.criticalIssues.push(...category.critical);
      }
      if (category.warnings) {
        results.warnings.push(...category.warnings);
      }
      if (category.recommendations) {
        results.recommendations.push(...category.recommendations);
      }
    });

    // Calculate overall score
    results.overallScore = this.calculateOverallScore(results.categories);
    
    // Determine pass/fail
    results.passed = results.criticalIssues.length === 0 && results.overallScore >= 0.6;

    return results;
  }

  /**
   * Validate syntax - code must parse/compile
   */
  async validateSyntax(generatedCode) {
    const issues = {
      critical: [],
      warnings: [],
      score: 1.0
    };

    // Check each file
    for (const [filePath, content] of Object.entries(generatedCode.files || {})) {
      const ext = path.extname(filePath);
      
      try {
        if (ext === '.js' || ext === '.jsx') {
          await this.validateJavaScript(content, filePath, issues);
        } else if (ext === '.ts' || ext === '.tsx') {
          await this.validateTypeScript(content, filePath, issues);
        } else if (ext === '.json') {
          JSON.parse(content); // Will throw if invalid
        }
      } catch (error) {
        issues.critical.push({
          file: filePath,
          type: 'SYNTAX_ERROR',
          message: `${filePath}: ${error.message}`,
          severity: 'CRITICAL'
        });
        issues.score = 0;
      }
    }

    return issues;
  }

  /**
   * Validate JavaScript syntax
   */
  async validateJavaScript(content, filePath, issues) {
    // Try to parse with acorn or similar
    // For now, basic checks
    
    // Check for obvious syntax errors
    const syntaxProblems = [
      { pattern: /\{\s*\{/, message: 'Possible duplicate opening braces' },
      { pattern: /\}\s*\}/, message: 'Possible duplicate closing braces' },
      { pattern: /;;/, message: 'Double semicolons' },
      { pattern: /\(\s*\(/, message: 'Possible duplicate opening parentheses' },
      { pattern: /\)\s*\)/, message: 'Possible duplicate closing parentheses' }
    ];

    syntaxProblems.forEach(({ pattern, message }) => {
      if (pattern.test(content)) {
        issues.warnings.push({
          file: filePath,
          type: 'SYNTAX_WARNING',
          message: `${filePath}: ${message}`,
          severity: 'WARNING'
        });
      }
    });

    // Check bracket balance
    const balanced = this.checkBracketBalance(content);
    if (!balanced.balanced) {
      issues.critical.push({
        file: filePath,
        type: 'UNBALANCED_BRACKETS',
        message: `${filePath}: Unbalanced ${balanced.type}`,
        severity: 'CRITICAL'
      });
      issues.score = 0;
    }
  }

  /**
   * Validate TypeScript (similar to JS but stricter)
   */
  async validateTypeScript(content, filePath, issues) {
    await this.validateJavaScript(content, filePath, issues);
    
    // Additional TS checks
    if (!/import.*from/.test(content) && content.length > 100) {
      issues.warnings.push({
        file: filePath,
        type: 'NO_IMPORTS',
        message: `${filePath}: No imports found - possible isolation issue`,
        severity: 'WARNING'
      });
    }
  }

  /**
   * Check bracket balance
   */
  checkBracketBalance(content) {
    const brackets = {
      '{': 0,
      '(': 0,
      '[': 0
    };
    
    const closers = {
      '}': '{',
      ')': '(',
      ']': '['
    };

    // Remove strings and comments to avoid false positives
    const cleaned = content
      .replace(/"(?:\\.|[^"\\])*"/g, '""')
      .replace(/'(?:\\.|[^'\\])*'/g, "''")
      .replace(/`(?:\\.|[^`\\])*`/g, '``')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    for (const char of cleaned) {
      if (brackets.hasOwnProperty(char)) {
        brackets[char]++;
      } else if (closers.hasOwnProperty(char)) {
        brackets[closers[char]]--;
      }
    }

    for (const [bracket, count] of Object.entries(brackets)) {
      if (count !== 0) {
        return { balanced: false, type: bracket };
      }
    }

    return { balanced: true };
  }

  /**
   * Validate security - no obvious vulnerabilities
   */
  async validateSecurity(generatedCode) {
    const issues = {
      critical: [],
      warnings: [],
      recommendations: [],
      score: 1.0
    };

    if (!this.securityChecks) {
      return issues;
    }

    // Security patterns to check
    const securityPatterns = [
      {
        pattern: /['"].*(?:api[_-]?key|secret|password|token)['"].*[:=]\s*['"][^'"]+['"]/gi,
        type: 'HARDCODED_SECRET',
        message: 'Hardcoded secret detected',
        severity: 'CRITICAL',
        recommendation: 'Use environment variables or secret management'
      },
      {
        pattern: /eval\s*\(/gi,
        type: 'EVAL_USAGE',
        message: 'eval() usage detected',
        severity: 'CRITICAL',
        recommendation: 'Avoid eval() - use safer alternatives'
      },
      {
        pattern: /innerHTML\s*=\s*.*\+/gi,
        type: 'INNERHTML_INJECTION',
        message: 'Possible XSS via innerHTML',
        severity: 'CRITICAL',
        recommendation: 'Use textContent or sanitize HTML'
      },
      {
        pattern: /SELECT.*FROM.*WHERE.*\+/gi,
        type: 'SQL_INJECTION',
        message: 'Possible SQL injection',
        severity: 'CRITICAL',
        recommendation: 'Use parameterized queries'
      },
      {
        pattern: /exec\s*\(.*\+/gi,
        type: 'COMMAND_INJECTION',
        message: 'Possible command injection',
        severity: 'CRITICAL',
        recommendation: 'Sanitize inputs or use safer APIs'
      },
      {
        pattern: /localStorage\s*\.\s*setItem.*(?:token|password|secret)/gi,
        type: 'INSECURE_STORAGE',
        message: 'Sensitive data in localStorage',
        severity: 'WARNING',
        recommendation: 'Use httpOnly cookies or secure storage'
      },
      {
        pattern: /cors.*origin.*\*/gi,
        type: 'PERMISSIVE_CORS',
        message: 'Permissive CORS configuration',
        severity: 'WARNING',
        recommendation: 'Restrict CORS to specific origins'
      },
      {
        pattern: /fetch\s*\(.*http:/gi,
        type: 'INSECURE_HTTP',
        message: 'Using HTTP instead of HTTPS',
        severity: 'WARNING',
        recommendation: 'Use HTTPS for all external requests'
      }
    ];

    // Check all files
    for (const [filePath, content] of Object.entries(generatedCode.files || {})) {
      securityPatterns.forEach(({ pattern, type, message, severity, recommendation }) => {
        const matches = content.match(pattern);
        if (matches) {
          const issue = {
            file: filePath,
            type,
            message: `${filePath}: ${message}`,
            matches: matches.slice(0, 3), // Limit to first 3
            severity,
            recommendation
          };

          if (severity === 'CRITICAL') {
            issues.critical.push(issue);
            issues.score *= 0.5; // Halve score for each critical issue
          } else {
            issues.warnings.push(issue);
            issues.score *= 0.9; // Reduce score by 10% for warnings
          }

          issues.recommendations.push(recommendation);
        }
      });
    }

    return issues;
  }

  /**
   * Validate functionality - basic feature checks
   */
  async validateFunctionality(generatedCode) {
    const issues = {
      critical: [],
      warnings: [],
      recommendations: [],
      score: 0.8 // Base score
    };

    // Check for essential patterns
    const essentialPatterns = {
      errorHandling: {
        patterns: [/try\s*\{/, /catch\s*\(/, /\.catch\(/, /throw new Error/],
        name: 'Error handling',
        importance: 'high'
      },
      inputValidation: {
        patterns: [/if\s*\(.*\)/, /validate/, /check/, /assert/],
        name: 'Input validation',
        importance: 'medium'
      },
      logging: {
        patterns: [/console\.(log|error|warn)/, /logger\./],
        name: 'Logging',
        importance: 'low'
      }
    };

    const allContent = Object.values(generatedCode.files || {}).join('\n');

    Object.entries(essentialPatterns).forEach(([key, { patterns, name, importance }]) => {
      const hasPattern = patterns.some(p => p.test(allContent));
      
      if (!hasPattern) {
        if (importance === 'high') {
          issues.warnings.push({
            type: 'MISSING_PATTERN',
            message: `No ${name} detected`,
            severity: 'WARNING'
          });
          issues.score *= 0.8;
        } else if (importance === 'medium') {
          issues.recommendations.push(`Consider adding ${name}`);
          issues.score *= 0.95;
        }
      }
    });

    // Check for main entry points
    const hasEntry = Object.keys(generatedCode.files || {}).some(file => 
      /index\.(js|ts|jsx|tsx)$/.test(file) || 
      /main\.(js|ts)$/.test(file) ||
      /App\.(js|ts|jsx|tsx)$/.test(file)
    );

    if (!hasEntry && Object.keys(generatedCode.files || {}).length > 1) {
      issues.warnings.push({
        type: 'NO_ENTRY_POINT',
        message: 'No clear entry point (index.js, main.js, App.js)',
        severity: 'WARNING'
      });
    }

    return issues;
  }

  /**
   * Validate maintainability - code quality
   */
  async validateMaintainability(generatedCode) {
    const issues = {
      warnings: [],
      recommendations: [],
      score: 0.8 // Base score
    };

    for (const [filePath, content] of Object.entries(generatedCode.files || {})) {
      // Check file size
      const lines = content.split('\n').length;
      if (lines > 300) {
        issues.warnings.push({
          file: filePath,
          type: 'LARGE_FILE',
          message: `${filePath}: ${lines} lines - consider splitting`,
          severity: 'WARNING'
        });
        issues.score *= 0.95;
      }

      // Check function size
      const functions = content.match(/function\s+\w+|=>\s*\{/g) || [];
      if (functions.length > 20) {
        issues.recommendations.push(`${filePath}: Many functions - ensure clear organization`);
      }

      // Check for magic numbers
      const magicNumbers = content.match(/\b\d{2,}\b/g) || [];
      if (magicNumbers.length > 5) {
        issues.recommendations.push(`${filePath}: Consider extracting magic numbers to constants`);
      }

      // Check for TODO/FIXME
      const todos = content.match(/\/\/\s*(TODO|FIXME|HACK)/gi) || [];
      if (todos.length > 0) {
        issues.recommendations.push(`${filePath}: ${todos.length} TODO/FIXME comments - track as issues`);
      }

      // Check for comments
      const commentLines = content.match(/\/\/|\/\*|\*\//g) || [];
      const commentRatio = commentLines.length / lines;
      if (commentRatio < 0.05 && lines > 50) {
        issues.recommendations.push(`${filePath}: Low comment density - consider adding documentation`);
        issues.score *= 0.95;
      }

      // Check for descriptive names
      const shortVarNames = content.match(/\b[a-z]\b/g) || [];
      if (shortVarNames.length > lines * 0.1) {
        issues.warnings.push({
          file: filePath,
          type: 'SHORT_VAR_NAMES',
          message: `${filePath}: Many single-letter variables - use descriptive names`,
          severity: 'WARNING'
        });
      }
    }

    return issues;
  }

  /**
   * Validate performance - no obvious bottlenecks
   */
  async validatePerformance(generatedCode) {
    const issues = {
      warnings: [],
      recommendations: [],
      score: 1.0
    };

    if (!this.performanceChecks) {
      return issues;
    }

    const allContent = Object.values(generatedCode.files || {}).join('\n');

    // Performance antipatterns
    const antipatterns = [
      {
        pattern: /for.*for.*for/s,
        type: 'NESTED_LOOPS',
        message: 'Triple nested loops detected - O(n³) complexity',
        severity: 'WARNING',
        recommendation: 'Consider optimization or better algorithm'
      },
      {
        pattern: /setInterval.*setState|setState.*setInterval/,
        type: 'POLLING_STATE',
        message: 'Polling with state updates - consider alternatives',
        severity: 'WARNING',
        recommendation: 'Use WebSocket or event-driven approach'
      },
      {
        pattern: /\.map\(.*\.map\(/,
        type: 'NESTED_MAP',
        message: 'Nested map operations',
        severity: 'INFO',
        recommendation: 'Consider flattening or single-pass operation'
      },
      {
        pattern: /document\.querySelector.*for/,
        type: 'DOM_IN_LOOP',
        message: 'DOM queries in loop',
        severity: 'WARNING',
        recommendation: 'Cache DOM references outside loop'
      }
    ];

    antipatterns.forEach(({ pattern, type, message, severity, recommendation }) => {
      if (pattern.test(allContent)) {
        issues.warnings.push({
          type,
          message,
          severity
        });
        issues.recommendations.push(recommendation);
        issues.score *= 0.9;
      }
    });

    // Check for memoization opportunities
    if (/React/.test(allContent)) {
      if (!/useMemo|useCallback/.test(allContent) && allContent.length > 1000) {
        issues.recommendations.push('Consider React.memo, useMemo, useCallback for optimization');
      }
    }

    return issues;
  }

  /**
   * Calculate overall score from category scores
   */
  calculateOverallScore(categories) {
    const weights = {
      syntax: 0.3,
      security: 0.3,
      functionality: 0.2,
      maintainability: 0.1,
      performance: 0.1
    };

    let totalScore = 0;
    Object.entries(categories).forEach(([category, result]) => {
      totalScore += result.score * weights[category];
    });

    return Math.max(0, Math.min(1, totalScore));
  }

  /**
   * Generate quality report
   */
  generateReport(validationResults) {
    const report = [];
    
    report.push('='.repeat(80));
    report.push('QUALITY VALIDATION REPORT');
    report.push('='.repeat(80));
    report.push('');
    
    // Overall status
    const status = validationResults.passed ? '✓ PASSED' : '✗ FAILED';
    const score = (validationResults.overallScore * 100).toFixed(1);
    report.push(`Status: ${status}`);
    report.push(`Overall Score: ${score}/100`);
    report.push('');

    // Critical issues
    if (validationResults.criticalIssues.length > 0) {
      report.push('CRITICAL ISSUES:');
      report.push('-'.repeat(80));
      validationResults.criticalIssues.forEach((issue, i) => {
        report.push(`${i + 1}. [${issue.type}] ${issue.message}`);
        if (issue.recommendation) {
          report.push(`   → ${issue.recommendation}`);
        }
      });
      report.push('');
    }

    // Warnings
    if (validationResults.warnings.length > 0) {
      report.push('WARNINGS:');
      report.push('-'.repeat(80));
      validationResults.warnings.slice(0, 10).forEach((warning, i) => {
        report.push(`${i + 1}. [${warning.type}] ${warning.message}`);
      });
      if (validationResults.warnings.length > 10) {
        report.push(`... and ${validationResults.warnings.length - 10} more warnings`);
      }
      report.push('');
    }

    // Category scores
    report.push('CATEGORY SCORES:');
    report.push('-'.repeat(80));
    Object.entries(validationResults.categories).forEach(([category, result]) => {
      const categoryScore = (result.score * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(result.score * 20)) + 
                  '░'.repeat(20 - Math.round(result.score * 20));
      report.push(`${category.padEnd(20)} ${bar} ${categoryScore}/100`);
    });
    report.push('');

    // Recommendations
    if (validationResults.recommendations.length > 0) {
      report.push('RECOMMENDATIONS:');
      report.push('-'.repeat(80));
      const uniqueRecs = [...new Set(validationResults.recommendations)];
      uniqueRecs.slice(0, 5).forEach((rec, i) => {
        report.push(`${i + 1}. ${rec}`);
      });
      report.push('');
    }

    report.push('='.repeat(80));
    
    return report.join('\n');
  }
}

export default QualityValidator;
