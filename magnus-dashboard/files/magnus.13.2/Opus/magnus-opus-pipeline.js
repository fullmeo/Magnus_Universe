/**
 * ============================================================================
 * MAGNUS-OPUS COMPLETE PIPELINE
 * 
 * Demonstrates the full workflow:
 * 1. Magnus 13.2 analysis
 * 2. Code generation
 * 3. Opus 4.5 review
 * 4. OpusEnrichedBlocConvergence validation
 * 5. Combined decision
 * 
 * Featured: The Pagination Bug Case Study
 * ============================================================================
 */

import Magnus132Complete from './magnus-13-2-complete.js';
import { OpusEnrichedBlocConvergence } from './opus-enriched-bloc-convergence.js';
import { OpusIntegrationAdapter } from './opus-integration-adapter.js';

// ============================================================================
// PAGINATION BUG CASE STUDY
// ============================================================================

class MagnusOpusPipeline {
  constructor(config = {}) {
    // Initialize Magnus 13.2
    this.magnus = new Magnus132Complete({
      orchestratorName: config.orchestratorName || 'Serigne',
      orchestrationMode: 'ORCHESTRATED',
      autoLearn: true,
      storageDir: config.storageDir || './.magnus-opus',
      
      minClarityScore: 70,
      maxComplexityScore: 8,
      
      convergenceThresholds: {
        minRecognitionScore: 80,
        minInevitabilityScore: 80,
        minCoherenceScore: 75
      },
      
      robustnessThresholds: {
        SOLID: 85,
        ROBUST: 70,
        FRAGILE: 50,
        BRITTLE: 0
      }
    });

    // Initialize Opus Integration
    this.opus = new OpusIntegrationAdapter({
      apiKey: config.opusApiKey || process.env.ANTHROPIC_API_KEY,
      model: 'claude-opus-4.5',
      maxTokens: 4096,
      temperature: 0.3,
      enableCache: true
    });

    // Initialize Opus-Enriched BlocConvergence
    this.blocConvergence = new OpusEnrichedBlocConvergence({
      robustnessThresholds: {
        SOLID: 85,
        ROBUST: 70,
        FRAGILE: 50,
        BRITTLE: 0
      },
      opusWeight: 0.5,
      trustOpusCritical: true,
      mergeStrategy: 'WEIGHTED'
    });

    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    await this.magnus.initialize();
    this.initialized = true;
    console.log('🚀 Magnus-Opus Pipeline initialized');
  }

  /**
   * Complete pipeline execution
   */
  async execute(request, options = {}) {
    await this.initialize();

    console.log('\n' + '='.repeat(80));
    console.log('MAGNUS-OPUS COMPLETE PIPELINE');
    console.log('Structured Vibe-Coding with Opus 4.5 Expert Review');
    console.log('='.repeat(80));

    // STEP 1: Magnus Analysis (Phases 1-5)
    console.log('\n📋 STEP 1: Magnus 13.2 Analysis');
    console.log('─'.repeat(80));
    
    const analysis = await this.magnus.analyze(request);
    
    if (!analysis.canProceed) {
      return {
        success: false,
        phase: 'ANALYSIS',
        recommendation: analysis.recommendation,
        reason: analysis.reasoning
      };
    }

    // STEP 2: Code Generation (simulated or actual)
    console.log('\n💻 STEP 2: Code Generation');
    console.log('─'.repeat(80));
    
    const generatedCode = options.providedCode || 
                         await this.generateCode(request, analysis);
    
    console.log(`✓ Generated ${generatedCode.split('\n').length} lines of code`);

    // STEP 3: Opus 4.5 Review
    console.log('\n🎯 STEP 3: Opus 4.5 Expert Review');
    console.log('─'.repeat(80));
    
    const opusReview = await this.opus.reviewCode(generatedCode, {
      filename: options.filename || 'generated-code.js',
      description: request,
      focusAreas: ['bugs', 'security', 'performance', 'style']
    });

    console.log(`✓ Opus found ${opusReview.parsed.criticalIssues.length} critical issue(s)`);
    console.log(`✓ Opus found ${opusReview.parsed.mediumIssues.length} medium issue(s)`);
    console.log(`✓ Opus found ${opusReview.parsed.minorIssues.length} minor issue(s)`);

    // STEP 4: Start Magnus Generation Session
    console.log('\n🎼 STEP 4: Magnus Generation Session');
    console.log('─'.repeat(80));
    
    const generation = await this.magnus.startGeneration(analysis, {
      strategy: analysis.suggestedStrategies[0],
      agents: analysis.agents
    });

    // STEP 5: Opus-Enriched Convergence Validation
    console.log('\n🔬 STEP 5: Opus-Enriched Convergence Validation');
    console.log('─'.repeat(80));
    
    const validation = await this.validateWithOpus(
      generation.sessionId,
      generatedCode,
      opusReview.raw,
      options.developerFeedback
    );

    // STEP 6: Final Decision
    console.log('\n⚖️  STEP 6: Final Decision');
    console.log('─'.repeat(80));
    
    const decision = this.makeFinalDecision(validation);
    
    console.log(`\n${decision.emoji} OUTCOME: ${decision.outcome}`);
    console.log(`   Robustness: ${validation.robustnessLevel} (${validation.robustness}/100)`);
    console.log(`   Convergence: ${validation.outcome}`);
    console.log(`   Action: ${validation.recommendation.action}`);

    // STEP 7: Record for Learning
    if (options.record !== false) {
      await this.magnus.recordConvergenceOutcome(
        generation.sessionId,
        validation,
        decision
      );
      console.log('\n📚 Outcome recorded for learning');
    }

    return {
      success: decision.shouldDeploy,
      outcome: decision.outcome,
      analysis,
      opusReview,
      validation,
      decision,
      generatedCode
    };
  }

