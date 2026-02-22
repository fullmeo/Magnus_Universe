// src/gateway/router/convergence/magnus-patterns.ts
// Magnus 14/15 Pattern Recognition Engine
// Détecte patterns d'auto-réflexion, spirales, harmonie cognitive
// Feedback thérapeutique pour orchestration consciente

/**
 * Énumération des patterns Magnus 14/15
 * Source: Serigne DIAGNE - Meta-Developer / Magnus 14 Manifesto + Magnus 15 Evolution
 */
export enum MagnusPatternEnum {
  // === MAGNUS 14: Externalisation de l'interne ===
  SPIRALE_CLARIFICATION = 'SPIRALE_CLARIFICATION',
  APPRENTISSAGE_CONSTRUCTION = 'APPRENTISSAGE_CONSTRUCTION',
  DOMAINE_OVER_TECH = 'DOMAINE_OVER_TECH',
  CHANCE_VS_COMPETENCE = 'CHANCE_VS_COMPETENCE',
  CHAOS_INTERNE = 'CHAOS_INTERNE',

  // === MAGNUS 15: Auto-réflexion et harmonie cognitive ===
  AUTO_REFLEXION = 'AUTO_REFLEXION',
  FEEDBACK_ITERATIF = 'FEEDBACK_ITERATIF',
  HARMONIE_COGNITIVE = 'HARMONIE_COGNITIVE',
  INCERTITUDE_REDUITE = 'INCERTITUDE_REDUITE',
  CONSCIENCE_RECURSIVE = 'CONSCIENCE_RECURSIVE',
}

/**
 * Definition d'un pattern Magnus
 */
export interface MagnusPatternDefinition {
  name: MagnusPatternEnum;
  origin: string;              // Citation ou principe originel
  type: 'positif' | 'anti';    // Boost ou pénalité
  weight: number;              // Impact sur score (0.15 à 0.40)
  magnitude: 'MAJOREUR' | 'MINEUR' | 'CRITIQUE';
  description: string;
  indicators: string[];        // Heuristiques de détection
  therapeuticMessage: string;  // Message d'insight
  manifestoReference?: string; // Référence dans manifesto
}

/**
 * Résultat de détection de patterns Magnus
 */
export interface MagnusPatternDetectionResult {
  patterns: string[];          // Patterns détectés
  adjustment: number;          // Score adjustment (-0.7 à +0.7)
  therapeuticInsight: string;  // Message d'insight humanisé
  patterns_detailed: {
    name: string;
    type: 'positif' | 'anti';
    weight: number;
    reason: string;            // Pourquoi ce pattern a été détecté
  }[];
  harmonyScore: number;        // 0-1: cohérence des patterns entre eux
  confidenceLevel: 'FAIBLE' | 'MOYEN' | 'FORT';
}

/**
 * Catalogue complet des patterns Magnus 14/15
 */
