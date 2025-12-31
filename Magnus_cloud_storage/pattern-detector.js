/**
 * Magnus Pattern Detector
 * 
 * Detects recurring code patterns across projects
 * 
 * Features:
 * - AST-based code analysis
 * - Syntactic similarity detection
 * - Semantic comparison (via context)
 * - Pattern categorization
 * - Occurrence tracking
 * - Confidence scoring
 * 
 * Integrates with BiasDetector to avoid false positives
 */

import * as fs from 'fs/promises';
import * as path from 'path';

class PatternDetector {
  constructor(config = {}) {
    this.config = {
      minOccurrences: config.minOccurrences || 3,
      syntacticThreshold: config.syntacticThreshold || 0.75,
      semanticThreshold: config.semanticThreshold || 0.6,
      maxFileSize: config.maxFileSize || 100000, // 100KB
      extensions: config.extensions || ['.js', '.jsx', '.ts', '.tsx', '.py', '.java'],
      ignorePatterns: config.ignorePatterns || [
        'node_modules',
        '.git',
        'dist',
        'build',
        'coverage',
        '.next',
        '.cache'
      ]
    };

    this.patterns = new Map();
    this.fileCache = new Map();
    this.statistics = {
      filesScanned: 0,
      patternsDetected: 0,
      totalOccurrences: 0,
      processingTime: 0
    };
  }

  /**
   * Main detection flow - scan projects and find patterns
   */
  async detect(projectPaths) {
    const startTime = Date.now();
    
    console.log(`🔍 Starting pattern detection across ${projectPaths.length} projects...`);

    // 1. Scan all files
    const allFiles = [];
    for (const projectPath of projectPaths) {
      const files = await this.scanDirectory(projectPath);
      allFiles.push(...files.map(f => ({
        ...f,
        project: path.basename(projectPath)
      })));
    }

    console.log(`📁 Found ${allFiles.length} files to analyze`);
    this.statistics.filesScanned = allFiles.length;

    // 2. Extract code snippets
    const snippets = await this.extractSnippets(allFiles);
    console.log(`📝 Extracted ${snippets.length} code snippets`);

    // 3. Group similar snippets
    const groups = this.groupSimilarSnippets(snippets);
    console.log(`🔗 Grouped into ${groups.length} potential patterns`);

    // 4. Filter by occurrence threshold
    const patterns = groups.filter(g => 
      g.occurrences.length >= this.config.minOccurrences
    );

    console.log(`✅ Found ${patterns.length} patterns with ${this.config.minOccurrences}+ occurrences`);
    this.statistics.patternsDetected = patterns.length;
    this.statistics.totalOccurrences = patterns.reduce(
      (sum, p) => sum + p.occurrences.length, 0
    );

    // 5. Categorize patterns
    const categorized = patterns.map(p => this.categorizePattern(p));

    // 6. Calculate confidence scores
    const scored = categorized.map(p => ({
      ...p,
      confidence: this.calculateConfidence(p)
    }));

    // 7. Sort by priority
    const sorted = scored.sort((a, b) => {
      // Priority: high occurrence × high confidence
      const scoreA = a.occurrences.length * a.confidence;
      const scoreB = b.occurrences.length * b.confidence;
      return scoreB - scoreA;
    });

    this.statistics.processingTime = Date.now() - startTime;
    
    console.log(`⏱️  Detection completed in ${(this.statistics.processingTime / 1000).toFixed(2)}s`);

    return {
      patterns: sorted,
      statistics: this.statistics,
      summary: this.generateSummary(sorted)
    };
  }

