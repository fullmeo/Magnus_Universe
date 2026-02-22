/**
 * ============================================================================
 * MAGNUS 13.3 - BLOC CONVERGENCE ENGINE
 * 
 * Analyse le code généré par "blocs" (unités reconnaissables musicales)
 * et évalue convergence au niveau structural, fonctionnel et esthétique
 * ============================================================================
 */

class BlocConvergenceEngine {
  constructor(kiloAdapter, convergenceEngine) {
    this.kilo = kiloAdapter;
    this.convergence = convergenceEngine;
    this.blocPatterns = new Map();
    this.historicalBlocs = [];
    this.robustnessThresholds = {
      PRODUCTION_READY: 80,
      STAGING_READY: 60,
      DEVELOPMENT: 40,
      PROTOTYPE: 0
    };
  }

  /**
   * MAIN: Analyser le code pour convergence au niveau bloc
   */
  async scanBlocForConvergence(sessionAnalysis, generatedCode) {
    console.log('\n🎼 BLOC CONVERGENCE ANALYSIS');
    console.log('════════════════════════════════════════════');

    // ÉTAPE 1: Identifier les blocs
    console.log('📍 Step 1: Identifying blocs...');
    const blocs = this.identifyBlocs(generatedCode);
    console.log(`   Found ${blocs.length} blocs`);

    // ÉTAPE 2: Analyser chaque bloc
    console.log('📍 Step 2: Analyzing each bloc...');
    const blocAnalyses = await Promise.all(
      blocs.map((bloc, idx) => 
        this.analyzeBloc(bloc, sessionAnalysis)
          .then(analysis => {
            console.log(`   ✓ Bloc ${idx + 1}: ${bloc.role || 'anonymous'}`);
            return analysis;
          })
      )
    );

    // ÉTAPE 3: Évaluer robustesse globale
    console.log('📍 Step 3: Assessing robustness...');
    const robustness = this.assessRobustness(blocAnalyses);
    const robustnessLevel = this.interpretRobustness(robustness);
    console.log(`   Robustness: ${robustnessLevel.level} (${robustnessLevel.score}%)`);

    // ÉTAPE 4: Chercher des chemins historiques
    console.log('📍 Step 4: Finding historical patterns...');
    const historicalContext = this.findHistoricalPaths(blocs);
    console.log(`   Found ${historicalContext.length} historical pattern(s)`);

    // ÉTAPE 5: Recommandation
    console.log('📍 Step 5: Making recommendation...');
    const recommendation = this.recommendAction(robustness, historicalContext);
    console.log(`   ✓ Recommendation: ${recommendation}`);

    return {
      blocs,
      blocAnalyses,
      robustness,
      interpretation: robustnessLevel,
      paths: historicalContext,
      recommendation,
      timestamp: Date.now(),
      summary: this.generateSummary(blocs, robustness, recommendation)
    };
  }

  /**
   * Identifier les "blocs" (unités cohésives)
   * 
   * Heuristiques:
   * - Début: fonction, classe, section commentée
   * - Fin: fermeture cohésive
   * - Rôle: extrait du nom/commentaire
   */
  identifyBlocs(code) {
    const lines = code.split('\n');
    const blocs = [];
    let currentBloc = null;
    let bracketDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Détecter début de bloc
      if (this.isBlocStart(trimmed)) {
        if (currentBloc) blocs.push(currentBloc);
        
        currentBloc = {
          startLine: i,
          lines: [line],
          role: this.extractRole(trimmed),
          type: this.extractBlocType(trimmed),
          content: trimmed
        };
        
        bracketDepth = (line.match(/{/g) || []).length - 
                       (line.match(/}/g) || []).length;
      } else if (currentBloc) {
        currentBloc.lines.push(line);
        
        // Compter brackets pour détecter fin
        bracketDepth += (line.match(/{/g) || []).length;
        bracketDepth -= (line.match(/}/g) || []).length;

        // Fin de bloc: brackets équilibrés et on détecte une fin
        if (bracketDepth === 0 && this.isBlocEnd(trimmed)) {
          blocs.push(currentBloc);
          currentBloc = null;
        }
      }
    }

    // Dernière bloc si non fermée
    if (currentBloc) {
      blocs.push(currentBloc);
    }