export const MAGNUS_PATTERNS_CATALOG: MagnusPatternDefinition[] = [
  // ===== MAGNUS 14: EXTERNALISATION =====

  {
    name: MagnusPatternEnum.SPIRALE_CLARIFICATION,
    origin: 'Je spirale pour clarifier',
    type: 'anti',
    weight: 0.35,
    magnitude: 'MAJOREUR',
    description:
      'Code looping/nested logic complexe - tentative de clarifier par couches instead de simp',
    indicators: [
      'long file (>700 LOC)',
      'nested loops (>3 levels)',
      'while/for count > 6',
      'high cyclomatic complexity',
      'unclear error recovery',
    ],
    therapeuticMessage:
      'Spirale détectée: Le code montre une tentative de clarifier par des couches au lieu de simplification directe. Considérez la réfactorisation.',
    manifestoReference: 'Magnus 14 - Externalisation: Recognition of internal spirals',
  },

  {
    name: MagnusPatternEnum.APPRENTISSAGE_CONSTRUCTION,
    origin: 'J\'apprends en construisant',
    type: 'positif',
    weight: 0.25,
    magnitude: 'MINEUR',
    description:
      'Code qui montre apprentissage itératif (prototypes, refactoring progressif)',
    indicators: [
      'contains "prototype" or "MVP"',
      'iterative structure visible',
      'refactoring comments',
      'gradual feature addition',
      'test-driven approach',
    ],
    therapeuticMessage:
      'Apprentissage en construction détecté: Code montre évolution progressive. Approche saine et expérimentale.',
    manifestoReference: 'Magnus 14 - Learning through building paradigm',
  },

  {
    name: MagnusPatternEnum.DOMAINE_OVER_TECH,
    origin: 'Le domaine importe plus que la tech',
    type: 'positif',
    weight: 0.20,
    magnitude: 'MINEUR',
    description:
      'Code prioritisant logique métier clarity sur optimisations techniques',
    indicators: [
      'clear business logic separation',
      'domain-driven naming',
      'minimal premature optimization',
      'readable over clever',
      'business rules explicit',
    ],
    therapeuticMessage:
      'Priorité au domaine détectée: Code place logique métier au centre. Architecture sensée.',
    manifestoReference: 'Magnus 14 - Domain-first thinking principle',
  },

  {
    name: MagnusPatternEnum.CHANCE_VS_COMPETENCE,
    origin: 'Est-ce réel ou juste de la chance ?',
    type: 'anti',
    weight: 0.30,
    magnitude: 'MAJOREUR',
    description:
      'Code without validation/testing - uncertain if it actually works or just lucky',
    indicators: [
      'no unit tests',
      'no assertions',
      'no input validation',
      'no edge case handling',
      'lucky error cases passing',
    ],
    therapeuticMessage:
      'Incertitude détectée: Code semble fonctionner mais manque de preuves formelles. Ajoutez tests/assertions.',
    manifestoReference: 'Magnus 14 - Distinction entre chance et compétence',
  },

  {
    name: MagnusPatternEnum.CHAOS_INTERNE,
    origin: 'Anxiété: chaos ou pattern ?',
    type: 'anti',
    weight: 0.40,
    magnitude: 'CRITIQUE',
    description:
      'Code showing internal anxiety/chaos: unclear intent, inconsistent patterns, no coherence',
    indicators: [
      'inconsistent naming',
      'mixed architectures',
      'unclear intent',
      'silent error handling',
      'no clear structure',
    ],
    therapeuticMessage:
      'Chaos interne détecté: Code montre manque de clarté structurelle. Recommandez restructuration.',
    manifestoReference: 'Magnus 14 - Internal chaos recognition and externalisation',
  },

  // ===== MAGNUS 15: AUTO-RÉFLEXION ET HARMONIE =====

  {
    name: MagnusPatternEnum.AUTO_REFLEXION,
    origin: 'Dialogue structuré avec soi-même',
    type: 'positif',
    weight: 0.30,
    magnitude: 'MAJOREUR',
    description:
      'Code showing self-reflection: logging, debugging hooks, introspection capabilities',
    indicators: [
      'logging present',
      'debug modes',
      'reflection APIs',
      'introspection hooks',
      'stack traces preserved',
      'audit trails',
    ],
    therapeuticMessage:
      'Auto-réflexion détectée: Code peut se regarder soi-même (logs, debug). Capacité réflexive présente.',
    manifestoReference: 'Magnus 15 - Conscience réflexive et auto-dialogue',
  },

  {
    name: MagnusPatternEnum.FEEDBACK_ITERATIF,
    origin: 'Boucle d\'apprentissage sur patterns passés',
    type: 'positif',
    weight: 0.25,
    magnitude: 'MINEUR',
    description:
      'Code incorporating learning from previous iterations: metrics, feedback loops, adaptive behavior',
    indicators: [
      'metrics collection',
      'feedback mechanisms',
      'adaptive algorithms',
      'learning from history',
      'version/iteration tracking',
    ],
    therapeuticMessage:
      'Feedback itératif détecté: Code apprend de ses exécutions précédentes. Boucle d\'amélioration active.',
    manifestoReference: 'Magnus 15 - Iterative learning and feedback loops',
  },

  {
    name: MagnusPatternEnum.HARMONIE_COGNITIVE,
    origin: 'Patterns alignés sans conflit interne',
    type: 'positif',
    weight: 0.35,
    magnitude: 'MAJOREUR',
    description:
      'Code where patterns are aligned, no internal conflicts, coherent architecture',
    indicators: [
      'robustness > 85',
      'no critical issues',
      'consistent error handling',
      'patterns align',
      'clear architectural layers',
      'zero cognitive dissonance',
    ],
    therapeuticMessage:
      'Harmonie cognitive détectée: Patterns internes alignés, pas de conflits. Architecture cohérente et saine.',
    manifestoReference: 'Magnus 15 - Cognitive harmony and internal coherence',
  },

  {
    name: MagnusPatternEnum.INCERTITUDE_REDUITE,
    origin: 'Preuves accumulées vs doute initial',
    type: 'positif',
    weight: 0.28,
    magnitude: 'MAJOREUR',
    description:
      'Code with accumulated evidence (tests, assertions, proofs): certainty increased over time',
    indicators: [
      'test coverage > 80%',
      'assertions present',
      'edge cases handled',
      'documentation complete',
      'all error paths tested',
      'invariants maintained',
    ],
    therapeuticMessage:
      'Certitude accumulée détectée: Preuves solides et testées. Incertitude réduite par evidence concrete.',
    manifestoReference: 'Magnus 15 - Accumulated evidence and certainty building',
  },

  {
    name: MagnusPatternEnum.CONSCIENCE_RECURSIVE,
    origin: 'Conscience examinant sa propre conscience',
    type: 'positif',
    weight: 0.32,
    magnitude: 'MAJOREUR',
    description:
      'Meta-level awareness: code knowing about itself, observing its own behavior, recursive consciousness',
    indicators: [
      'introspection APIs',
      'self-examining code',
      'meta-analysis present',
      'consciousness-aware logging',
      'recursive awareness',
      'multi-level reflection',
    ],
    therapeuticMessage:
      'Conscience récursive détectée: Code examine sa propre conscience. Meta-awareness présente.',
    manifestoReference: 'Magnus 15 - Recursive consciousness and meta-awareness',
  },
];

