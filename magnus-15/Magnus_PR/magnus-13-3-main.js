/**
 * ============================================================================
 * MAGNUS 13.3 - MAIN ORCHESTRATOR (WITH KILO INTEGRATION)
 * 
 * Évolution de 13.2:
 * ✓ Source-aware Kilo adapter (vs boîte noire)
 * ✓ Bloc Convergence Engine (analyse structurelle)
 * ✓ Gateway Analyzer (compréhension du comportement réel)
 * ✓ Convergence-driven model allocation
 * ✓ Audit & Trust tracking
 * ✓ Contribution proposal workflow
 * ============================================================================
 */

import { UnderstandingEngine, ComplexityEngine } from './magnus-13-core.js';
import { LearningEngine, CoherenceEngine } from './magnus-13-learning-coherence.js';
import { ConvergenceEngine } from './magnus-13-2-convergence-principle.js';
import { AgentAllocationEngine } from './magnus-13-2-agent-routing.js';
import KiloIntegrationAdapterV2 from './kilo-integration-adapter-v2.js';
import BlocConvergenceEngine from './bloc-convergence-engine.js';

// ============================================================================
// MAGNUS 13.3 - ORCHESTRATOR AVEC INTÉGRATION KILO
// ============================================================================

class Magnus133 {
  constructor(config = {}) {
    this.config = {
      // EXISTING SETTINGS
      autoLearn: config.autoLearn !== false,
      requireClarification: config.requireClarification !== false,
      minClarityScore: config.minClarityScore || 70,
      maxComplexityScore: config.maxComplexityScore || 8,
      storageDir: config.storageDir || './.magnus',

      // ORCHESTRATOR IDENTITY
      orchestratorName: config.orchestratorName || 'Serigne',
      orchestrationMode: config.orchestrationMode || 'ORCHESTRATED',

      // AGENT CONFIGURATION
      agents: config.agents || {
        primary: {
          name: 'claude-opus-4.5',
          role: 'Architecture, Deep Reasoning',
          capabilities: ['architecture', 'design', 'synthesis']
        },
        testing: {
          platform: 'kilo',
          name: 'kilo-multi-router',
          role: 'Testing & Convergence Validation',
          models: ['xai', 'mistral', 'kawaipilot'],
          capabilities: ['convergence-validation', 'testing', 'edge-cases']
        },
        deployment: {
          name: 'claude-sonnet-4.5',
          role: 'Deployment & Integration',
          capabilities: ['implementation', 'integration']
        }
      },

      // CONVERGENCE THRESHOLDS
      convergenceThresholds: config.convergenceThresholds || {
        minRecognitionScore: 80,
        minInevitabilityScore: 80,
        minCoherenceScore: 75
      },

      // NEW IN 13.3: KILO CONFIGURATION
      kiloConfig: config.kiloConfig || {
        sourcePath: config.kiloSourcePath || './kilo-org-sources',
        auditLevel: 'PRODUCTION',
        convergenceAware: true,
        enableContributions: true
      }
    };

    // EXISTING ENGINES
    this.understanding = new UnderstandingEngine();
    this.complexity = new ComplexityEngine();
    this.learning = new LearningEngine(`${this.config.storageDir}/knowledge`);
    this.coherence = new CoherenceEngine(`${this.config.storageDir}/sessions`);
    this.convergence = new ConvergenceEngine(this.config.convergenceThresholds);
    this.agentRouter = new AgentAllocationEngine(this.config.agents);

    // NEW IN 13.3: KILO INTEGRATION
    this.kiloAdapter = new KiloIntegrationAdapterV2(this.config.kiloConfig);
    this.blocEngine = new BlocConvergenceEngine(this.kiloAdapter, this.convergence);

    // State tracking
    this.initialized = false;
    this.sessions = new Map();
    this.contributionProposals = [];
  }

  /**
   * Initialize Magnus 13.3
   */
  async initialize() {
    if (this.initialized) return;

    console.log('🎼 MAGNUS 13.3 INITIALIZATION');
    console.log('═══════════════════════════════════════════════════════');

    await Promise.all([
      this.learning.initialize(),
      this.coherence.initialize(),
      this.kiloAdapter.initialize()
    ]);

    this.initialized = true;

    console.log('✅ Magnus 13.3 initialized');
    console.log(`👤 Orchestrator: ${this.config.orchestratorName}`);
    console.log('🔐 Kilo source integration: ENABLED');
    console.log('🎼 Bloc Convergence Engine: ACTIVE');
  }