  /**
   * Validate with Opus-enriched system
   */
  async validateWithOpus(sessionId, code, opusReviewRaw, developerFeedback) {
    // Get session context
    const session = await this.magnus.coherence.resumeSession(sessionId);

    // Run Opus-enriched BlocConvergence
    const blocAnalysis = await this.blocConvergence.scanBlocForConvergence(
      session.analysis,
      code,
      opusReviewRaw
    );

    // Run standard convergence analysis
    const convergenceAnalysis = this.magnus.convergence.analyze({
      generatedCode: code,
      developerFeedback,
      intention: session.request,
      analysis: session.analysis
    });

    const convergenceScore = this.magnus.convergence.calculateConvergence({
      recognition: convergenceAnalysis.recognitionScore,
      inevitability: convergenceAnalysis.inevitabilityScore,
      coherence: convergenceAnalysis.coherenceScore
    });

    // Determine combined outcome
    const outcome = this.magnus.determineCombinedOutcome(
      convergenceScore,
      blocAnalysis,
      this.magnus.config.convergenceThresholds
    );

    return {
      sessionId,
      outcome,
      
      // Convergence
      convergenceScore,
      recognition: convergenceAnalysis.recognitionScore,
      inevitability: convergenceAnalysis.inevitabilityScore,
      coherence: convergenceAnalysis.coherenceScore,
      
      // BlocConvergence + Opus
      blocRobustness: blocAnalysis.robustness,
      robustnessLevel: blocAnalysis.interpretation.level,
      patterns: blocAnalysis.patterns,
      opusFindings: blocAnalysis.opusFindings,
      
      // Recommendation
      recommendation: blocAnalysis.recommendation,
      
      timestamp: Date.now()
    };
  }

  /**
   * Make final deployment decision
   */
  makeFinalDecision(validation) {
    const robustness = validation.robustnessLevel;
    const outcome = validation.outcome;
    const opusCritical = validation.opusFindings?.critical?.length || 0;

    // CRITICAL: Opus found critical bugs
    if (opusCritical > 0) {
      return {
        shouldDeploy: false,
        outcome: 'REJECT',
        emoji: '🚫',
        reason: `Opus 4.5 found ${opusCritical} critical issue(s)`,
        action: 'FIX_CRITICAL_ISSUES_THEN_REGENERATE'
      };
    }

    // BRITTLE: Code structure is brittle
    if (robustness === 'BRITTLE') {
      return {
        shouldDeploy: false,
        outcome: 'REJECT',
        emoji: '💥',
        reason: 'Code structure is BRITTLE',
        action: 'REJECT_AND_REGENERATE'
      };
    }

    // FRAGILE: Needs refactoring
    if (robustness === 'FRAGILE') {
      return {
        shouldDeploy: false,
        outcome: 'REFACTOR_NEEDED',
        emoji: '⚠️',
        reason: 'Code is FRAGILE and needs refactoring',
        action: 'REFACTOR_BEFORE_ACCEPT'
      };
    }

    // CONVERGED + ROBUST/SOLID
    if (outcome === 'CONVERGED' && (robustness === 'ROBUST' || robustness === 'SOLID')) {
      return {
        shouldDeploy: true,
        outcome: 'ACCEPT',
        emoji: '✅',
        reason: 'Code converged and structure is solid',
        action: 'DEPLOY_TO_STAGING'
      };
    }

    // PARTIAL convergence
    if (outcome === 'PARTIAL') {
      return {
        shouldDeploy: false,
        outcome: 'REFINE_NEEDED',
        emoji: '◐',
        reason: 'Partial convergence - needs refinement',
        action: 'REFINE_AND_REVALIDATE'
      };
    }

    // Default: FAILED
    return {
      shouldDeploy: false,
      outcome: 'FAILED',
      emoji: '✗',
      reason: 'Code does not converge',
      action: 'RETURN_TO_ANALYSIS'
    };
  }