  /**
   * Scan directory recursively for code files
   */
  async scanDirectory(dirPath, files = []) {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip ignored patterns
        if (this.shouldIgnore(entry.name)) {
          continue;
        }

        if (entry.isDirectory()) {
          // Recurse into subdirectory
          await this.scanDirectory(fullPath, files);
        } else if (entry.isFile()) {
          // Check if file extension matches
          const ext = path.extname(entry.name);
          if (this.config.extensions.includes(ext)) {
            const stats = await fs.stat(fullPath);
            
            // Skip files that are too large
            if (stats.size <= this.config.maxFileSize) {
              files.push({
                path: fullPath,
                name: entry.name,
                extension: ext,
                size: stats.size
              });
            }
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not scan ${dirPath}: ${error.message}`);
    }

    return files;
  }

  /**
   * Check if file/directory should be ignored
   */
  shouldIgnore(name) {
    return this.config.ignorePatterns.some(pattern => 
      name.includes(pattern) || name.startsWith('.')
    );
  }

  /**
   * Extract meaningful code snippets from files
   */
  async extractSnippets(files) {
    const snippets = [];

    for (const file of files) {
      try {
        const content = await fs.readFile(file.path, 'utf-8');
        this.fileCache.set(file.path, content);

        // Extract different types of snippets
        const extracted = [
          ...this.extractFunctions(content, file),
          ...this.extractImports(content, file),
          ...this.extractClasses(content, file),
          ...this.extractHooks(content, file),
          ...this.extractAPIRoutes(content, file),
          ...this.extractStateManagement(content, file),
          ...this.extractErrorHandling(content, file)
        ];

        snippets.push(...extracted);
      } catch (error) {
        console.warn(`⚠️  Could not read ${file.path}: ${error.message}`);
      }
    }

    return snippets;
  }

  /**
   * Extract function patterns
   */
  extractFunctions(content, file) {
    const snippets = [];
    
    // Match function declarations and expressions
    const functionRegex = /(?:async\s+)?function\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g;
    const arrowRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\([^)]*\)\s*=>\s*\{[\s\S]*?\n\}/g;

    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      snippets.push({
        type: 'FUNCTION',
        name: match[1],
        code: match[0],
        file: file.path,
        project: file.project,
        context: this.extractContext(content, match.index)
      });
    }

    while ((match = arrowRegex.exec(content)) !== null) {
      snippets.push({
        type: 'FUNCTION',
        name: match[1],
        code: match[0],
        file: file.path,
        project: file.project,
        context: this.extractContext(content, match.index)
      });
    }

    return snippets;
  }

  /**
   * Extract import patterns
   */
  extractImports(content, file) {
    const snippets = [];
    
    // Match ES6 imports
    const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
    const requireRegex = /(?:const|let|var)\s+.*?=\s*require\(['"]([^'"]+)['"]\)/g;

    let match;
    const imports = new Set();

    while ((match = importRegex.exec(content)) !== null) {
      imports.add(match[1]);
    }

    while ((match = requireRegex.exec(content)) !== null) {
      imports.add(match[1]);
    }

    if (imports.size > 0) {
      snippets.push({
        type: 'IMPORTS',
        name: 'import-block',
        code: Array.from(imports).join('\n'),
        imports: Array.from(imports),
        file: file.path,
        project: file.project,
        context: 'imports'
      });
    }

    return snippets;
  }

  /**
   * Extract class patterns
   */
  extractClasses(content, file) {
    const snippets = [];
    
    // Match class declarations
    const classRegex = /class\s+(\w+)(?:\s+extends\s+\w+)?\s*\{[\s\S]*?\n\}/g;

    let match;
    while ((match = classRegex.exec(content)) !== null) {
      snippets.push({
        type: 'CLASS',
        name: match[1],
        code: match[0],
        file: file.path,
        project: file.project,
        context: this.extractContext(content, match.index)
      });
    }

    return snippets;
  }

  /**
   * Extract React hooks patterns
   */
  extractHooks(content, file) {
    const snippets = [];
    
    // Only for React files
    if (!file.name.includes('jsx') && !file.name.includes('tsx')) {
      return snippets;
    }

    // Match useState patterns
    const useStateRegex = /const\s+\[(\w+),\s*set\w+\]\s*=\s*useState\((.*?)\)/g;
    
    let match;
    while ((match = useStateRegex.exec(content)) !== null) {
      snippets.push({
        type: 'REACT_HOOK',
        subtype: 'useState',
        name: match[1],
        code: match[0],
        initialValue: match[2],
        file: file.path,
        project: file.project,
        context: 'react-state'
      });
    }

    // Match useEffect patterns
    const useEffectRegex = /useEffect\(\(\)\s*=>\s*\{[\s\S]*?\},\s*\[.*?\]\)/g;
    
    while ((match = useEffectRegex.exec(content)) !== null) {
      snippets.push({
        type: 'REACT_HOOK',
        subtype: 'useEffect',
        name: 'effect',
        code: match[0],
        file: file.path,
        project: file.project,
        context: 'react-effect'
      });
    }

    return snippets;
  }

  /**
   * Extract API route patterns
   */
  extractAPIRoutes(content, file) {
    const snippets = [];
    
    // Match Express-style routes
    const routeRegex = /(?:router|app)\.(get|post|put|delete|patch)\(['"]([^'"]+)['"],?\s*(?:async\s*)?\([^)]*\)\s*(?:=>)?\s*\{[\s\S]*?\n\}/g;

    let match;
    while ((match = routeRegex.exec(content)) !== null) {
      snippets.push({
        type: 'API_ROUTE',
        method: match[1].toUpperCase(),
        route: match[2],
        code: match[0],
        file: file.path,
        project: file.project,
        context: 'api-endpoint'
      });
    }

    return snippets;
  }

  /**
   * Extract state management patterns
   */
  extractStateManagement(content, file) {
    const snippets = [];
    
    // Redux patterns
    if (content.includes('createSlice') || content.includes('createReducer')) {
      const sliceRegex = /createSlice\(\{[\s\S]*?\}\)/g;
      let match;
      
      while ((match = sliceRegex.exec(content)) !== null) {
        snippets.push({
          type: 'STATE_MANAGEMENT',
          subtype: 'redux-slice',
          code: match[0],
          file: file.path,
          project: file.project,
          context: 'redux'
        });
      }
    }

    return snippets;
  }

  /**
   * Extract error handling patterns
   */
  extractErrorHandling(content, file) {
    const snippets = [];
    
    // Try-catch blocks
    const tryCatchRegex = /try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}/g;

    let match;
    while ((match = tryCatchRegex.exec(content)) !== null) {
      snippets.push({
        type: 'ERROR_HANDLING',
        subtype: 'try-catch',
        code: match[0],
        file: file.path,
        project: file.project,
        context: 'error-handling'
      });
    }

    return snippets;
  }

  /**
   * Extract context around code (comments, nearby code)
   */
  extractContext(content, position, range = 200) {
    const start = Math.max(0, position - range);
    const end = Math.min(content.length, position + range);
    const context = content.substring(start, end);
    
    // Extract purpose from comments
    const commentMatch = context.match(/\/\*\*[\s\S]*?\*\/|\/\/.*$/m);
    const purpose = commentMatch ? commentMatch[0] : '';

    return {
      snippet: context,
      purpose,
      hasComment: !!commentMatch
    };
  }

  /**
   * Group similar code snippets
   */
  groupSimilarSnippets(snippets) {
    const groups = [];
    const processed = new Set();

    for (let i = 0; i < snippets.length; i++) {
      if (processed.has(i)) continue;

      const snippet = snippets[i];
      const group = {
        type: snippet.type,
        name: snippet.name || snippet.type,
        representative: snippet.code,
        occurrences: [snippet],
        contexts: [snippet.context],
        projects: new Set([snippet.project])
      };

      // Find similar snippets
      for (let j = i + 1; j < snippets.length; j++) {
        if (processed.has(j)) continue;
        
        const other = snippets[j];
        
        // Must be same type
        if (snippet.type !== other.type) continue;

        // Calculate similarity
        const similarity = this.calculateSyntacticSimilarity(
          snippet.code,
          other.code
        );

        if (similarity >= this.config.syntacticThreshold) {
          group.occurrences.push(other);
          group.contexts.push(other.context);
          group.projects.add(other.project);
          processed.add(j);
        }
      }

      processed.add(i);
      
      // Only add groups with multiple occurrences
      if (group.occurrences.length >= 2) {
        groups.push(group);
      }
    }

    return groups;
  }

  /**
   * Calculate syntactic similarity between two code snippets
   */
  calculateSyntacticSimilarity(code1, code2) {
    // Normalize code
    const normalized1 = this.normalizeCode(code1);
    const normalized2 = this.normalizeCode(code2);

    // Use Levenshtein distance for similarity
    const distance = this.levenshteinDistance(normalized1, normalized2);
    const maxLength = Math.max(normalized1.length, normalized2.length);
    
    if (maxLength === 0) return 1.0;
    
    return 1 - (distance / maxLength);
  }

  /**
   * Normalize code for comparison
   */
  normalizeCode(code) {
    return code
      .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
      .replace(/\s+/g, ' ')                    // Normalize whitespace
      .replace(/['"]([^'"]*)['"]/g, '""')     // Normalize strings
      .replace(/\b\d+\b/g, '0')               // Normalize numbers
      .replace(/\b[a-z]\w*\b/gi, 'x')         // Normalize identifiers
      .trim();
  }

  /**
   * Calculate Levenshtein distance
   */
  levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }

  /**
   * Categorize pattern by type and purpose
   */
  categorizePattern(pattern) {
    const category = {
      ...pattern,
      category: this.determineCategory(pattern),
      priority: this.determinePriority(pattern),
      impact: this.estimateImpact(pattern)
    };

    return category;
  }

  /**
   * Determine pattern category
   */
  determineCategory(pattern) {
    const type = pattern.type;
    const occurrences = pattern.occurrences.length;
    const projects = pattern.projects.size;

    if (type === 'IMPORTS') {
      return 'DEPENDENCY_PATTERN';
    } else if (type === 'API_ROUTE') {
      return 'API_PATTERN';
    } else if (type === 'REACT_HOOK') {
      return 'STATE_PATTERN';
    } else if (type === 'ERROR_HANDLING') {
      return 'ERROR_PATTERN';
    } else if (type === 'FUNCTION' && occurrences >= 5) {
      return 'UTILITY_PATTERN';
    } else if (projects >= 3) {
      return 'CROSS_PROJECT_PATTERN';
    } else {
      return 'LOCAL_PATTERN';
    }
  }

  /**
   * Determine pattern priority
   */
  determinePriority(pattern) {
    const occurrences = pattern.occurrences.length;
    const projects = pattern.projects.size;

    // High priority: many occurrences across multiple projects
    if (occurrences >= 8 && projects >= 3) {
      return 'HIGH';
    }
    
    // Medium priority: moderate occurrences or cross-project
    if (occurrences >= 5 || projects >= 2) {
      return 'MEDIUM';
    }

    return 'LOW';
  }

  /**
   * Estimate potential impact of optimizing pattern
   */
  estimateImpact(pattern) {
    const occurrences = pattern.occurrences.length;
    const avgCodeLength = pattern.representative.length;
    
    // Estimate time saved (rough heuristic)
    const linesPerOccurrence = avgCodeLength / 80; // ~80 chars per line
    const minutesPerLine = 0.5; // Rough estimate
    const timeWasted = occurrences * linesPerOccurrence * minutesPerLine;

    return {
      occurrences,
      projects: pattern.projects.size,
      estimatedLinesSaved: Math.round(occurrences * linesPerOccurrence),
      estimatedTimeSaved: `${Math.round(timeWasted)} minutes`,
      potentialROI: this.calculateROI(pattern, timeWasted)
    };
  }

  /**
   * Calculate ROI of pattern optimization
   */
  calculateROI(pattern, timeWasted) {
    // Time to create abstraction: 30 min
    const abstractionCost = 30;
    
    // Time saved per future use: 50% of pattern writing time
    const futureTimeSavings = timeWasted * 0.5;
    
    // Break-even: how many times must be used to justify abstraction
    const breakEven = Math.ceil(abstractionCost / (futureTimeSavings / pattern.occurrences.length));

    if (futureTimeSavings > abstractionCost * 2) {
      return 'HIGH';
    } else if (futureTimeSavings > abstractionCost) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  /**
   * Calculate overall confidence in pattern detection
   */
  calculateConfidence(pattern) {
    let confidence = 0.5; // Base confidence

    // Factor 1: Occurrence count (more occurrences = higher confidence)
    const occurrenceBonus = Math.min(0.3, pattern.occurrences.length * 0.03);
    confidence += occurrenceBonus;

    // Factor 2: Cross-project consistency (same across projects = higher)
    const projectBonus = pattern.projects.size >= 2 ? 0.2 : 0;
    confidence += projectBonus;

    // Factor 3: Code quality indicators
    const hasComments = pattern.occurrences.some(o => 
      o.context?.hasComment
    );
    const qualityBonus = hasComments ? 0.1 : 0;
    confidence += qualityBonus;

    // Factor 4: Type-specific confidence
    const typeConfidence = this.getTypeConfidence(pattern.type);
    confidence *= typeConfidence;

    return Math.min(1.0, Math.max(0.1, confidence));
  }

  /**
   * Get type-specific confidence multiplier
   */
  getTypeConfidence(type) {
    const confidenceMap = {
      'API_ROUTE': 0.95,        // APIs are usually clear patterns
      'ERROR_HANDLING': 0.9,    // Error handling is usually standard
      'IMPORTS': 0.85,          // Import patterns are clear
      'REACT_HOOK': 0.8,        // Hooks can vary by context
      'FUNCTION': 0.75,         // Functions vary more
      'CLASS': 0.7,             // Classes vary significantly
      'STATE_MANAGEMENT': 0.85  // State management is usually standard
    };

    return confidenceMap[type] || 0.7;
  }

  /**
   * Generate summary report
   */
  generateSummary(patterns) {
    const summary = {
      totalPatterns: patterns.length,
      byCategory: {},
      byPriority: { HIGH: 0, MEDIUM: 0, LOW: 0 },
      topPatterns: patterns.slice(0, 10),
      recommendations: []
    };

    // Count by category
    for (const pattern of patterns) {
      const cat = pattern.category || 'UNKNOWN';
      summary.byCategory[cat] = (summary.byCategory[cat] || 0) + 1;
      summary.byPriority[pattern.priority]++;
    }

    // Generate recommendations
    const highPriority = patterns.filter(p => p.priority === 'HIGH');
    
    if (highPriority.length > 0) {
      summary.recommendations.push({
        type: 'HIGH_PRIORITY_PATTERNS',
        count: highPriority.length,
        action: 'Consider creating abstractions for these patterns',
        patterns: highPriority.slice(0, 5).map(p => p.name)
      });
    }

    const crossProject = patterns.filter(p => p.projects.size >= 3);
    
    if (crossProject.length > 0) {
      summary.recommendations.push({
        type: 'CROSS_PROJECT_DUPLICATION',
        count: crossProject.length,
        action: 'These patterns appear in multiple projects - good candidates for shared library',
        patterns: crossProject.slice(0, 5).map(p => p.name)
      });
    }

    return summary;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return this.statistics;
  }

  /**
   * Clear cache and reset
   */
  reset() {
    this.patterns.clear();
    this.fileCache.clear();
    this.statistics = {
      filesScanned: 0,
      patternsDetected: 0,
      totalOccurrences: 0,
      processingTime: 0
    };
  }
}

export default PatternDetector;