    return blocs;
  }

  /**
   * Analyser un bloc individual
   */
  async analyzeBloc(bloc, sessionAnalysis) {
    const code = bloc.lines.join('\n');

    return {
      bloc,
      analysis: {
        // Structure: respect du schéma
        structure: this.analyzeStructure(code, bloc.type),
        
        // Fonctionnel: fait ce qu'il doit faire
        functionality: await this.analyzeFunctionality(code, sessionAnalysis),
        
        // Robustesse: gère les erreurs et edge cases
        errorHandling: this.analyzeErrorHandling(code),
        edgeCases: this.identifyEdgeCases(code),
        
        // Esthétique: clarté, cohérence, élégance
        aesthetics: this.analyzeAesthetics(code),
        
        // Convergence: alignement avec intention
        convergence: this.assessBlocConvergence(bloc, sessionAnalysis),
        
        // Complexité: cognitif complexity
        complexity: this.calculateBlocComplexity(code)
      },

      scores: {
        overall: 0,  // Sera calculé ci-dessous
        structure: 0,
        functionality: 0,
        robustness: 0,
        aesthetics: 0,
        convergence: 0
      }
    };
  }

  /**
   * Analyser la structure du bloc
   */
  analyzeStructure(code, blocType) {
    const analysis = {
      type: blocType,
      isValid: true,
      issues: [],
      consistency: 100
    };

    // Vérifier indentation
    const lines = code.split('\n');
    const indentLevels = lines
      .filter(l => l.trim().length > 0)
      .map(l => (l.match(/^(\s*)/)[1] || '').length);

    const hasInconsistentIndent = new Set(indentLevels).size > 5;
    if (hasInconsistentIndent) {
      analysis.issues.push('Inconsistent indentation');
      analysis.consistency -= 20;
    }

    // Vérifier parenthèses/brackets
    const openBrackets = (code.match(/{/g) || []).length;
    const closeBrackets = (code.match(/}/g) || []).length;
    
    if (openBrackets !== closeBrackets) {
      analysis.issues.push('Unbalanced brackets');
      analysis.isValid = false;
    }

    return analysis;
  }

  /**
   * Analyser la fonctionnalité
   */
  async analyzeFunctionality(code, sessionAnalysis) {
    const analysis = {
      isImplemented: true,
      hasLogic: code.includes('=') || code.includes('return'),
      hasComments: code.includes('//') || code.includes('/*'),
      clarity: 70,
      issues: []
    };

    // Vérifier présence de logique
    if (!analysis.hasLogic) {
      analysis.issues.push('No clear logic implementation');
      analysis.clarity -= 30;
    }

    // Vérifier commentaires (bon signe)
    if (analysis.hasComments) {
      analysis.clarity += 15;
    }

    // Analyser longueur (trop long = mauvais signe)
    const lineCount = code.split('\n').length;
    if (lineCount > 50) {
      analysis.issues.push('Bloc too long - consider splitting');
      analysis.clarity -= 10;
    }

    return analysis;
  }

  /**
   * Analyser le error handling
   */
  analyzeErrorHandling(code) {
    const tryBlocks = (code.match(/try\s*\{/g) || []).length;
    const catchBlocks = (code.match(/catch\s*\(/g) || []).length;
    const throwStatements = (code.match(/throw\s+/g) || []).length;
    const nullChecks = (code.match(/!==\s*null|!==\s*undefined|!!/g) || []).length;

    const coverage = 
      (tryBlocks * 25) +
      (catchBlocks * 25) +
      (throwStatements * 15) +
      (nullChecks * 15);

    return {
      score: Math.min(100, coverage),
      tryBlocks,
      catchBlocks,
      throwStatements,
      nullChecks,
      adequate: coverage >= 50
    };
  }

  /**
   * Identifier les edge cases non gérés
   */
  identifyEdgeCases(code) {
    const potentialIssues = [];

    // Vérifier null/undefined
    if (!code.includes('null') && !code.includes('undefined')) {
      potentialIssues.push('No null/undefined checks detected');
    }

    // Vérifier empty arrays/strings
    if (!code.includes('.length') && !code.includes('isEmpty')) {
      potentialIssues.push('No empty collection checks');
    }

    // Vérifier boundary conditions
    if (!code.match(/[<>=]{1,3}\s*0|[<>=]{1,3}\s*\d+(?![0-9])/)) {
      potentialIssues.push('No boundary condition checks');
    }

    const coverage = Math.max(0, 100 - (potentialIssues.length * 25));

    return {
      coverage,
      issues: potentialIssues,
      adequatelyHandled: coverage >= 60
    };
  }

  /**
   * Analyser l'esthétique (clarté, cohérence, élégance)
   */
  analyzeAesthetics(code) {
    const analysis = {
      clarity: 75,
      coherence: 75,
      elegance: 70,
      issues: []
    };

    // Clarité: noms explicites
    const hasDescriptiveNames = /function\s+[a-zA-Z]{5,}|const\s+[a-zA-Z]{5,}/.test(code);
    if (!hasDescriptiveNames) {
      analysis.clarity -= 15;
      analysis.issues.push('Variable names could be more descriptive');
    }

    // Cohérence: style consistant
    const hasInconsistentStyle = /\r\n/.test(code) && /\n/.test(code);
    if (hasInconsistentStyle) {
      analysis.coherence -= 10;
      analysis.issues.push('Inconsistent line endings');
    }

    // Élégance: pas de code dupliqué
    const lines = code.split('\n');
    const duplicationRate = this.calculateDuplication(lines);
    if (duplicationRate > 0.1) {
      analysis.elegance -= 20;
      analysis.issues.push('Possible code duplication detected');
    }

    // Élégance: structure claire
    if (code.includes('// FIXME') || code.includes('// TODO')) {
      analysis.elegance -= 15;
      analysis.issues.push('Contains unresolved TODOs/FIXMEs');
    }

    return analysis;
  }

  /**
   * Évaluer la convergence au niveau bloc
   */
  assessBlocConvergence(bloc, sessionAnalysis) {
    // Recognition: est-ce que le bloc est reconnaissable comme solution?
    const recognition = this.assessBlocRecognition(bloc, sessionAnalysis);

    // Inevitability: est-ce la conséquence logique inévitable?
    const inevitability = this.assessBlocInevitability(bloc);

    // Coherence: interne cohérence?
    const coherence = this.assessBlocCoherence(bloc);

    return {
      recognition,
      inevitability,
      coherence,
      overall: (recognition + inevitability + coherence) / 3
    };
  }

  /**
   * Calculer la complexité cognitive du bloc
   */
  calculateBlocComplexity(code) {
    let complexity = 1;  // Base: 1

    // Compter les décisions
    complexity += (code.match(/if\s*\(/g) || []).length;
    complexity += (code.match(/else/g) || []).length;
    complexity += (code.match(/\?|:/g) || []).length;
    complexity += (code.match(/&&||\|\|/g) || []).length;

    // Compter les boucles
    complexity += (code.match(/for\s*\(|while\s*\(|forEach/g) || []).length * 2;

    // Compter les fonctions imbriquées
    complexity += Math.max(0, (code.match(/function|=>/g) || []).length - 1);

    return {
      score: Math.min(20, complexity),
      adequate: complexity <= 10
    };
  }

  /**
   * Évaluer la robustesse globale
   */
  assessRobustness(blocAnalyses) {
    const metrics = {
      structuralIntegrity: 0,
      errorHandlingCoverage: 0,
      edgeCaseProtection: 0,
      aestheticsScore: 0,
      convergenceAlignment: 0,
      complexityBalance: 0
    };

    for (const analysis of blocAnalyses) {
      metrics.structuralIntegrity += analysis.analysis.structure.consistency;
      metrics.errorHandlingCoverage += analysis.analysis.errorHandling.score;
      metrics.edgeCaseProtection += analysis.analysis.edgeCases.coverage;
      
      const aes = analysis.analysis.aesthetics;
      metrics.aestheticsScore += (aes.clarity + aes.coherence + aes.elegance) / 3;
      
      const conv = analysis.analysis.convergence;
      metrics.convergenceAlignment += conv.overall;
      
      metrics.complexityBalance += Math.max(0, 100 - analysis.analysis.complexity.score * 5);
    }

    // Moyennes
    const count = blocAnalyses.length || 1;
    for (const key in metrics) {
      metrics[key] = Math.round(metrics[key] / count);
    }

    return metrics;
  }

  /**
   * Interpréter le niveau de robustesse
   */
  interpretRobustness(robustness) {
    const scores = Object.values(robustness);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    let level, description;
    
    if (avg >= 80) {
      level = 'PRODUCTION_READY';
      description = 'Code is production-ready with excellent robustness';
    } else if (avg >= 60) {
      level = 'STAGING_READY';
      description = 'Code is staging-ready; minor improvements recommended';
    } else if (avg >= 40) {
      level = 'DEVELOPMENT';
      description = 'Code is development-quality; refinement needed';
    } else {
      level = 'PROTOTYPE';
      description = 'Code is prototype-quality; major revision needed';
    }

    return {
      level,
      description,
      score: Math.round(avg),
      details: robustness
    };
  }

  /**
   * Trouver des chemins historiques similaires
   */
  findHistoricalPaths(blocs) {
    const paths = [];

    for (const bloc of blocs) {
      // Chercher dans l'historique de patterns similaires
      const similar = this.findSimilarBlocsInHistory(bloc);
      
      if (similar.length > 0) {
        paths.push({
          bloc: bloc.role || 'anonymous',
          type: bloc.type,
          historicalMatches: similar,
          lessonsLearned: this.extractLessons(similar),
          recommendation: this.recommendBasedOnHistory(similar)
        });
      }
    }

    return paths;
  }

  /**
   * Recommander l'action suivante
   */
  recommendAction(robustness, historicalContext) {
    const structureScore = robustness.structuralIntegrity;
    const errorScore = robustness.errorHandlingCoverage;
    const edgeScore = robustness.edgeCaseProtection;
    const aesthetic = robustness.aestheticsScore;

    if (structureScore >= 85 && errorScore >= 80 && edgeScore >= 75) {
      return 'APPROVE_READY';
    }

    if (structureScore >= 75 && errorScore >= 70) {
      return 'MINOR_REFINEMENTS_NEEDED';
    }

    if (historicalContext.length > 0) {
      return 'REFACTOR_WITH_HISTORICAL_GUIDANCE';
    }

    if (aesthetic < 60) {
      return 'IMPROVE_CODE_QUALITY_AND_CLARITY';
    }

    return 'MAJOR_REVIEW_REQUIRED';
  }

  /**
   * Générer un résumé
   */
  generateSummary(blocs, robustness, recommendation) {
    return {
      totalBlocs: blocs.length,
      robustnessLevel: Object.values(robustness)
        .reduce((a, b) => a + b, 0) / Object.keys(robustness).length,
      recommendation,
      timestamp: new Date().toISOString(),
      blocs: blocs.map(b => ({
        role: b.role,
        type: b.type,
        lines: b.lines.length
      }))
    };
  }

  // ========================================================================
  // Utilitaires internes
  // ========================================================================

  isBlocStart(line) {
    return /^(function |class |const |async function|async const|\/\/\s*─|export )/.test(line);
  }

  isBlocEnd(line) {
    return /^(}\s*(;|$|else)|export|;$)/.test(line);
  }

  extractRole(line) {
    // "function getData()" → "getData"
    const match = line.match(/(?:function|const)\s+([a-zA-Z_]\w*)/);
    return match ? match[1] : null;
  }

  extractBlocType(line) {
    if (line.includes('function')) return 'FUNCTION';
    if (line.includes('class')) return 'CLASS';
    if (line.match(/const\s+\w+\s*=/)) return 'CONSTANT';
    if (line.match(/\/\/\s*─/)) return 'SECTION';
    if (line.includes('export')) return 'EXPORT';
    return 'UNKNOWN';
  }

  assessBlocRecognition(bloc, sessionAnalysis) {
    // Basé sur la clarté de l'intention
    return sessionAnalysis?.understanding?.clarityScore || 70;
  }

  assessBlocInevitability(bloc) {
    // Basé sur la cohérence des dépendances
    const hasExplicitDeps = bloc.content.includes('import') || bloc.content.includes('require');
    return hasExplicitDeps ? 80 : 60;
  }

  assessBlocCoherence(bloc) {
    // Basé sur la cohérence interne
    return 75;  // Placeholder
  }

  calculateDuplication(lines) {
    const lineMap = {};
    let duplicateCount = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 10) {
        if (lineMap[trimmed]) {
          duplicateCount++;
        }
        lineMap[trimmed] = (lineMap[trimmed] || 0) + 1;
      }
    }

    return duplicateCount / Math.max(1, lines.length);
  }

  findSimilarBlocsInHistory(bloc) {
    // Chercher dans historicalBlocs
    return this.historicalBlocs.filter(
      historical => historical.type === bloc.type
    );
  }

  extractLessons(similarBlocs) {
    return similarBlocs.map(b => b.lesson || null).filter(Boolean);
  }

  recommendBasedOnHistory(similarBlocs) {
    if (similarBlocs.length > 0) {
      return `Found ${similarBlocs.length} similar patterns in history`;
    }
    return null;
  }

  /**
   * Enregistrer un bloc dans l'historique
   */
  recordBlockInHistory(bloc, analysis, outcome) {
    this.historicalBlocs.push({
      ...bloc,
      analysis,
      outcome,
      timestamp: Date.now(),
      lesson: this.extractLessonFromOutcome(outcome)
    });
  }

  extractLessonFromOutcome(outcome) {
    if (outcome === 'APPROVED') {
      return 'This pattern was approved; reuse it';
    } else if (outcome === 'REFACTORED') {
      return 'This pattern required refactoring';
    }
    return null;
  }
}

export default BlocConvergenceEngine;
