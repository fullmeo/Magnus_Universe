/**
 * Magnus 13.0 - AI Understanding & Coherence Engine
 * 
 * Evolution from Magnus 12:
 * - FROM: Resource management → TO: Understanding management
 * - FROM: Static patterns → TO: Learning system
 * - FROM: Estimation → TO: Measurement & feedback
 * - FROM: Isolation → TO: Continuity & coherence
 * 
 * Core Philosophy:
 * "The bottleneck is not tokens - it's understanding and coherence"
 */

import crypto from 'crypto';

// ============================================================================
// UNDERSTANDING ENGINE - Active Clarification System
// ============================================================================

class UnderstandingEngine {
  constructor() {
    this.ambiguityPatterns = this.loadAmbiguityPatterns();
    this.domainKnowledge = this.loadDomainKnowledge();
  }

  /**
   * Detect multiple types of ambiguity in requirements
   */
  analyzeRequirements(request) {
    const analysis = {
      request,
      ambiguities: [],
      assumptions: [],
      risks: [],
      clarityScore: 0,
      missingContext: []
    };

    // 1. Scope ambiguity - "What exactly are we building?"
    const scopeAmbiguity = this.detectScopeAmbiguity(request);
    if (scopeAmbiguity) analysis.ambiguities.push(scopeAmbiguity);

    // 2. Technical ambiguity - "What technologies/approaches?"
    const techAmbiguity = this.detectTechnicalAmbiguity(request);
    if (techAmbiguity) analysis.ambiguities.push(techAmbiguity);

    // 3. Constraint ambiguity - "What are the limitations?"
    const constraintAmbiguity = this.detectConstraintAmbiguity(request);
    if (constraintAmbiguity) analysis.ambiguities.push(constraintAmbiguity);

    // 4. Quality ambiguity - "What does 'good' mean here?"
    const qualityAmbiguity = this.detectQualityAmbiguity(request);
    if (qualityAmbiguity) analysis.ambiguities.push(qualityAmbiguity);

    // 5. Context ambiguity - "What's the bigger picture?"
    const contextGaps = this.detectMissingContext(request);
    analysis.missingContext = contextGaps;

    // Calculate clarity score (0-100)
    analysis.clarityScore = this.calculateClarityScore(analysis);

    // Generate assumptions we'll make if not clarified
    analysis.assumptions = this.generateAssumptions(request, analysis);

    // Identify risks from ambiguity
    analysis.risks = this.identifyRisks(analysis);

    return analysis;
  }