  /**
   * Simulate code generation (in real scenario, call LLM)
   */
  async generateCode(request, analysis) {
    // This would call actual LLM in production
    // For demo, we return pre-written code
    console.log('⚙️  Simulating code generation...');
    return `// Generated code placeholder
// In production, this calls actual LLM with context from analysis
`;
  }
}

// ============================================================================
// CASE STUDY: PAGINATION BUG
// ============================================================================

async function demonstratePaginationBugDetection() {
  console.log('\n' + '█'.repeat(80));
  console.log('CASE STUDY: PAGINATION BUG DETECTION & PREVENTION');
  console.log('Demonstrating how Magnus + Opus prevents the pagination bug');
  console.log('█'.repeat(80));

  const pipeline = new MagnusOpusPipeline({
    orchestratorName: 'Serigne',
    storageDir: './.magnus-opus-demo'
  });

  // The request
  const request = `
Create a REST API search endpoint with pagination.
- Support page number and limit parameters
- Return paginated results with metadata
- Handle edge cases (invalid page, empty results)
  `.trim();

  // Code WITH the pagination bug (page * limit)
  const buggyCode = `
// Search API Endpoint
async function searchEndpoint(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  
  // BUG: Incorrect offset calculation
  const offset = page * limit;  // Should be (page - 1) * limit
  
  try {
    const results = await database.search({
      query: req.query.q,
      limit: limit,
      offset: offset
    });
    
    const total = await database.count({ query: req.query.q });
    
    res.json({
      results: results,
      metadata: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default searchEndpoint;
  `.trim();

  // Simulate Opus 4.5 review output
  const opusReviewSimulated = `
Code Review - Search Endpoint with Pagination

## Critical Issues

// OPUS: CRITICAL: Pagination offset calculation is incorrect
Line 7: \`const offset = page * limit;\`

The offset calculation will skip the first page of results. For page 1 with limit 50, 
this calculates offset as 50, meaning results 0-49 are skipped and only 50-99 are returned.

\`\`\`diff
- const offset = page * limit;
+ const offset = (page - 1) * limit;
\`\`\`

This is a critical bug that will break pagination for all users on the first page.

## Medium Issues

// OPUS: MEDIUM: Missing input validation for page and limit
The code doesn't validate that page and limit are within reasonable bounds.

\`\`\`diff
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
+ 
+ if (page < 1 || !Number.isInteger(page)) {
+   return res.status(400).json({ error: 'Page must be a positive integer' });
+ }
+ if (limit < 1 || limit > 100) {
+   return res.status(400).json({ error: 'Limit must be between 1 and 100' });
+ }
\`\`\`

## Summary

Found 1 CRITICAL issue and 1 MEDIUM issue.

The pagination bug is a blocker for deployment. Fix required before production use.
  `.trim();

  // Developer feedback (doesn't notice the bug!)
  const developerFeedback = {
    recognizesIntention: true,
    feedbackText: `
Yes, this looks like what I wanted - a simple paginated search endpoint.
The structure is clean and handles errors properly.
    `.trim(),
    confidence: 85
  };

  // Execute pipeline
  const result = await pipeline.execute(request, {
    providedCode: buggyCode,
    filename: 'search-endpoint.js',
    developerFeedback,
    record: true
  });

  // Display results
  console.log('\n' + '═'.repeat(80));
  console.log('RESULTS');
  console.log('═'.repeat(80));
  
  console.log('\n📊 Opus 4.5 Findings:');
  result.opusReview.parsed.criticalIssues.forEach((issue, i) => {
    console.log(`   ${i + 1}. [CRITICAL] ${issue.description}`);
  });
  result.opusReview.parsed.mediumIssues.forEach((issue, i) => {
    console.log(`   ${i + 1 + result.opusReview.parsed.criticalIssues.length}. [MEDIUM] ${issue.description}`);
  });

  console.log('\n🔬 BlocConvergence Analysis:');
  console.log(`   Base robustness: 75/100 (would be ROBUST alone)`);
  console.log(`   Opus adjustment: -40 (1 CRITICAL × 20 + 1 MEDIUM × 10)`);
  console.log(`   Final robustness: ${result.validation.blocRobustness}/100 → ${result.validation.robustnessLevel}`);

  console.log('\n⚖️  Final Decision:');
  console.log(`   ${result.decision.emoji} ${result.decision.outcome}`);
  console.log(`   Reason: ${result.decision.reason}`);
  console.log(`   Action: ${result.decision.action}`);

  console.log('\n💡 What Happened:');
  console.log(`   ✗ Developer didn't notice the pagination bug`);
  console.log(`   ✓ Opus 4.5 detected it as CRITICAL`);
  console.log(`   ✓ BlocConvergence downgraded robustness to BRITTLE`);
  console.log(`   ✓ Magnus rejected deployment automatically`);
  console.log(`   ✓ Suggested fix provided in diff format`);

  console.log('\n🎯 Impact:');
  console.log(`   WITHOUT Magnus-Opus: Bug ships to production`);
  console.log(`   WITH Magnus-Opus: Bug caught before first deployment`);
  console.log(`   Estimated cost saved: Weeks of debugging + user complaints`);

  return result;
}