  /**
   * ANALYZE REQUEST (Phase 0)
   */
  async analyze(request, options = {}) {
    if (!this.initialized) await this.initialize();

    const analysis = {
      request,
      timestamp: Date.now(),
      understanding: null,
      complexity: null,
      recommendation: null,
      suggestedStrategies: null,
      clarificationNeeded: false,
      questions: [],
      canProceed: false,
      reasoning: [],
      agents: null,
      convergenceThresholds: this.config.convergenceThresholds,
      kiloAuditAvailable: false  // NEW IN 13.3
    };

    // PHASE 1: Understanding
    console.log('\n🔍 Phase 1: Understanding analysis...');
    analysis.understanding = this.understanding.analyzeRequirements(request);
    
    // PHASE 2: Complexity
    console.log('📊 Phase 2: Complexity analysis...');
    const complexityResult = this.complexity.analyzeComplexity(request);
    analysis.complexity = this.complexity.calculateOverallComplexity(complexityResult);

    // PHASE 3: Learning
    console.log('📚 Phase 3: Checking learned patterns...');
    const learned = this.learning.getRecommendations({
      estimate: {
        scope: this.determineScope(analysis.complexity),
        complexityScore: analysis.complexity.overall.score,
        clarityScore: analysis.understanding.clarityScore
      }
    });

    if (learned.available) {
      console.log(`✓ Found ${learned.recommendations.length} learned recommendations`);
      analysis.learned = learned;
    }

    // PHASE 4: Decision
    console.log('🎯 Phase 4: Making decision...');
    const decision = this.makeDecision(analysis);
    analysis.recommendation = decision.recommendation;
    analysis.canProceed = decision.canProceed;
    analysis.reasoning = decision.reasoning;
    analysis.clarificationNeeded = decision.clarificationNeeded;
    analysis.questions = decision.questions;

    // PHASE 5: Agent Routing
    if (analysis.canProceed) {
      console.log('🤖 Phase 5: Agent Allocation...');
      analysis.agents = this.agentRouter.allocate(analysis);
      analysis.suggestedStrategies = this.suggestStrategies(analysis);
    }

    // PHASE 5.5: NEW IN 13.3 - Kilo Audit
    if (analysis.canProceed && this.config.kiloConfig.auditLevel === 'PRODUCTION') {
      console.log('🔐 Phase 5.5: Kilo Gateway Audit...');
      const auditResult = await this.kiloAdapter.reportAuditFindings();
      analysis.kiloAudit = auditResult;
      analysis.kiloAuditAvailable = true;
      
      if (auditResult.trustScore < 70) {
        console.log(`⚠️  Kilo trust score: ${auditResult.trustScore}% - CAUTION ADVISED`);
        analysis.warnings = analysis.warnings || [];
        analysis.warnings.push({
          type: 'KILO_TRUST',
          severity: 'MEDIUM',
          message: `Kilo Gateway trust score is ${auditResult.trustScore}%`
        });
      }
    }

    // ORCHESTRATED MODE
    if (this.config.orchestrationMode === 'ORCHESTRATED' && analysis.canProceed) {
      return {
        ...analysis,
        requiresOrchestratorDecision: true,
        orchestrator: this.config.orchestratorName,
        suggestedStrategies: analysis.suggestedStrategies
      };
    }

    return analysis;
  }

  /**
   * START GENERATION (Phase 5.5-6)
   */
  async startGeneration(analysis, orchestratorDecision = null, options = {}) {
    if (!analysis.canProceed) {
      throw new Error('Cannot start generation - analysis indicates clarification needed');
    }

    let strategy;
    let agents;

    if (orchestratorDecision) {
      strategy = orchestratorDecision.strategy;
      agents = orchestratorDecision.agents || analysis.agents;
      console.log(`\n🎼 Starting generation with strategy: ${strategy.name}`);
    } else {
      const strategies = analysis.suggestedStrategies || this.suggestStrategies(analysis);
      strategy = strategies[0];
      agents = analysis.agents;
      console.log(`\n🎼 Auto-selected strategy: ${strategy.name}`);
    }

    // Create session
    const session = await this.coherence.startSession(analysis.request, {
      ...analysis,
      chosenStrategy: strategy,
      allocatedAgents: agents,
      orchestrator: this.config.orchestratorName,
      kiloAudit: analysis.kiloAudit  // NEW IN 13.3
    });

    const estimate = {
      scope: this.determineScope(analysis.complexity),
      tokensEstimated: this.estimateTokens(analysis),
      iterationsEstimated: this.estimateIterations(analysis),
      complexityScore: analysis.complexity.overall.score,
      clarityScore: analysis.understanding.clarityScore,
      strategy: strategy.name,
      agents: agents
    };

    this.learning.recordEstimate(session.id, estimate);
    this.sessions.set(session.id, { analysis, session, strategy, agents });

    return {
      sessionId: session.id,
      estimate,
      strategy,
      agents,
      session,
      context: {
        assumptions: analysis.understanding.assumptions,
        risks: analysis.understanding.risks,
        constraints: this.extractConstraints(analysis),
        kiloTrust: analysis.kiloAudit?.trustScore || 'UNKNOWN'
      }
    };
  }