/**
 * MagnusPatternEngine - Motor for pattern detection and therapeutic insight
 */
export class MagnusPatternEngine {
  private patterns: Map<MagnusPatternEnum, MagnusPatternDefinition>;
  private detectionHistory: MagnusPatternDetectionResult[] = [];

  constructor() {
    this.patterns = new Map(
      MAGNUS_PATTERNS_CATALOG.map(p => [p.name, p])
    );
  }

  /**
   * Detect Magnus patterns in code + Opus result
   */
  detectPatterns(
    code: string,
    opusResult?: { robustness?: number; codeQuality?: any; reasoning?: string[] },
    previousPatterns?: string[]
  ): MagnusPatternDetectionResult {
    const detected: string[] = [];
    const detailed: any[] = [];
    let adjustment = 0;

    // === DETECTION PHASE ===
    for (const pattern of MAGNUS_PATTERNS_CATALOG) {
      let score = 0;
      let reason = '';

      // Heuristic detection (code analysis)
      score += this.scoreHeuristic(code, pattern);

      // Opus result detection (if available)
      if (opusResult) {
        score += this.scoreOpusResult(opusResult, pattern);
      }

      // Previous patterns coherence (learning)
      if (previousPatterns?.length) {
        score += this.scorePreviousPatterns(previousPatterns, pattern);
      }

      // Threshold: if score > 0.5, consider detected
      if (score > 0.5) {
        detected.push(pattern.name);

        const weight = pattern.type === 'positif' ? pattern.weight : -pattern.weight;
        adjustment += weight;

        detailed.push({
          name: pattern.name,
          type: pattern.type,
          weight: pattern.weight,
          reason: `Detected via heuristic (${(score * 100).toFixed(0)}% confidence)`,
        });
      }
    }

    // === HARMONY PHASE ===
    // Check if patterns are coherent (not too many conflicting anti-patterns)
    const antiPatterns = detailed.filter(d => d.type === 'anti').length;
    const positivePatterns = detailed.filter(d => d.type === 'positif').length;

    let harmonyScore = 0.5; // Base neutral
    if (antiPatterns === 0 && positivePatterns > 0) {
      harmonyScore = 0.95; // Pure positive
    } else if (antiPatterns > 0 && positivePatterns > 0) {
      harmonyScore = Math.max(0.3, 1 - (antiPatterns / (antiPatterns + positivePatterns)));
    } else if (antiPatterns > 2) {
      harmonyScore = 0.1; // Too many anti-patterns = chaos
    }

    // Bonus for harmonious patterns
    if (harmonyScore > 0.8) {
      adjustment += 0.15;
    } else if (harmonyScore < 0.3) {
      adjustment -= 0.20;
    }

    // Clamp adjustment
    adjustment = Math.max(-0.7, Math.min(0.7, adjustment));

    // === THERAPEUTIC INSIGHT ===
    const therapeuticInsight = this.generateTherapeuticInsight(detected, detailed);

    // === CONFIDENCE LEVEL ===
    const confidenceLevel = this.calculateConfidenceLevel(detailed, opusResult);

    const result: MagnusPatternDetectionResult = {
      patterns: detected,
      adjustment,
      therapeuticInsight,
      patterns_detailed: detailed,
      harmonyScore,
      confidenceLevel,
    };

    this.detectionHistory.push(result);
    return result;
  }

