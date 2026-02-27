/**
 * ============================================================================
 * MAGNUS 13.2 - BLOC CONVERGENCE ENGINE
 * 
 * Production-Ready Implementation
 * 
 * Hypothèse: Une solution est d'autant plus robuste que PLUSIEURS
 * chemins d'intention convergent vers elle
 * 
 * Métaphysiquement neutre - purement empirique
 * ============================================================================
 */

// ============================================================================
// DEPENDENCIES
// ============================================================================

import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';

// ============================================================================
// SEMANTIC ANALYSIS MODULE
// ============================================================================

class SemanticAnalyzer {
  constructor(config = {}) {
    this.config = {
      vocabularyMinSize: config.vocabularyMinSize || 50,
      structuralPatternWeight: config.structuralPatternWeight || 0.4,
      semanticConceptWeight: config.semanticConceptWeight || 0.6,
      logLevel: config.logLevel || 'info'
    };

    this.logger = this.createLogger('SemanticAnalyzer');
    this.intentionVocabulary = new Map();
    this.codeVocabulary = new Map();
  }

  createLogger(component) {
    return {
      debug: (msg, data) => this.config.logLevel === 'debug' && console.log(`[${component}:DEBUG]`, msg, data),
      info: (msg, data) => console.log(`[${component}:INFO]`, msg, data || ''),
      warn: (msg, data) => console.warn(`[${component}:WARN]`, msg, data || ''),
      error: (msg, data) => console.error(`[${component}:ERROR]`, msg, data || '')
    };
  }

  /**
   * Extrait le vocabulaire sémantique de l'intention (requirement)
   */
  extractIntentionVocabulary(intention) {
    const vocab = {
      domains: [],
      concepts: [],
      constraints: [],
      patterns: [],
      keywords: new Map()
    };

    try {
      // Domaines
      if (intention.domainContext) {
        vocab.domains = this.extractDomainTerms(intention.domainContext);
      }

      // Concepts métier
      if (intention.assumptions) {
        intention.assumptions.forEach(assumption => {
          const terms = this.tokenizeAndNormalize(assumption.description);
          vocab.concepts.push(...terms);
        });
      }

      // Contraintes
      if (intention.constraints) {
        intention.constraints.forEach(constraint => {
          const terms = this.tokenizeAndNormalize(constraint);
          vocab.constraints.push(...terms);
        });
      }

      // Construis frequency map
      const allTerms = [
        ...vocab.domains,
        ...vocab.concepts,
        ...vocab.constraints
      ];

      allTerms.forEach(term => {
        vocab.keywords.set(term, (vocab.keywords.get(term) || 0) + 1);
      });

      this.logger.debug('Intention vocabulary extracted', {
        domains: vocab.domains.length,
        concepts: vocab.concepts.length,
        constraints: vocab.constraints.length,
        keywords: vocab.keywords.size
      });

      return vocab;
    } catch (error) {
      this.logger.error('Failed to extract intention vocabulary', error.message);
      throw error;
    }
  }

  /**
   * Extrait le vocabulaire sémantique du code généré
   */
  extractCodeVocabulary(code) {
    const vocab = {
      identifiers: [],
      patterns: [],
      structures: [],
      imports: [],
      exports: [],
      keywords: new Map(),
      comments: []
    };

    try {
      // Identifiers (variables, functions, classes)
      const identifierPattern = /(?:const|let|var|function|class|async)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      let match;
      while ((match = identifierPattern.exec(code)) !== null) {
        const identifier = match[1];
        vocab.identifiers.push(identifier);
        vocab.keywords.set(identifier, (vocab.keywords.get(identifier) || 0) + 1);
      }

      // Imports/Exports
      const importPattern = /import\s+(?:\{[^}]*\}|[^from]*)\s+from\s+['"](.*?)['"]/g;
      while ((match = importPattern.exec(code)) !== null) {
        vocab.imports.push(match[1]);
      }

      const exportPattern = /export\s+(?:default\s+)?(?:class|function|const|interface|type|async function)?\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      while ((match = exportPattern.exec(code)) !== null) {
        vocab.exports.push(match[1]);
      }

      // Also check for module.exports and default export
      if (/export\s+default\s+\w+/.test(code)) {
        vocab.exports.push('default');
      }

      // Code patterns (async, promises, callbacks, etc.)
      vocab.patterns = this.detectCodePatterns(code);

      // Structural analysis
      vocab.structures = this.analyzeCodeStructure(code);

      // Comments
      const commentPattern = /\/\/\s*(.+)|\/\*\*?\s*([\s\S]*?)\*\//g;
      while ((match = commentPattern.exec(code)) !== null) {
        const comment = match[1] || match[2];
        if (comment) {
          const terms = this.tokenizeAndNormalize(comment);
          vocab.comments.push(...terms);
          terms.forEach(term => {
            vocab.keywords.set(term, (vocab.keywords.get(term) || 0) + 1);
          });
        }
      }

      this.logger.debug('Code vocabulary extracted', {
        identifiers: vocab.identifiers.length,
        patterns: vocab.patterns.length,
        structures: vocab.structures.length,
        imports: vocab.imports.length,
        exports: vocab.exports.length,
        comments: vocab.comments.length,
        keywords: vocab.keywords.size
      });

      return vocab;
    } catch (error) {
      this.logger.error('Failed to extract code vocabulary', error.message);
      throw error;
    }
  }