  /**
   * VALIDATE CONVERGENCE (Phase 6 - avec Bloc Engine)
   */
  async validateConvergence(sessionId, generatedCode, developerFeedback) {
    console.log('\n🎼 PHASE 6: CONVERGENCE VALIDATION (with Bloc Analysis)');
    console.log('═══════════════════════════════════════════════════════');

    const session = await this.coherence.resumeSession(sessionId);

    // NEW IN 13.3: Bloc Convergence Analysis
    console.log('\n📍 Bloc Convergence Engine Analysis:');
    const blocAnalysis = await this.blocEngine.scanBlocForConvergence(
      session.analysis,
      generatedCode
    );

    // Existing: Standard convergence analysis
    const convergenceAnalysis = this.convergence.analyze({
      generatedCode,
      developerFeedback,
      intention: session.request,
      analysis: session.analysis
    });

    // NEW IN 13.3: Gateway tracing
    console.log('\n📍 Gateway State Tracing:');
    const gatewayTrace = await this.kiloAdapter.trackConvergenceViaGateway(
      sessionId,
      {
        initial: session.analysis,
        afterRecognition: convergenceAnalysis.recognitionScore,
        afterInevitability: convergenceAnalysis.inevitabilityScore,
        afterCoherence: convergenceAnalysis.coherenceScore
      }
    );

    const convergenceScore = this.convergence.calculateConvergence({
      recognition: convergenceAnalysis.recognitionScore,
      inevitability: convergenceAnalysis.inevitabilityScore,
      coherence: convergenceAnalysis.coherenceScore
    });

    const outcome = this.determineConvergenceOutcome(
      convergenceScore,
      this.config.convergenceThresholds
    );

    return {
      sessionId,
      convergenceScore,
      outcome,
      recognition: convergenceAnalysis.recognitionScore,
      inevitability: convergenceAnalysis.inevitabilityScore,
      coherence: convergenceAnalysis.coherenceScore,
      
      // NEW IN 13.3: Bloc analysis results
      blocRobustness: blocAnalysis.robustness,
      robustnessLevel: blocAnalysis.interpretation.level,
      historicalContext: blocAnalysis.paths,
      blocRecommendation: blocAnalysis.recommendation,
      
      // NEW IN 13.3: Gateway insights
      gatewayInsights: gatewayTrace.insights,
      
      developerFeedback,
      timestamp: Date.now(),
      reasoning: convergenceAnalysis.reasoning,
      nextSteps: this.suggestNextSteps(outcome, blocAnalysis)
    };
  }

  /**
   * RECORD CONVERGENCE OUTCOME (with learning)
   */
  async recordConvergenceOutcome(sessionId, convergenceValidation, finalOutcome) {
    const session = await this.coherence.resumeSession(sessionId);

    if (this.config.autoLearn) {
      const learningRecord = {
        sessionId,
        orchestrator: this.config.orchestratorName,
        strategy: session.chosenStrategy?.name,
        clarity: session.analysis?.understanding?.clarityScore,
        complexity: session.analysis?.complexity?.overall?.score,
        convergenceOutcome: convergenceValidation.outcome,
        convergenceScore: convergenceValidation.convergenceScore,
        recognition: convergenceValidation.recognition,
        inevitability: convergenceValidation.inevitability,
        coherence: convergenceValidation.coherence,
        
        // NEW IN 13.3: Bloc learning
        blocRobustness: convergenceValidation.blocRobustness,
        robustnessLevel: convergenceValidation.robustnessLevel,
        
        // NEW IN 13.3: Kilo learnings
        kiloInsights: convergenceValidation.gatewayInsights,
        
        timestamp: Date.now()
      };

      await this.learning.recordConvergence(sessionId, learningRecord);
      console.log('📚 Convergence outcome recorded (with bloc insights)');
    }

    return await this.coherence.endSession({
      convergence: convergenceValidation.outcome,
      finalOutcome,
      timestamp: Date.now()
    });
  }