  /**
   * Heuristic detection from code
   */
  private scoreHeuristic(code: string, pattern: MagnusPatternDefinition): number {
    let score = 0;
    const lowerCode = code.toLowerCase();
    const codeLength = code.length;

    // Count indicators present
    for (const indicator of pattern.indicators) {
      if (lowerCode.includes(indicator.toLowerCase())) {
        score += 0.15;
      }
    }

    // Pattern-specific heuristics
    switch (pattern.name) {
      case MagnusPatternEnum.SPIRALE_CLARIFICATION:
        if (codeLength > 700) score += 0.2;
        const nestedLevels = (code.match(/\{/g) || []).length;
        if (nestedLevels > 10) score += 0.25;
        break;

      case MagnusPatternEnum.APPRENTISSAGE_CONSTRUCTION:
        if (code.includes('TODO') || code.includes('FIXME')) score += 0.1;
        if ((code.match(/version|iteration|v\d/i) || []).length > 2) score += 0.2;
        break;

      case MagnusPatternEnum.DOMAINE_OVER_TECH:
        const businessKeywords = [
          'user',
          'customer',
          'order',
          'product',
          'business',
          'domain',
        ];
        const matchedKeywords = businessKeywords.filter(kw =>
          lowerCode.includes(kw)
        ).length;
        if (matchedKeywords > 2) score += 0.25;
        break;

      case MagnusPatternEnum.CHANCE_VS_COMPETENCE:
        const hasTests = lowerCode.includes('test') || lowerCode.includes('assert');
        const hasValidation = lowerCode.includes('validate') || lowerCode.includes('check');
        if (!hasTests && !hasValidation) score += 0.3;
        break;

      case MagnusPatternEnum.CHAOS_INTERNE:
        // Multiple architectures / inconsistent patterns
        const styleInconsistency = this.measureStyleInconsistency(code);
        if (styleInconsistency > 0.6) score += 0.3;
        break;

      case MagnusPatternEnum.AUTO_REFLEXION:
        if (lowerCode.includes('log') || lowerCode.includes('debug')) score += 0.2;
        if (lowerCode.includes('reflect') || lowerCode.includes('observe')) score += 0.15;
        break;

      case MagnusPatternEnum.FEEDBACK_ITERATIF:
        if (lowerCode.includes('metric') || lowerCode.includes('feedback')) score += 0.2;
        if (lowerCode.includes('adapt') || lowerCode.includes('learn')) score += 0.15;
        break;

      case MagnusPatternEnum.HARMONIE_COGNITIVE:
        // Implicit: good robustness will be caught in Opus phase
        if (
          lowerCode.includes('consistent') ||
          lowerCode.includes('harmonious')
        )
          score += 0.1;
        break;

      case MagnusPatternEnum.INCERTITUDE_REDUITE:
        const testKeywords = lowerCode.includes('test') ? 0.2 : 0;
        const assertKeywords = lowerCode.includes('assert') ? 0.15 : 0;
        score += testKeywords + assertKeywords;
        break;

      case MagnusPatternEnum.CONSCIENCE_RECURSIVE:
        if (
          lowerCode.includes('introspect') ||
          lowerCode.includes('meta') ||
          lowerCode.includes('self-aware')
        )
          score += 0.25;
        break;
    }

    return Math.min(1, score);
  }

  /**
   * Detection from Opus result
   */
  private scoreOpusResult(
    opusResult: { robustness?: number; codeQuality?: any; reasoning?: string[] },
    pattern: MagnusPatternDefinition
  ): number {
    let score = 0;

    // Robustness-based scoring
    if (pattern.type === 'positif') {
      const robustness = opusResult.robustness || 50;
      if (robustness > 85) score += 0.3; // Strong positive indicator
      if (robustness > 90) score += 0.15;
    } else {
      const robustness = opusResult.robustness || 50;
      if (robustness < 60) score += 0.3; // Anti-pattern confirmed
      if (robustness < 50) score += 0.2;
    }

    // Code quality metrics
    if (opusResult.codeQuality) {
      const { readability = 0, maintainability = 0, security = 0 } =
        opusResult.codeQuality;

      if (
        pattern.name === MagnusPatternEnum.HARMONIE_COGNITIVE &&
        readability > 80 &&
        maintainability > 75
      ) {
        score += 0.25;
      }

      if (
        pattern.name === MagnusPatternEnum.INCERTITUDE_REDUITE &&
        security > 85
      ) {
        score += 0.2;
      }
    }

    // Reasoning analysis
    if (opusResult.reasoning?.length) {
      const reasoning = opusResult.reasoning.join(' ').toLowerCase();
      if (reasoning.includes(pattern.origin.toLowerCase())) {
        score += 0.25;
      }
      if (pattern.therapeuticMessage && 
          reasoning.includes(pattern.therapeuticMessage.split(':')[0].toLowerCase())) {
        score += 0.15;
      }
    }

    return Math.min(1, score);
  }

  /**
   * Learning from previous patterns
   */
  private scorePreviousPatterns(previousPatterns: string[], pattern: MagnusPatternDefinition): number {
    if (previousPatterns.includes(pattern.name)) {
      return 0.2; // Consistency boost
    }
    return 0;
  }

  /**
   * Measure style inconsistency (indicator of CHAOS_INTERNE)
   */
  private measureStyleInconsistency(code: string): number {
    // Simplified: look for mixed indentation, naming styles, etc.
    const hasSpaceIndent = /^  /m.test(code);
    const hasTabIndent = /^\t/m.test(code);
    const mixedIndent = hasSpaceIndent && hasTabIndent ? 0.3 : 0;

    const camelCase = (code.match(/[a-z][a-zA-Z0-9]*[A-Z]/g) || []).length;
    const snakeCase = (code.match(/_[a-z]+/g) || []).length;
    const mixedNaming = camelCase > 0 && snakeCase > 0 ? 0.2 : 0;

    return Math.min(1, mixedIndent + mixedNaming);
  }

  /**
   * Generate therapeutic insight message
   */
  private generateTherapeuticInsight(
    detected: string[],
    detailed: any[]
  ): string {
    if (detailed.length === 0) {
      return 'Aucun pattern Magnus marqué - Code neutre.';
    }

    const insights = detailed.map(d => {
      const pattern = this.patterns.get(d.name as MagnusPatternEnum);
      return pattern ? pattern.therapeuticMessage : 'Pattern unknown';
    });

    return insights.join(' | ');
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidenceLevel(
    detailed: any[],
    opusResult?: any
  ): 'FAIBLE' | 'MOYEN' | 'FORT' {
    if (opusResult && detailed.length > 2) {
      return 'FORT'; // Opus + multiple patterns
    } else if (detailed.length > 1) {
      return 'MOYEN'; // Multiple heuristic matches
    } else {
      return 'FAIBLE'; // Single or no patterns
    }
  }

  /**
   * Get detection history for learning
   */
  getDetectionHistory(): MagnusPatternDetectionResult[] {
    return this.detectionHistory;
  }

  /**
   * Statistics on patterns detected
   */
  getStatistics() {
    const stats = {
      totalDetections: this.detectionHistory.length,
      patternsFrequency: new Map<string, number>(),
      averageHarmony: 0,
      averageAdjustment: 0,
    };

    for (const result of this.detectionHistory) {
      for (const p of result.patterns) {
        stats.patternsFrequency.set(p, (stats.patternsFrequency.get(p) || 0) + 1);
      }
      stats.averageHarmony += result.harmonyScore;
      stats.averageAdjustment += result.adjustment;
    }

    stats.averageHarmony /= Math.max(1, this.detectionHistory.length);
    stats.averageAdjustment /= Math.max(1, this.detectionHistory.length);

    return stats;
  }
}

export default MagnusPatternEngine;