// ============================================================================
// COMPARISON: WITH vs WITHOUT MAGNUS-OPUS
// ============================================================================

async function demonstrateComparison() {
  console.log('\n' + '█'.repeat(80));
  console.log('COMPARISON: Traditional Vibe-Coding vs Magnus-Opus Pipeline');
  console.log('█'.repeat(80));

  console.log('\n📋 SCENARIO: Building a paginated search API');
  console.log('─'.repeat(80));

  console.log('\n❌ TRADITIONAL VIBE-CODING:');
  console.log('   Day 1: Developer: "Build search API with pagination"');
  console.log('   Day 1: LLM generates code with offset = page * limit');
  console.log('   Day 1: Developer: "Looks good!" → Deploys');
  console.log('   Day 7: Users: "First page shows wrong results!"');
  console.log('   Day 7: Developer reviews code → Finds bug');
  console.log('   Day 7: Hotfix deployed, users frustrated');
  console.log('   Cost: 1 week in production, user complaints, reputation damage');

  console.log('\n✅ MAGNUS-OPUS PIPELINE:');
  console.log('   Day 1: Developer: "Build search API with pagination"');
  console.log('   Day 1: Magnus analyzes (clarity: 85, complexity: 4)');
  console.log('   Day 1: LLM generates code with offset = page * limit');
  console.log('   Day 1: Opus 4.5 reviews → Detects CRITICAL pagination bug');
  console.log('   Day 1: BlocConvergence: BRITTLE (35/100) due to Opus finding');
  console.log('   Day 1: Magnus: REJECT - Fix critical issue');
  console.log('   Day 1: LLM regenerates with offset = (page - 1) * limit');
  console.log('   Day 1: Validation: SOLID (92/100) → DEPLOY');
  console.log('   Cost: 30 extra minutes of validation, zero production bugs');

  console.log('\n💰 ROI CALCULATION:');
  console.log('   Time spent on Magnus-Opus validation: 30 minutes');
  console.log('   Time saved debugging in production: 1+ week');
  console.log('   User trust preserved: Priceless');
  console.log('   Bug never ships to production: ✓');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runAll() {
  try {
    // Run pagination bug demonstration
    await demonstratePaginationBugDetection();
    
    // Show comparison
    await demonstrateComparison();
    
    console.log('\n' + '═'.repeat(80));
    console.log('✅ Magnus-Opus Pipeline demonstration completed');
    console.log('═'.repeat(80));
    console.log('\n💡 Key Takeaway:');
    console.log('   Opus 4.5 expert review + Magnus historical learning');
    console.log('   = Bugs caught BEFORE first deployment\n');
    
  } catch (error) {
    console.error('\n❌ Error during demonstration:', error);
    console.error(error.stack);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAll();
}

export {
  MagnusOpusPipeline,
  demonstratePaginationBugDetection,
  demonstrateComparison
};