  /**
   * PROPOSE KILO CONTRIBUTION (NEW IN 13.3)
   */
  async proposeKiloContribution(type, proposal) {
    console.log(`\n🚀 KILO CONTRIBUTION PROPOSAL: ${type}`);
    console.log('═══════════════════════════════════════════════════════');

    const contribution = {
      id: `CONTRIB_${Date.now()}`,
      type,
      timestamp: Date.now(),
      orchestrator: this.config.orchestratorName,
      
      proposal: {
        title: proposal.title || '',
        description: proposal.description || '',
        targetRepository: proposal.targetRepository || 'kilo-gateway',
        targetComponent: proposal.targetComponent || ''
      },

      basedOnFindings: {
        convergencePattern: proposal.convergencePattern,
        efficiency: proposal.efficiency,
        robustnessGain: proposal.robustnessGain || null
      },

      expectedImpact: {
        tokenEfficiency: proposal.tokenEfficiency || 'UNKNOWN',
        latency: proposal.latency || 'UNKNOWN',
        reliability: proposal.reliability || 'UNKNOWN',
        convergenceImprovement: proposal.convergenceImprovement || null
      },

      implementation: {
        repository: `https://github.com/Kilo-Org/${proposal.targetRepository || 'kilo-gateway'}`,
        files: proposal.modifiedFiles || [],
        testCoverage: proposal.testCoverage || 'PARTIAL',
        documentation: proposal.docChanges || []
      },

      contribution: {
        estimatedCredits: proposal.estimatedCredits || 150,
        status: 'DRAFT',
        readyForSubmit: proposal.readyForSubmit || false,
        submittedDate: null
      },

      references: {
        convergencePattern: proposal.convergencePatternRef || null,
        blocAnalysis: proposal.blocAnalysisRef || null,
        historicalLearnings: proposal.learningsRef || null
      }
    };

    this.contributionProposals.push(contribution);

    console.log(`✓ Proposal created: ${contribution.id}`);
    console.log(`📊 Expected credits: €${contribution.contribution.estimatedCredits}`);
    console.log(`🎯 Repository: ${contribution.proposal.targetRepository}`);

    return contribution;
  }

  /**
   * AUDIT KILO SOURCE (NEW IN 13.3)
   */
  async auditKiloSource() {
    console.log('\n🔍 KILO SOURCE AUDIT');
    console.log('═══════════════════════════════════════════════════════');

    if (!this.initialized) await this.initialize();

    const auditReport = await this.kiloAdapter.reportAuditFindings();

    console.log(`📊 Trust Score: ${auditReport.trustScore}%`);
    console.log(`🔐 Trust Level: ${auditReport.recommendation}`);

    if (auditReport.discrepancies.length > 0) {
      console.log(`\n⚠️  Found ${auditReport.discrepancies.length} discrepancies:`);
      for (const disc of auditReport.discrepancies) {
        console.log(`   [${disc.severity}] ${disc.component}`);
      }
    } else {
      console.log('\n✅ No significant discrepancies found');
    }

    return auditReport;
  }

  /**
   * GET CONTRIBUTION STATUS (NEW IN 13.3)
   */
  getContributionStatus() {
    return {
      totalProposals: this.contributionProposals.length,
      drafts: this.contributionProposals.filter(c => c.contribution.status === 'DRAFT').length,
      submitted: this.contributionProposals.filter(c => c.contribution.status === 'SUBMITTED').length,
      merged: this.contributionProposals.filter(c => c.contribution.status === 'MERGED').length,
      totalCreditsEarned: this.contributionProposals
        .filter(c => c.contribution.status === 'MERGED')
        .reduce((sum, c) => sum + c.contribution.estimatedCredits, 0),
      proposals: this.contributionProposals
    };
  }

  // ========================================================================
  // Existing Methods (from 13.0-13.2)
  // ========================================================================