  /**
   * Detect scope ambiguity patterns
   */
  detectScopeAmbiguity(request) {
    const patterns = {
      vaguePhrases: /build (something|an app|a thing)|make (it|this)|create (a|some)/i,
      undefinedFeatures: /with features|functionality|capabilities/i,
      unboundedScope: /full|complete|entire|all|everything/i,
      implicitFeatures: /user system|dashboard|admin panel/i
    };

    const matches = [];
    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(request)) {
        matches.push(type);
      }
    }

    if (matches.length === 0) return null;

    return {
      type: 'SCOPE_AMBIGUITY',
      severity: matches.length >= 3 ? 'HIGH' : matches.length >= 2 ? 'MEDIUM' : 'LOW',
      patterns: matches,
      question: this.generateScopeQuestion(request, matches),
      impact: 'May build wrong thing or scope creep during development'
    };
  }

  /**
   * Detect technical ambiguity
   */
  detectTechnicalAmbiguity(request) {
    const hasFramework = /react|vue|angular|svelte|next|nuxt/i.test(request);
    const hasBackend = /node|express|fastify|api|backend|server/i.test(request);
    const hasDatabase = /database|mongo|postgres|sql|prisma/i.test(request);
    const hasAuth = /auth|login|user|session/i.test(request);
    const hasStorage = /storage|persist|save|store/i.test(request);

    const implications = [];
    
    if (hasAuth && !hasBackend) {
      implications.push({
        aspect: 'authentication',
        ambiguity: 'Auth mentioned but no backend specified',
        question: 'Do you want client-side auth (demo), backend auth (production), or third-party (Auth0/Supabase)?'
      });
    }

    if (hasStorage && !hasDatabase) {
      implications.push({
        aspect: 'storage',
        ambiguity: 'Data persistence needed but no storage specified',
        question: 'Should we use localStorage (simple), IndexedDB (robust), or external database?'
      });
    }

    if (hasBackend && !hasFramework) {
      implications.push({
        aspect: 'backend framework',
        ambiguity: 'Backend needed but no framework preference',
        question: 'Prefer Express (traditional), Fastify (modern), or Next.js API routes (integrated)?'
      });
    }

    if (implications.length === 0) return null;

    return {
      type: 'TECHNICAL_AMBIGUITY',
      severity: implications.length >= 2 ? 'HIGH' : 'MEDIUM',
      implications,
      impact: 'May choose inappropriate tech stack or over/under-engineer'
    };
  }

  /**
   * Detect constraint ambiguity
   */
  detectConstraintAmbiguity(request) {
    const mentionsConstraints = /must|should|need|require|without|can't|no /i.test(request);
    
    const implicitConstraints = {
      hasNoBackendMention: !/backend|server|api/i.test(request),
      hasNoDeploymentMention: !/deploy|host|production/i.test(request),
      hasNoTimeline: !/urgent|quick|asap|deadline/i.test(request),
      hasNoBrowser: !/chrome|firefox|safari|browser/i.test(request),
      hasNoMobile: !/mobile|responsive|ios|android/i.test(request)
    };

    const missingConstraints = [];
    
    if (implicitConstraints.hasNoBackendMention && /auth|api|database/.test(request)) {
      missingConstraints.push({
        constraint: 'backend availability',
        question: 'Do you have a backend, or should this be frontend-only?',
        impact: 'Determines architecture fundamentally'
      });
    }

    if (implicitConstraints.hasNoDeploymentMention) {
      missingConstraints.push({
        constraint: 'deployment target',
        question: 'Where will this run? (Local dev, static hosting, cloud, etc.)',
        impact: 'Affects build configuration and dependencies'
      });
    }

    if (missingConstraints.length === 0 && !mentionsConstraints) return null;

    return {
      type: 'CONSTRAINT_AMBIGUITY',
      severity: missingConstraints.length >= 2 ? 'HIGH' : 'LOW',
      missingConstraints,
      impact: 'May violate unstated constraints or waste effort'
    };
  }

  /**
   * Detect quality ambiguity
   */
  detectQualityAmbiguity(request) {
    const qualityIndicators = {
      production: /production|prod|live|real users/i.test(request),
      prototype: /prototype|demo|poc|proof of concept|quick/i.test(request),
      enterprise: /enterprise|corporate|business|scalable/i.test(request),
      learning: /learn|tutorial|practice|example/i.test(request)
    };

    const matches = Object.entries(qualityIndicators)
      .filter(([_, matches]) => matches)
      .map(([level]) => level);

    if (matches.length === 0) {
      return {
        type: 'QUALITY_AMBIGUITY',
        severity: 'MEDIUM',
        issue: 'No quality level specified',
        question: 'What quality level? Prototype (quick), Production (robust), or Learning (educational)?',
        impact: 'Affects error handling, validation, testing, documentation depth'
      };
    }

    if (matches.length > 1) {
      return {
        type: 'QUALITY_AMBIGUITY',
        severity: 'HIGH',
        issue: `Conflicting quality signals: ${matches.join(', ')}`,
        question: `You mentioned ${matches.join(' and ')} - which takes priority?`,
        impact: 'Conflicting goals lead to confused implementation'
      };
    }

    return null;
  }

  /**
   * Detect missing context
   */
  detectMissingContext(request) {
    const gaps = [];

    // Is this extending something existing?
    const hasExistingCodebase = /add to|integrate|extend|modify|refactor/i.test(request);
    if (hasExistingCodebase && !/existing|current|our/.test(request)) {
      gaps.push({
        context: 'existing codebase',
        question: 'What does the existing codebase look like? (Tech stack, architecture, patterns)',
        why: 'Need to match existing patterns and avoid conflicts'
      });
    }

    // Are there users?
    const hasUsers = /user|customer|client|visitor/i.test(request);
    if (hasUsers && !/\d+\s*(users|people)|small|large|scale/i.test(request)) {
      gaps.push({
        context: 'user scale',
        question: 'How many users? (Affects architecture decisions)',
        why: 'Scale determines if we need caching, CDN, load balancing'
      });
    }

    // Is there a data model?
    const hasData = /data|store|save|persist|database/i.test(request);
    if (hasData && !/schema|model|structure|fields/i.test(request)) {
      gaps.push({
        context: 'data model',
        question: 'What does the data look like? (Structure, relationships, size)',
        why: 'Data model drives storage and query decisions'
      });
    }

    return gaps;
  }

  /**
   * Calculate clarity score
   */
  calculateClarityScore(analysis) {
    let score = 100;

    // Deduct for ambiguities
    analysis.ambiguities.forEach(amb => {
      if (amb.severity === 'HIGH') score -= 20;
      else if (amb.severity === 'MEDIUM') score -= 10;
      else score -= 5;
    });

    // Deduct for missing context
    score -= analysis.missingContext.length * 10;

    return Math.max(0, score);
  }

  /**
   * Generate assumptions if user doesn't clarify
   */
  generateAssumptions(request, analysis) {
    const assumptions = [];

    // Default quality level
    if (analysis.ambiguities.some(a => a.type === 'QUALITY_AMBIGUITY')) {
      assumptions.push({
        assumption: 'Production-quality code',
        rationale: 'No quality level specified, defaulting to robust implementation',
        implications: ['Full error handling', 'Input validation', 'Edge case handling']
      });
    }

    // Default tech choices
    if (analysis.ambiguities.some(a => a.type === 'TECHNICAL_AMBIGUITY')) {
      if (/frontend|ui|interface/i.test(request)) {
        assumptions.push({
          assumption: 'React for UI',
          rationale: 'Frontend needed but no framework specified',
          implications: ['Functional components', 'Hooks for state', 'Modern patterns']
        });
      }
    }

    // Default scope boundaries
    if (analysis.ambiguities.some(a => a.type === 'SCOPE_AMBIGUITY')) {
      assumptions.push({
        assumption: 'MVP scope - core features only',
        rationale: 'Scope unclear, focusing on essential functionality',
        implications: ['No admin panel unless requested', 'Basic auth only', 'Minimal UI styling']
      });
    }

    return assumptions;
  }

  /**
   * Identify risks from ambiguity
   */
  identifyRisks(analysis) {
    const risks = [];

    if (analysis.clarityScore < 50) {
      risks.push({
        risk: 'HIGH: Likely to build wrong thing',
        probability: 'HIGH',
        mitigation: 'STOP - Clarify requirements before generating'
      });
    } else if (analysis.clarityScore < 70) {
      risks.push({
        risk: 'MEDIUM: May need significant revision',
        probability: 'MEDIUM',
        mitigation: 'Generate with clear assumptions documented'
      });
    }

    // Specific risk patterns
    analysis.ambiguities.forEach(amb => {
      if (amb.type === 'TECHNICAL_AMBIGUITY' && amb.severity === 'HIGH') {
        risks.push({
          risk: 'Wrong tech stack choice',
          probability: 'MEDIUM',
          mitigation: 'Present tech options with tradeoffs before generating'
        });
      }
    });

    return risks;
  }

  /**
   * Generate clarifying questions in priority order
   */
  generateClarificationQuestions(analysis) {
    const questions = [];

    // Blockers first
    const blockerAmbiguities = analysis.ambiguities.filter(a => a.severity === 'HIGH');
    blockerAmbiguities.forEach(amb => {
      if (amb.question) {
        questions.push({
          priority: 'CRITICAL',
          question: amb.question,
          type: amb.type,
          reason: amb.impact
        });
      }
      if (amb.implications) {
        amb.implications.forEach(impl => {
          questions.push({
            priority: 'CRITICAL',
            question: impl.question,
            type: amb.type,
            reason: impl.ambiguity
          });
        });
      }
    });

    // Context gaps
    analysis.missingContext.forEach(gap => {
      questions.push({
        priority: 'HIGH',
        question: gap.question,
        type: 'CONTEXT',
        reason: gap.why
      });
    });

    // Medium priority
    const mediumAmbiguities = analysis.ambiguities.filter(a => a.severity === 'MEDIUM');
    mediumAmbiguities.forEach(amb => {
      if (amb.question) {
        questions.push({
          priority: 'MEDIUM',
          question: amb.question,
          type: amb.type,
          reason: amb.impact
        });
      }
    });

    return questions;
  }

  /**
   * Helper: Generate specific scope question
   */
  generateScopeQuestion(request, patterns) {
    if (patterns.includes('unboundedScope')) {
      return 'You mentioned "full/complete/entire" - can you define the exact scope? What specific features are essential vs nice-to-have?';
    }
    if (patterns.includes('implicitFeatures')) {
      return 'Features like "user system" can mean many things - do you need: registration, login, profiles, roles, permissions? Which specifically?';
    }
    return 'Can you break this down into specific, concrete features? (Helps estimate scope accurately)';
  }

  loadAmbiguityPatterns() {
    // Loaded from knowledge base in real implementation
    return {};
  }

  loadDomainKnowledge() {
    // Loaded from knowledge base in real implementation
    return {};
  }
}