  /**
   * Détecte les patterns utilisés dans le code
   */
  detectCodePatterns(code) {
    const patterns = [];

    const patternTests = [
      { name: 'async-await', regex: /async\s+\w+\s*\(.*?\)\s*{[\s\S]*?await/ },
      { name: 'promises', regex: /\.then\(|\.catch\(|\.finally\(/ },
      { name: 'callbacks', regex: /\(.*?,\s*\(.*?\)\s*=>/ },
      { name: 'class-based', regex: /class\s+\w+\s*{/ },
      { name: 'functional', regex: /const\s+\w+\s*=\s*\(.*?\)\s*=>/ },
      { name: 'generators', regex: /function\*|yield/ },
      { name: 'recursion', regex: /(?:function\s+(\w+)|const\s+(\w+)\s*=).*?(?:\1|\2)\s*\(/ },
      { name: 'memoization', regex: /(?:const|let)\s+\w+\s*=\s*new\s+Map|cache|memo/ },
      { name: 'error-handling', regex: /try\s*{|catch\s*\(|throw\s+/ },
      { name: 'validation', regex: /(?:if|!)\s*\(.*?(?:!|typeof|instanceof|===|!==|>|<)\s*\)/ },
      { name: 'logging', regex: /console\.|logger\.|log\(/ },
      { name: 'type-checking', regex: /typeof|instanceof|Array\.isArray/ }
    ];

    patternTests.forEach(({ name, regex }) => {
      if (regex.test(code)) {
        patterns.push(name);
      }
    });

    return patterns;
  }

  /**
   * Analyse la structure du code (complexity, modularity, etc.)
   */
  analyzeCodeStructure(code) {
    const structures = [];

    const lines = code.split('\n');
    const avgLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
    const nestingDepth = this.calculateNestingDepth(code);

    if (avgLineLength < 50) structures.push('concise');
    if (avgLineLength > 100) structures.push('verbose');

    if (nestingDepth < 3) structures.push('shallow');
    if (nestingDepth >= 5) structures.push('deeply-nested');

    const functionCount = (code.match(/(?:function|=>)/g) || []).length;
    if (functionCount > lines.length / 50) structures.push('highly-modular');

    const commentRatio = (code.match(/\/\//g) || []).length / lines.length;
    if (commentRatio > 0.1) structures.push('well-documented');
    if (commentRatio < 0.02) structures.push('under-documented');

    const errorHandling = code.match(/try\s*{|catch\s*\(/g) || [];
    if (errorHandling.length > 0) structures.push('error-aware');

    return structures;
  }

  /**
   * Calcule la profondeur d'imbrication du code
   */
  calculateNestingDepth(code) {
    let maxDepth = 0;
    let currentDepth = 0;

    for (const char of code) {
      if (char === '{' || char === '[' || char === '(') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}' || char === ']' || char === ')') {
        currentDepth--;
      }
    }

    return maxDepth;
  }

  /**
   * Calcule l'alignement sémantique entre intention et code
   */
  calculateSemanticAlignment(intentionVocab, codeVocab) {
    // 1. Vocabulaire partagé
    const sharedKeywords = new Set();
    for (const keyword of intentionVocab.keywords.keys()) {
      if (codeVocab.keywords.has(keyword)) {
        sharedKeywords.add(keyword);
      }
    }

    const vocabularyOverlap = sharedKeywords.size / 
      Math.max(intentionVocab.keywords.size, 1);

    // 2. Domaines
    const domainMatch = intentionVocab.domains.some(domain =>
      codeVocab.identifiers.some(id => id.toLowerCase().includes(domain.toLowerCase()))
    ) ? 1.0 : 0.5;

    // 3. Patterns
    const patternMatch = this.calculatePatternMatch(intentionVocab, codeVocab);

    // 4. Structures
    const structureMatch = this.calculateStructureMatch(intentionVocab, codeVocab);

    // Score pondéré
    const alignmentScore = (
      (vocabularyOverlap * 0.35) +
      (domainMatch * 0.25) +
      (patternMatch * 0.25) +
      (structureMatch * 0.15)
    ) * 100;

    return {
      score: Math.round(alignmentScore),
      vocabularyOverlap: Math.round(vocabularyOverlap * 100),
      domainMatch: Math.round(domainMatch * 100),
      patternMatch: Math.round(patternMatch * 100),
      structureMatch: Math.round(structureMatch * 100),
      sharedKeywords: Array.from(sharedKeywords),
      details: {
        intentionKeywords: intentionVocab.keywords.size,
        codeKeywords: codeVocab.keywords.size,
        shared: sharedKeywords.size
      }
    };
  }

  /**
   * Calcule la correspondance des patterns
   */
  calculatePatternMatch(intentionVocab, codeVocab) {
    if (codeVocab.patterns.length === 0) return 0.5;

    // Si l'intention mentionne certains patterns, check s'ils sont dans le code
    const mentionedPatterns = ['async', 'error', 'validation', 'logging'];
    const matchedPatterns = mentionedPatterns.filter(pattern =>
      intentionVocab.concepts.some(c => c.includes(pattern)) &&
      codeVocab.patterns.some(p => p.includes(pattern))
    );

    return matchedPatterns.length / Math.max(mentionedPatterns.length, 1);
  }

  /**
   * Calcule la correspondance structurelle
   */
  calculateStructureMatch(intentionVocab, codeVocab) {
    // Si intention parle de modularité et code est modulaire → match
    const modularity = intentionVocab.concepts.some(c => 
      c.includes('modular') || c.includes('component') || c.includes('service')
    );

    const codeIsModular = codeVocab.structures.includes('highly-modular');

    if (modularity && codeIsModular) return 0.9;
    if (modularity && !codeIsModular) return 0.4;

    // Si intention parle de documentation
    const needsDoc = intentionVocab.concepts.some(c => 
      c.includes('document') || c.includes('maintainable')
    );

    const codeIsDocumented = codeVocab.structures.includes('well-documented');

    if (needsDoc && codeIsDocumented) return 0.85;
    if (needsDoc && !codeIsDocumented) return 0.3;

    return 0.6;
  }

  /**
   * Tokenize et normalise le texte
   */
  tokenizeAndNormalize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 1)
      .map(token => token.trim());
  }

  /**
   * Extrait les termes de domaine
   */
  extractDomainTerms(domainContext) {
    if (typeof domainContext === 'string') {
      return this.tokenizeAndNormalize(domainContext);
    }
    if (typeof domainContext === 'object' && domainContext.domain) {
      return [domainContext.domain.toLowerCase()];
    }
    return [];
  }
}

// ============================================================================
// CODE QUALITY ANALYSIS MODULE
// ============================================================================

class CodeQualityAnalyzer {
  constructor(config = {}) {
    this.config = {
      thresholds: config.thresholds || {
        complexity: 10,
        duplicateLines: 0.1,
        commentRatio: 0.05,
        errorHandling: 0.02
      },
      logLevel: config.logLevel || 'info'
    };

    this.logger = this.createLogger('CodeQualityAnalyzer');
  }

  createLogger(component) {
    return {
      debug: (msg, data) => this.config.logLevel === 'debug' && console.log(`[${component}:DEBUG]`, msg, data),
      info: (msg, data) => console.log(`[${component}:INFO]`, msg, data || ''),
      warn: (msg, data) => console.warn(`[${component}:WARN]`, msg, data || ''),
      error: (msg, data) => console.error(`[${component}:ERROR]`, msg, data || '')
    };
  }

  /**
   * Analyse complète de qualité du code
   */
  analyze(code) {
    try {
      const metrics = {
        size: this.analyzeSize(code),
        complexity: this.analyzeComplexity(code),
        duplication: this.analyzeDuplication(code),
        documentation: this.analyzeDocumentation(code),
        errorHandling: this.analyzeErrorHandling(code),
        readability: this.analyzeReadability(code),
        maintainability: this.analyzeMaintainability(code),
        security: this.analyzeSecurityConcerns(code)
      };

      const score = this.calculateOverallScore(metrics);
      const readabilityScore = this.calculateReadabilityScore(metrics);

      this.logger.info('Code quality analysis complete', {
        score: Math.round(score),
        readability: Math.round(readabilityScore),
        size: metrics.size.lines
      });

      return {
        score: Math.round(score),
        readability: Math.round(readabilityScore),
        metrics,
        details: {
          passed: Object.entries(metrics)
            .filter(([_, m]) => m.status === 'PASS')
            .map(([name]) => name),
          warnings: Object.entries(metrics)
            .filter(([_, m]) => m.status === 'WARN')
            .map(([name, m]) => ({ metric: name, message: m.message })),
          failures: Object.entries(metrics)
            .filter(([_, m]) => m.status === 'FAIL')
            .map(([name, m]) => ({ metric: name, message: m.message }))
        }
      };
    } catch (error) {
      this.logger.error('Failed to analyze code quality', error.message);
      throw error;
    }
  }

  /**
   * Analyse la taille du code
   */
  analyzeSize(code) {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim().length > 0).length;
    const characters = code.length;

    let status = 'PASS';
    let message = 'Code size is reasonable';

    if (nonEmptyLines < 10) {
      status = 'WARN';
      message = 'Code is very small - may be incomplete';
    } else if (nonEmptyLines > 500) {
      status = 'WARN';
      message = 'Code is large - consider splitting into smaller modules';
    }

    return {
      lines: nonEmptyLines,
      characters,
      status,
      message
    };
  }

  /**
   * Analyse la complexité (cyclomatic complexity approximation)
   */
  analyzeComplexity(code) {
    const decisionPoints = (
      (code.match(/if\s*\(/g) || []).length +
      (code.match(/else\s*{/g) || []).length +
      (code.match(/switch\s*\(/g) || []).length +
      (code.match(/case\s+/g) || []).length +
      (code.match(/for\s*\(/g) || []).length +
      (code.match(/while\s*\(/g) || []).length +
      (code.match(/\?\s*:/g) || []).length +
      (code.match(/catch\s*\(/g) || []).length
    );

    const functions = (code.match(/(?:function|=>)/g) || []).length || 1;
    const complexity = Math.ceil(decisionPoints / Math.max(functions, 1));

    let status = 'PASS';
    let message = 'Complexity is acceptable';

    if (complexity > this.config.thresholds.complexity) {
      status = 'WARN';
      message = `Complexity ${complexity} exceeds threshold ${this.config.thresholds.complexity}`;
    }

    return {
      score: complexity,
      decisionPoints,
      functions,
      status,
      message
    };
  }

  /**
   * Analyse la duplication de code
   */
  analyzeDuplication(code) {
    const lines = code.split('\n');
    const lineMap = new Map();

    lines.forEach(line => {
      const normalized = line.trim();
      if (normalized.length > 20) {
        lineMap.set(normalized, (lineMap.get(normalized) || 0) + 1);
      }
    });

    const duplicatedLines = Array.from(lineMap.values())
      .filter(count => count > 1)
      .reduce((sum, count) => sum + count, 0);

    const duplicationRatio = duplicatedLines / Math.max(lines.length, 1);

    let status = 'PASS';
    let message = 'No significant code duplication detected';

    if (duplicationRatio > this.config.thresholds.duplicateLines) {
      status = 'WARN';
      message = `Code duplication at ${(duplicationRatio * 100).toFixed(1)}% of lines`;
    }

    return {
      ratio: duplicationRatio,
      duplicatedLineCount: duplicatedLines,
      totalSignificantLines: lines.length,
      status,
      message
    };
  }

  /**
   * Analyse la documentation
   */
  analyzeDocumentation(code) {
    const lines = code.split('\n');
    const commentLines = lines.filter(l => 
      l.trim().startsWith('//') || l.trim().startsWith('/*')
    ).length;

    const commentRatio = commentLines / Math.max(lines.length, 1);

    let status = 'PASS';
    let message = 'Documentation level is adequate';

    if (commentRatio < this.config.thresholds.commentRatio) {
      status = 'WARN';
      message = `Low documentation ratio: ${(commentRatio * 100).toFixed(1)}%`;
    }

    // Check for JSDoc
    const hasJSDoc = /\/\*\*[\s\S]*?\*\//.test(code);

    return {
      ratio: commentRatio,
      commentLines,
      totalLines: lines.length,
      hasJSDoc,
      status,
      message
    };
  }

  /**
   * Analyse la gestion des erreurs
   */
  analyzeErrorHandling(code) {
    const tryBlocks = (code.match(/try\s*{/g) || []).length;
    const catchBlocks = (code.match(/catch\s*\(/g) || []).length;
    const throwStatements = (code.match(/throw\s+/g) || []).length;
    const validations = (code.match(/if\s*\([^)]*(?:typeof|instanceof|===|!==)[^)]*\)/g) || []).length;

    const errorHandlingRatio = (tryBlocks + throwStatements) / 
      Math.max((code.match(/(?:function|=>)/g) || []).length, 1);

    let status = 'PASS';
    let message = 'Error handling is present';

    if (errorHandlingRatio < this.config.thresholds.errorHandling) {
      status = 'WARN';
      message = 'Limited error handling detected';
    }

    return {
      tryBlocks,
      catchBlocks,
      throwStatements,
      validations,
      ratio: errorHandlingRatio,
      status,
      message
    };
  }

  /**
   * Analyse la lisibilité
   */
  analyzeReadability(code) {
    const lines = code.split('\n');
    const avgLineLength = lines.reduce((sum, l) => sum + l.length, 0) / Math.max(lines.length, 1);
    const avgIndent = lines
      .map(l => l.match(/^\s*/)[0].length)
      .reduce((sum, indent) => sum + indent, 0) / Math.max(lines.length, 1);

    let status = 'PASS';
    let message = 'Code is readable';

    if (avgLineLength > 120) {
      status = 'WARN';
      message = `Long lines detected (avg: ${Math.round(avgLineLength)} chars)`;
    }

    if (avgIndent > 6) {
      status = 'WARN';
      message = `Deep indentation detected (avg: ${Math.round(avgIndent)} spaces)`;
    }

    return {
      avgLineLength: Math.round(avgLineLength),
      avgIndentation: Math.round(avgIndent),
      status,
      message
    };
  }

  /**
   * Analyse la maintenabilité
   */
  analyzeMaintainability(code) {
    const hasTyping = /(?:@param|@returns|:\s*\w+|as\s+\w+)/g.test(code);
    const hasTesting = /(?:test|spec|describe|it)\s*\(/g.test(code);
    const hasLogging = /(?:console\.|logger\.|log\()/g.test(code);
    const hasValidation = /if\s*\([^)]*(?:typeof|instanceof)\s*\)/g.test(code);

    const maintainabilityFactors = [
      hasTyping,
      hasTesting,
      hasLogging,
      hasValidation
    ].filter(Boolean).length;

    let status = 'PASS';
    if (maintainabilityFactors < 2) {
      status = 'WARN';
    }

    return {
      hasTyping,
      hasTesting,
      hasLogging,
      hasValidation,
      factors: maintainabilityFactors,
      status,
      message: `${maintainabilityFactors}/4 maintainability factors present`
    };
  }

  /**
   * Analyse les risques de sécurité basiques
   */
  analyzeSecurityConcerns(code) {
    const concerns = [];

    if (/eval\s*\(/.test(code)) {
      concerns.push('eval() detected - potential security risk');
    }

    if (/innerHTML\s*=/.test(code)) {
      concerns.push('innerHTML assignment detected - XSS risk');
    }

    if (/require\s*\(\s*['"`].*\$/.test(code)) {
      concerns.push('Dynamic require detected - potential injection risk');
    }

    if (/process\.env\..*PASSWORD|SECRET/.test(code)) {
      concerns.push('Potential credential exposure in code');
    }

    const status = concerns.length === 0 ? 'PASS' : 'WARN';

    return {
      concerns,
      count: concerns.length,
      status,
      message: concerns.length === 0 
        ? 'No obvious security concerns detected'
        : `${concerns.length} potential security concern(s) found`
    };
  }

  /**
   * Calcule le score global de qualité
   */
  calculateOverallScore(metrics) {
    const scores = [];

    // Size: prefer medium (30-300 lines)
    const sizeScore = Math.min(
      100,
      (metrics.size.lines / 150) * 100
    );
    scores.push(sizeScore * 0.15);

    // Complexity: prefer low (< 10)
    const complexityScore = Math.max(
      0,
      100 - (metrics.complexity.score * 5)
    );
    scores.push(complexityScore * 0.2);

    // Duplication: prefer low
    const duplicationScore = Math.max(
      0,
      100 - (metrics.duplication.ratio * 1000)
    );
    scores.push(duplicationScore * 0.15);

    // Documentation: prefer 5-10%
    const docScore = Math.min(
      100,
      Math.abs(metrics.documentation.ratio - 0.07) > 0.05 
        ? 70 
        : 95
    );
    scores.push(docScore * 0.2);

    // Error handling: prefer present
    const errorScore = metrics.errorHandling.ratio > 0.05 ? 90 : 60;
    scores.push(errorScore * 0.15);

    // Security: prefer no concerns
    const securityScore = 100 - (metrics.security.count * 20);
    scores.push(Math.max(0, securityScore) * 0.15);

    return scores.reduce((sum, score) => sum + score, 0);
  }

  /**
   * Calcule le score de lisibilité
   */
  calculateReadabilityScore(metrics) {
    const lineScore = metrics.readability.avgLineLength <= 80 ? 100 :
                      metrics.readability.avgLineLength <= 120 ? 80 : 50;

    const indentScore = metrics.readability.avgIndentation <= 4 ? 100 :
                        metrics.readability.avgIndentation <= 6 ? 75 : 50;

    const docScore = metrics.documentation.ratio >= 0.05 ? 100 :
                     metrics.documentation.ratio >= 0.02 ? 80 : 50;

    const complexityScore = metrics.complexity.score <= 5 ? 100 :
                            metrics.complexity.score <= 10 ? 75 : 50;

    return (
      (lineScore * 0.25) +
      (indentScore * 0.25) +
      (docScore * 0.25) +
      (complexityScore * 0.25)
    );
  }
}

// ============================================================================
// CONSTRAINTS SIMILARITY MODULE
// ============================================================================

class ConstraintsSimilarity {
  constructor(config = {}) {
    this.config = {
      logLevel: config.logLevel || 'info'
    };

    this.logger = this.createLogger('ConstraintsSimilarity');
  }

  createLogger(component) {
    return {
      debug: (msg, data) => this.config.logLevel === 'debug' && console.log(`[${component}:DEBUG]`, msg, data),
      info: (msg, data) => console.log(`[${component}:INFO]`, msg, data || ''),
      warn: (msg, data) => console.warn(`[${component}:WARN]`, msg, data || ''),
      error: (msg, data) => console.error(`[${component}:ERROR]`, msg, data || '')
    };
  }

  /**
   * Calcule la similarité entre deux ensembles de contraintes
   */
  calculate(constraints1, constraints2) {
    try {
      if (!constraints1 || !constraints2) {
        return 0.5; // Default neutral value
      }

      const c1 = this.normalizeConstraints(constraints1);
      const c2 = this.normalizeConstraints(constraints2);

      if (c1.length === 0 || c2.length === 0) {
        return 0.5;
      }

      // 1. Exact matches
      const exactMatches = c1.filter(constraint =>
        c2.some(c => this.constraintEquals(constraint, c))
      ).length;

      // 2. Semantic similarity
      const semanticMatches = c1.filter(constraint =>
        c2.some(c => this.constraintSimilar(constraint, c) > 0.7)
      ).length;

      // 3. Category matches
      const categoryMatches = c1.filter(constraint =>
        c2.some(c => this.constraintCategory(constraint) === this.constraintCategory(c))
      ).length;

      const precision = exactMatches / Math.max(c1.length, 1);
      const recall = exactMatches / Math.max(c2.length, 1);
      const fScore = 2 * (precision * recall) / Math.max(precision + recall, 0.001);

      const similarity = (
        (exactMatches / Math.max(c1.length, c2.length)) * 0.5 +
        (semanticMatches / Math.max(c1.length, c2.length)) * 0.3 +
        (categoryMatches / Math.max(c1.length, c2.length)) * 0.2
      );

      this.logger.debug('Constraints similarity calculated', {
        c1Count: c1.length,
        c2Count: c2.length,
        exactMatches,
        semanticMatches,
        categoryMatches,
        similarity: Math.round(similarity * 100)
      });

      return Math.min(similarity, 1.0);
    } catch (error) {
      this.logger.error('Failed to calculate constraints similarity', error.message);
      return 0.5;
    }
  }

  /**
   * Normalise les contraintes (array ou string)
   */
  normalizeConstraints(constraints) {
    if (Array.isArray(constraints)) {
      return constraints.map(c => typeof c === 'string' ? c : c.toString());
    }
    if (typeof constraints === 'string') {
      return [constraints];
    }
    if (typeof constraints === 'object') {
      return Object.values(constraints)
        .flat()
        .map(c => c.toString());
    }
    return [];
  }

  /**
   * Vérifie l'égalité exacte de deux contraintes
   */
  constraintEquals(c1, c2) {
    const normalized1 = c1.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalized2 = c2.toLowerCase().replace(/\s+/g, ' ').trim();
    return normalized1 === normalized2;
  }

  /**
   * Calcule la similarité sémantique (Jaccard avec tokens)
   */
  constraintSimilar(c1, c2) {
    const tokens1 = new Set(this.tokenize(c1));
    const tokens2 = new Set(this.tokenize(c2));

    const intersection = new Set(
      [...tokens1].filter(x => tokens2.has(x))
    );
    const union = new Set([...tokens1, ...tokens2]);

    const jaccardScore = intersection.size / Math.max(union.size, 1);
    
    // Apply boost for semantic similarity of common concepts
    const semanticBoost = this.semanticSimilarityBoost(c1, c2);
    
    return Math.min(jaccardScore + (semanticBoost * 0.2), 1.0);
  }

  /**
   * Boost score for semantically similar constraint types
   */
  semanticSimilarityBoost(c1, c2) {
    const cat1 = this.constraintCategory(c1);
    const cat2 = this.constraintCategory(c2);
    
    // Same category gets boost
    if (cat1 === cat2) {
      return 0.3;
    }
    
    return 0;
  }

  /**
   * Détermine la catégorie d'une contrainte
   */
  constraintCategory(constraint) {
    const lower = constraint.toLowerCase();

    if (/performance|speed|latency|response\s*time/.test(lower)) {
      return 'PERFORMANCE';
    }
    if (/security|encrypt|auth|permission/.test(lower)) {
      return 'SECURITY';
    }
    if (/scalab|concurrent|parallel|thread/.test(lower)) {
      return 'SCALABILITY';
    }
    if (/maintenance|readable|document|clean|style/.test(lower)) {
      return 'MAINTAINABILITY';
    }
    if (/compatibility|legacy|backward|version/.test(lower)) {
      return 'COMPATIBILITY';
    }
    if (/memory|storage|disk|cache/.test(lower)) {
      return 'RESOURCE';
    }
    if (/reliability|fault|error|recovery/.test(lower)) {
      return 'RELIABILITY';
    }

    return 'GENERAL';
  }

  /**
   * Tokenise le texte
   */
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }
}

// ============================================================================
// BLOC CONVERGENCE ENGINE - MAIN
// ============================================================================

class BlocConvergenceEngine {
  constructor(config = {}) {
    this.config = {
      historicalIntentions: config.historicalIntentions || new Map(),
      convergencePaths: config.convergencePaths || new Map(),
      robustnessThreshold: config.robustnessThreshold || 2,
      storageDir: config.storageDir || './.magnus-convergence',
      logLevel: config.logLevel || 'info'
    };

    this.logger = this.createLogger('BlocConvergenceEngine');

    // Initialize sub-modules
    this.semantic = new SemanticAnalyzer({ logLevel: this.config.logLevel });
    this.quality = new CodeQualityAnalyzer({ logLevel: this.config.logLevel });
    this.constraints = new ConstraintsSimilarity({ logLevel: this.config.logLevel });

    this.initialized = false;
  }

  createLogger(component) {
    return {
      debug: (msg, data) => this.config.logLevel === 'debug' && console.log(`[${component}:DEBUG]`, msg, data),
      info: (msg, data) => console.log(`[${component}:INFO]`, msg, data || ''),
      warn: (msg, data) => console.warn(`[${component}:WARN]`, msg, data || ''),
      error: (msg, data) => console.error(`[${component}:ERROR]`, msg, data || '')
    };
  }

  /**
   * Initialise le moteur
   */
  async initialize() {
    if (this.initialized) return;

    try {
      await fs.mkdir(this.config.storageDir, { recursive: true });
      this.logger.info('BlocConvergenceEngine initialized');
      this.initialized = true;
    } catch (error) {
      this.logger.error('Failed to initialize BlocConvergenceEngine', error.message);
      throw error;
    }
  }

  /**
   * SCAN: Y a-t-il d'autres intentions qui convergeraient vers le même code?
   */
  async scanBlocForConvergence(currentAnalysis, generatedCode) {
    if (!this.initialized) await this.initialize();

    console.log('\n🔍 BLOC CONVERGENCE SCAN');
    console.log('═══════════════════════════════════════════════════════');

    try {
      const currentIntention = {
        clarityScore: currentAnalysis.understanding.clarityScore,
        complexityScore: currentAnalysis.complexity.overall.score,
        domainContext: currentAnalysis.understanding.domainContext,
        constraints: currentAnalysis.understanding.constraints,
        assumptions: currentAnalysis.understanding.assumptions
      };

      // 1. Cherche dans l'historique
      console.log('📚 Searching historical intentions...');
      const historicalMatches = this.findHistoricalIntentions(currentIntention);
      console.log(`   Found ${historicalMatches.length} candidates`);

      // 2. Pour chaque intention historique, le code converge-t-il?
      console.log('🧪 Testing convergence paths...');
      const convergencePaths = [];

      for (const historical of historicalMatches) {
        const pathConvergence = await this.testPathConvergence(
          historical.intention,
          generatedCode
        );

        if (pathConvergence.converges) {
          convergencePaths.push({
            intention: historical.intention,
            sessionId: historical.sessionId,
            convergenceScore: pathConvergence.score,
            pathDistance: pathConvergence.distance,
            recognition: pathConvergence.recognition
          });
        }
      }

      console.log(`   ✓ ${convergencePaths.length} paths converge`);

      // 3. Calcule robustesse
      const robustness = {
        numConvergencePaths: convergencePaths.length,
        isRobust: convergencePaths.length >= this.config.robustnessThreshold,
        averageScore: convergencePaths.length > 0
          ? convergencePaths.reduce((sum, p) => sum + p.convergenceScore, 0)
          / convergencePaths.length
          : 0,
        paths: convergencePaths
      };

      console.log(`\n📊 Robustness Analysis:`);
      console.log(`   Paths: ${robustness.numConvergencePaths}`);
      console.log(`   Average Score: ${Math.round(robustness.averageScore)}%`);
      console.log(`   Robust: ${robustness.isRobust ? '✓ YES' : '✗ NO'}`);

      const currentIntentionVocab = this.semantic.extractIntentionVocabulary(currentIntention);
      const codeVocab = this.semantic.extractCodeVocabulary(generatedCode);

      return {
        currentIntention,
        robustness,
        interpretation: this.interpretRobustness(robustness),
        recommendation: this.recommendAction(robustness),
        semanticAnalysis: {
          intentionVocabulary: {
            domains: currentIntentionVocab.domains,
            conceptCount: currentIntentionVocab.concepts.length,
            constraintCount: currentIntentionVocab.constraints.length
          },
          codeVocabulary: {
            identifiers: codeVocab.identifiers.slice(0, 10),
            patterns: codeVocab.patterns,
            structures: codeVocab.structures
          }
        }
      };
    } catch (error) {
      this.logger.error('Failed to scan bloc convergence', error.message);
      throw error;
    }
  }

  /**
   * Trouve les intentions historiques "proches"
   */
  findHistoricalIntentions(currentIntention) {
    const matches = [];

    for (const [sessionId, historical] of this.config.historicalIntentions) {
      const distance = this.intentionDistance(
        currentIntention,
        historical.intention
      );

      if (distance < 0.4) {
        matches.push({
          sessionId,
          intention: historical.intention,
          distance,
          convergenceData: historical.convergenceData
        });
      }
    }

    return matches.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Distance entre deux intentions dans l'espace
   */
  intentionDistance(intention1, intention2) {
    const clarityDiff = Math.abs(
      intention1.clarityScore - intention2.clarityScore
    ) / 100;

    const complexityDiff = Math.abs(
      intention1.complexityScore - intention2.complexityScore
    ) / 10;

    const constraintsSim = this.constraints.calculate(
      intention1.constraints,
      intention2.constraints
    );

    const distance = (
      (clarityDiff * 0.3) +
      (complexityDiff * 0.3) +
      ((1 - constraintsSim) * 0.4)
    );

    return Math.min(distance, 1.0);
  }

  /**
   * Test si l'intention historique reconnaît le code généré
   */
  async testPathConvergence(historicalIntention, generatedCode) {
    try {
      const semanticAlignment = await this.semanticAlignment(
        historicalIntention,
        generatedCode
      );

      const codeQuality = await this.analyzeCodeQuality(generatedCode);

      const recognition = {
        semanticScore: semanticAlignment.score,
        qualityScore: codeQuality.score,
        readabilityScore: codeQuality.readability,
        alignmentRatio: semanticAlignment.score / 100
      };

      const convergenceScore = (
        (semanticAlignment.score * 0.5) +
        (codeQuality.score * 0.3) +
        (codeQuality.readability * 0.2)
      );

      return {
        converges: convergenceScore >= 75,
        score: convergenceScore,
        distance: 100 - convergenceScore,
        recognition,
        reasoning: {
          semantic: semanticAlignment.details,
          quality: codeQuality.details
        }
      };
    } catch (error) {
      this.logger.error('Failed to test path convergence', error.message);
      return {
        converges: false,
        score: 0,
        distance: 100,
        recognition: { error: error.message }
      };
    }
  }

  /**
   * Calcule l'alignement sémantique intention ↔ code
   */
  async semanticAlignment(intention, code) {
    try {
      const intentionVocab = this.semantic.extractIntentionVocabulary(intention);
      const codeVocab = this.semantic.extractCodeVocabulary(code);

      return this.semantic.calculateSemanticAlignment(intentionVocab, codeVocab);
    } catch (error) {
      this.logger.error('Failed to calculate semantic alignment', error.message);
      return {
        score: 50,
        vocabularyOverlap: 50,
        domainMatch: 50,
        patternMatch: 50,
        structureMatch: 50,
        details: { error: error.message }
      };
    }
  }

  /**
   * Analyse la qualité du code
   */
  async analyzeCodeQuality(code) {
    try {
      return this.quality.analyze(code);
    } catch (error) {
      this.logger.error('Failed to analyze code quality', error.message);
      return {
        score: 50,
        readability: 50,
        details: { error: error.message }
      };
    }
  }

  /**
   * Interprète la robustesse
   */
  interpretRobustness(robustness) {
    if (robustness.isRobust && robustness.averageScore >= 85) {
      return {
        level: 'ROBUST',
        meaning: 'Code reconnu par multiples intentions indépendantes',
        implication: 'Solution structurellement alignée',
        confidence: 'Haute'
      };
    } else if (robustness.numConvergencePaths >= 1) {
      return {
        level: 'STABLE',
        meaning: 'Code reconnu par au moins une intention indépendante',
        implication: 'Solution probable mais non sur-convergente',
        confidence: 'Moyenne'
      };
    } else {
      return {
        level: 'SINGULAR',
        meaning: 'Code converge avec intention courante uniquement',
        implication: 'Solution peut être trop spécifique',
        confidence: 'À valider'
      };
    }
  }

  /**
   * Recommande une action basée sur la robustesse
   */
  recommendAction(robustness) {
    if (robustness.isRobust) {
      return {
        action: 'ACCEPT_AND_GENERALIZE',
        steps: [
          '✓ Code converge robustement',
          '→ Considère la généralisation',
          '→ Candidate pour npm package'
        ],
        confidence: 'High'
      };
    } else if (robustness.numConvergencePaths >= 1) {
      return {
        action: 'ACCEPT_WITH_DOCUMENTATION',
        steps: [
          '◐ Code converge partiellement',
          '→ Accepte avec assertions claires',
          '→ Document les limites'
        ],
        confidence: 'Medium'
      };
    } else {
      return {
        action: 'REFINE_OR_INVESTIGATE',
        steps: [
          '? Code ne converge qu\'une fois',
          '→ Retour à l\'analyse',
          '→ Explore si trop spécifique'
        ],
        confidence: 'Low'
      };
    }
  }

  /**
   * Enregistre un chemin de convergence pour analyses futures
   */
  recordConvergencePath(sessionId, intention, convergenceData) {
    try {
      this.config.historicalIntentions.set(sessionId, {
        intention,
        convergenceData,
        timestamp: Date.now()
      });

      this.logger.info('Convergence path recorded', {
        sessionId,
        clarity: intention.clarityScore,
        complexity: intention.complexityScore
      });
    } catch (error) {
      this.logger.error('Failed to record convergence path', error.message);
    }
  }

  /**
   * Exporte l'état pour persistance
   */
  async exportState() {
    try {
      const state = {
        timestamp: Date.now(),
        historicalIntentions: Array.from(this.config.historicalIntentions.entries()),
        statistics: {
          totalRecorded: this.config.historicalIntentions.size
        }
      };

      const filePath = path.join(this.config.storageDir, 'bloc-convergence-state.json');
      await fs.writeFile(filePath, JSON.stringify(state, null, 2));

      this.logger.info('State exported', { filePath });
      return state;
    } catch (error) {
      this.logger.error('Failed to export state', error.message);
      throw error;
    }
  }

  /**
   * Importe l'état depuis persistance
   */
  async importState(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const state = JSON.parse(data);

      state.historicalIntentions.forEach(([sessionId, data]) => {
        this.config.historicalIntentions.set(sessionId, data);
      });

      this.logger.info('State imported', {
        filePath,
        recordsLoaded: state.historicalIntentions.length
      });

      return state;
    } catch (error) {
      this.logger.error('Failed to import state', error.message);
      throw error;
    }
  }

  /**
   * Génère un rapport de statistiques
   */
  generateStatistics() {
    const intentions = Array.from(this.config.historicalIntentions.values());

    const clarityScores = intentions.map(i => i.intention.clarityScore);
    const complexityScores = intentions.map(i => i.intention.complexityScore);

    return {
      totalRecorded: intentions.length,
      clarityStats: {
        min: Math.min(...clarityScores, 100),
        max: Math.max(...clarityScores, 0),
        avg: clarityScores.reduce((a, b) => a + b, 0) / Math.max(clarityScores.length, 1)
      },
      complexityStats: {
        min: Math.min(...complexityScores, 10),
        max: Math.max(...complexityScores, 0),
        avg: complexityScores.reduce((a, b) => a + b, 0) / Math.max(complexityScores.length, 1)
      },
      timestamp: Date.now()
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  BlocConvergenceEngine,
  SemanticAnalyzer,
  CodeQualityAnalyzer,
  ConstraintsSimilarity
};

export default BlocConvergenceEngine;