  suggestStrategies(analysis) {
    const complexityScore = analysis.complexity.overall.score;
    const strategies = [];

    if (complexityScore <= 4) {
      strategies.push({
        name: 'FAST_TRACK',
        approach: 'ITERATIVE_REFINEMENT',
        estimatedHours: 4,
        agentAllocation: {
          primary: 'claude-opus-4.5',
          testing: { platform: 'kilo', strategy: 'cost' },
          deployment: 'claude-sonnet-4.5'
        }
      });
    }

    if (complexityScore >= 4 && complexityScore <= 6) {
      strategies.push({
        name: 'QUALITY_FIRST',
        approach: 'MODULAR_CONSTRUCTION',
        estimatedHours: 8,
        agentAllocation: {
          primary: 'claude-opus-4.5',
          testing: { platform: 'kilo', strategy: 'precision' },
          deployment: 'claude-sonnet-4.5'
        }
      });
    }

    if (complexityScore >= 6) {
      strategies.push({
        name: 'EXPERT_PATH',
        approach: 'PHASED_DEVELOPMENT',
        estimatedHours: 16,
        sessions: 3,
        agentAllocation: {
          primary: 'claude-opus-4.5',
          testing: { platform: 'kilo', strategy: 'precision' },
          deployment: 'claude-sonnet-4.5'
        }
      });
    }

    return strategies;
  }

  makeDecision(analysis) {
    const decision = {
      recommendation: null,
      canProceed: false,
      clarificationNeeded: false,
      questions: [],
      reasoning: []
    };

    if (analysis.understanding.clarityScore < this.config.minClarityScore) {
      decision.recommendation = 'CLARIFY';
      decision.clarificationNeeded = true;
      decision.questions = this.understanding.generateClarificationQuestions(analysis.understanding);
      decision.reasoning.push({
        type: 'CLARITY',
        issue: `Clarity score ${analysis.understanding.clarityScore} below threshold`,
        impact: 'HIGH',
        action: 'Must clarify before proceeding'
      });
      return decision;
    }

    if (analysis.complexity.overall.score > this.config.maxComplexityScore) {
      decision.recommendation = 'DECOMPOSE';
      decision.decomposition = this.suggestDecomposition(analysis);
      decision.reasoning.push({
        type: 'COMPLEXITY',
        issue: `Complexity exceeds threshold`,
        impact: 'HIGH',
        action: 'Break down into smaller pieces'
      });
      return decision;
    }

    decision.recommendation = 'GENERATE';
    decision.canProceed = true;
    return decision;
  }

  determineConvergenceOutcome(scores, thresholds) {
    const meetsRecognition = scores.recognition >= thresholds.minRecognitionScore;
    const meetsInevitability = scores.inevitability >= thresholds.minInevitabilityScore;
    const meetsCoherence = scores.coherence >= thresholds.minCoherenceScore;

    if (meetsRecognition && meetsInevitability && meetsCoherence) {
      return 'CONVERGED';
    } else if (meetsRecognition || meetsInevitability) {
      return 'PARTIAL';
    } else {
      return 'FAILED';
    }
  }

  suggestNextSteps(outcome, blocAnalysis) {
    switch (outcome) {
      case 'CONVERGED':
        return {
          action: 'RECORD_AND_CLOSE',
          steps: [
            '✓ Code successfully converged',
            '✓ Bloc analysis confirms robustness',
            '✓ Record outcome for learning'
          ]
        };

      case 'PARTIAL':
        return {
          action: 'REFACTOR_USING_BLOC_GUIDANCE',
          steps: [
            `◐ Recommendation: ${blocAnalysis?.recommendation || 'Review code'}`,
            '◐ Focus on high-impact areas',
            '◐ Re-validate convergence'
          ]
        };

      case 'FAILED':
        return {
          action: 'RETURN_TO_ANALYSIS',
          steps: [
            '✗ Code does not converge',
            '✗ Review bloc analysis failures',
            '✗ Re-run generation with insights'
          ]
        };
    }
  }

  determineScope(complexity) {
    const score = complexity.overall.score;
    if (score <= 3) return 'SIMPLE';
    if (score <= 5) return 'MODERATE';
    if (score <= 7) return 'COMPLEX';
    return 'EXPERT';
  }

  estimateTokens(analysis) {
    const baseEstimate = { SIMPLE: 1000, MODERATE: 3000, COMPLEX: 8000, EXPERT: 15000 };
    const scope = this.determineScope(analysis.complexity);
    return Math.round(baseEstimate[scope] || 5000);
  }

  estimateIterations(analysis) {
    const baseEstimate = { SIMPLE: 1, MODERATE: 2, COMPLEX: 3, EXPERT: 4 };
    const scope = this.determineScope(analysis.complexity);
    return baseEstimate[scope] || 2;
  }

  extractConstraints(analysis) {
    return analysis.understanding?.constraints || [];
  }

  suggestDecomposition(analysis) {
    return {
      why: 'Complexity too high for single session',
      approach: 'Feature-based decomposition',
      phases: [
        'Phase 1: Core features',
        'Phase 2: Secondary features',
        'Phase 3: Polish & optimization'
      ]
    };
  }
}

export default Magnus133;