// ============================================================================
// COMPLEXITY MEASUREMENT ENGINE - Multi-dimensional Analysis
// ============================================================================

class ComplexityEngine {
  /**
   * Measure complexity across multiple dimensions
   * Returns a complexity profile, not a single score
   */
  analyzeComplexity(requirements) {
    return {
      dimensions: {
        domain: this.measureDomainComplexity(requirements),
        technical: this.measureTechnicalComplexity(requirements),
        integration: this.measureIntegrationComplexity(requirements),
        scale: this.measureScaleComplexity(requirements),
        novelty: this.measureNoveltyComplexity(requirements)
      },
      overall: null, // Calculated after
      bottleneck: null, // The limiting dimension
      recommendation: null
    };
  }

  /**
   * Domain complexity - How hard is the problem space?
   */
  measureDomainComplexity(requirements) {
    const domainIndicators = {
      // Expert domains
      cryptography: /crypto|encrypt|sign|hash|security/i,
      dsp: /audio|signal|frequency|fft|filter/i,
      ml: /machine learning|neural|training|model/i,
      finance: /trading|investment|portfolio|risk/i,
      medical: /diagnosis|treatment|medical|health/i,
      
      // Intermediate domains
      realtime: /real-time|live|streaming|websocket/i,
      p2p: /peer.*peer|p2p|distributed/i,
      visualization: /chart|graph|visualization|d3/i,
      
      // Standard domains
      crud: /create.*read.*update.*delete|crud|database/i,
      form: /form|input|validation/i,
      ui: /interface|ui|component|layout/i
    };

    const matches = [];
    let score = 1; // Base score

    for (const [domain, pattern] of Object.entries(domainIndicators)) {
      if (pattern.test(requirements)) {
        matches.push(domain);
        
        // Weight by domain difficulty
        if (['cryptography', 'dsp', 'ml', 'finance', 'medical'].includes(domain)) {
          score += 3;
        } else if (['realtime', 'p2p', 'visualization'].includes(domain)) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }

    return {
      score: Math.min(10, score),
      level: score >= 7 ? 'EXPERT' : score >= 4 ? 'INTERMEDIATE' : 'STANDARD',
      domains: matches,
      expertise: this.determineRequiredExpertise(matches),
      warning: score >= 7 ? 'This domain requires deep expertise - AI generation may be insufficient' : null
    };
  }

  /**
   * Technical complexity - How hard is the implementation?
   */
  measureTechnicalComplexity(requirements) {
    const indicators = {
      concurrency: /concurrent|parallel|async|race condition/i,
      performance: /optimize|performance|fast|cache|efficient/i,
      security: /secure|auth|permission|encrypt/i,
      compatibility: /legacy|ie|old browser|polyfill/i,
      testing: /test|coverage|unit test|e2e/i,
      architecture: /architecture|pattern|solid|clean/i
    };

    let score = 0;
    const aspects = [];

    for (const [aspect, pattern] of Object.entries(indicators)) {
      if (pattern.test(requirements)) {
        score++;
        aspects.push(aspect);
      }
    }

    // Multipliers for combinations
    if (aspects.includes('concurrency') && aspects.includes('performance')) {
      score += 2; // Concurrent + performant = very hard
    }
    if (aspects.includes('security') && aspects.includes('compatibility')) {
      score += 1; // Security + old browsers = tricky
    }

    return {
      score: Math.min(10, score),
      level: score >= 6 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW',
      aspects,
      estimate: this.estimateTechnicalEffort(aspects)
    };
  }

  /**
   * Integration complexity - How many moving parts?
   */
  measureIntegrationComplexity(requirements) {
    const integrationPoints = [];
    
    // External services
    const services = [
      { name: 'Payment', pattern: /stripe|payment|checkout/ },
      { name: 'Auth', pattern: /auth0|clerk|supabase auth/ },
      { name: 'Storage', pattern: /s3|cloudinary|storage/ },
      { name: 'Email', pattern: /sendgrid|email|mailgun/ },
      { name: 'SMS', pattern: /twilio|sms|text message/ },
      { name: 'API', pattern: /api|rest|graphql/ }
    ];

    services.forEach(service => {
      if (service.pattern.test(requirements)) {
        integrationPoints.push(service.name);
      }
    });

    // Internal complexity
    const hasMultipleLanguages = /python.*javascript|typescript.*python/i.test(requirements);
    const hasMultipleDatabases = /postgres.*mongo|sql.*nosql/i.test(requirements);
    const hasMicroservices = /microservice|service mesh/i.test(requirements);

    if (hasMultipleLanguages) integrationPoints.push('Multiple languages');
    if (hasMultipleDatabases) integrationPoints.push('Multiple databases');
    if (hasMicroservices) integrationPoints.push('Microservices');

    const score = integrationPoints.length;

    return {
      score: Math.min(10, score),
      level: score >= 5 ? 'HIGH' : score >= 3 ? 'MEDIUM' : 'LOW',
      points: integrationPoints,
      risk: score >= 5 ? 'Each integration point is a failure point' : 'Manageable integration surface'
    };
  }

  /**
   * Scale complexity - How big is this thing?
   */
  measureScaleComplexity(requirements) {
    // Extract numbers from requirements
    const numbers = requirements.match(/\d+/g)?.map(Number) || [];
    
    const scaleIndicators = {
      users: /(\d+)\s*(thousand|k|million|m)?\s*users/i,
      requests: /(\d+)\s*(requests|rps|qps)/i,
      data: /(\d+)\s*(gb|tb|records|rows)/i,
      files: /(\d+)\s*(files|components|modules)/i
    };

    const scales = {};
    
    for (const [type, pattern] of Object.entries(scaleIndicators)) {
      const match = requirements.match(pattern);
      if (match) {
        scales[type] = match[1];
      }
    }

    // Score based on scale
    let score = 1;
    
    if (scales.users && parseInt(scales.users) > 10000) score += 3;
    else if (scales.users && parseInt(scales.users) > 1000) score += 2;
    
    if (scales.requests && parseInt(scales.requests) > 1000) score += 3;
    else if (scales.requests && parseInt(scales.requests) > 100) score += 2;
    
    if (scales.files && parseInt(scales.files) > 50) score += 2;
    else if (scales.files && parseInt(scales.files) > 20) score += 1;

    return {
      score: Math.min(10, score),
      level: score >= 7 ? 'MASSIVE' : score >= 4 ? 'LARGE' : 'SMALL',
      scales,
      warning: score >= 7 ? 'This scale requires infrastructure planning beyond code generation' : null
    };
  }

  /**
   * Novelty complexity - How new/unique is this?
   */
  measureNoveltyComplexity(requirements) {
    const noveltyIndicators = {
      newFramework: /new.*framework|create.*framework|build.*library/i,
      newProtocol: /protocol|specification|rfc/i,
      research: /research|experimental|novel|innovative/i,
      firstTime: /first.*kind|never.*done|unique/i,
      bleeding: /bleeding edge|latest|experimental/i
    };

    let score = 0;
    const aspects = [];

    for (const [aspect, pattern] of Object.entries(noveltyIndicators)) {
      if (pattern.test(requirements)) {
        score += 2;
        aspects.push(aspect);
      }
    }

    // Check for established patterns
    const establishedPatterns = /crud|todo|blog|chat|dashboard/i;
    if (establishedPatterns.test(requirements) && score === 0) {
      score = 0; // Well-trodden path
      aspects.push('established pattern');
    }

    return {
      score: Math.min(10, score),
      level: score >= 6 ? 'NOVEL' : score >= 3 ? 'INNOVATIVE' : 'ESTABLISHED',
      aspects,
      risk: score >= 6 ? 'Novel problems have no existing patterns - high uncertainty' : 'Known problem space'
    };
  }

  /**
   * Calculate overall complexity and identify bottleneck
   */
  calculateOverallComplexity(analysis) {
    const dimensions = analysis.dimensions;
    
    // Find the highest-scoring dimension
    const scores = Object.entries(dimensions).map(([dim, data]) => ({
      dimension: dim,
      score: data.score,
      level: data.level
    }));

    scores.sort((a, b) => b.score - a.score);
    
    analysis.bottleneck = scores[0];
    
    // Overall is not average - it's dominated by bottleneck
    analysis.overall = {
      score: scores[0].score,
      level: scores[0].level,
      summary: `Complexity dominated by ${scores[0].dimension} (${scores[0].level})`
    };

    // Generate recommendation based on bottleneck
    if (scores[0].score >= 8) {
      analysis.recommendation = {
        action: 'CONSULT',
        reason: `${scores[0].dimension} complexity is too high for direct generation`,
        alternative: 'Break down into smaller, well-defined pieces or consult domain expert'
      };
    } else if (scores[0].score >= 6) {
      analysis.recommendation = {
        action: 'CAUTIOUS',
        reason: `${scores[0].dimension} complexity requires careful approach`,
        alternative: 'Generate with heavy documentation and TODO markers for complex parts'
      };
    } else {
      analysis.recommendation = {
        action: 'GENERATE',
        reason: 'Complexity is manageable',
        alternative: null
      };
    }

    return analysis;
  }

  determineRequiredExpertise(domains) {
    const expertDomains = ['cryptography', 'dsp', 'ml', 'finance', 'medical'];
    const expertiseNeeded = domains.filter(d => expertDomains.includes(d));
    
    if (expertiseNeeded.length > 0) {
      return {
        required: true,
        domains: expertiseNeeded,
        recommendation: 'Consider consulting domain experts or extensive research'
      };
    }
    
    return {
      required: false,
      domains: [],
      recommendation: 'Standard software engineering knowledge sufficient'
    };
  }

  estimateTechnicalEffort(aspects) {
    const effortMap = {
      concurrency: 'high',
      performance: 'medium-high',
      security: 'high',
      compatibility: 'medium',
      testing: 'medium',
      architecture: 'medium-high'
    };

    const efforts = aspects.map(a => effortMap[a] || 'low');
    const hasHigh = efforts.includes('high');
    const hasMediumHigh = efforts.includes('medium-high');

    if (hasHigh) return 'HIGH - Requires careful implementation and validation';
    if (hasMediumHigh) return 'MEDIUM-HIGH - Requires thoughtful approach';
    return 'MEDIUM - Standard implementation practices';
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export { UnderstandingEngine, ComplexityEngine };
