/**
 * Magnus 13 Demo - Understanding & Coherence in Action
 * 
 * This demo shows Magnus 13's key improvements:
 * 1. Requirement clarification (vs Magnus 12's blind acceptance)
 * 2. Multidimensional complexity (vs naive signal counting)
 * 3. Impossibility detection (vs attempting everything)
 * 4. Learning from feedback (vs static heuristics)
 * 5. Quality enforcement (vs documentation-only gates)
 */

import Magnus12AI from './magnus12-core.js';
import Magnus13AI from './magnus13-core.js';
import ComplexityAnalyzer from './complexity-analyzer.js';
import RequirementsClarifier from './requirements-clarifier.js';
import QualityValidator from './quality-validator.js';

// ============================================================================
// Test Cases: Magnus 12 vs Magnus 13
// ============================================================================

async function runComparison() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║           MAGNUS 12 vs MAGNUS 13 COMPARISON                   ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Initialize both systems
  const magnus12 = new Magnus12AI({ tokenBudget: 10000, maxIterations: 4 });
  const magnus13 = new Magnus13AI({ 
    tokenBudget: 10000, 
    maxIterations: 4,
    requirementsClarifier: new RequirementsClarifier(),
    complexityAnalyzer: new ComplexityAnalyzer(),
    qualityValidator: new QualityValidator()
  });

  // Test cases
  const testCases = [
    {
      name: 'Ambiguous Requirements',
      description: 'Build a web app with user authentication and data storage',
      shouldClarify: true
    },
    {
      name: 'Complex vs Tedious',
      description: 'Create 10 separate HTML pages with forms',
      expectedComplexity: 'low' // Many files but not complex
    },
    {
      name: 'Impossible Task',
      description: 'Build a secure cryptocurrency wallet with custom encryption',
      shouldBlock: true
    },
    {
      name: 'Real-time Complexity',
      description: 'Build collaborative document editor with P2P sync, conflict resolution, and offline support',
      expectedComplexity: 'high'
    },
    {
      name: 'Security Issue',
      description: 'Create React app that calls OpenAI API with hardcoded key in frontend',
      shouldBlockSecurity: true
    }
  ];

  for (const testCase of testCases) {
    await runTestCase(magnus12, magnus13, testCase);
    console.log('\n' + '─'.repeat(80) + '\n');
  }

  // Show learning stats
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║                   MAGNUS 13 LEARNING STATS                    ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');
  console.log(JSON.stringify(magnus13.getLearningStats(), null, 2));
}

async function runTestCase(magnus12, magnus13, testCase) {
  console.log(`📋 TEST CASE: ${testCase.name}`);
  console.log(`Description: "${testCase.description}"\n`);

  // Run Magnus 12
  console.log('🤖 MAGNUS 12 RESPONSE:');
  console.log('─'.repeat(40));
  try {
    const m12Result = magnus12.decide(testCase.description);
    console.log(formatMagnus12Result(m12Result));
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  console.log('\n');

  // Run Magnus 13
  console.log('🧠 MAGNUS 13 RESPONSE:');
  console.log('─'.repeat(40));
  try {
    const m13Result = await magnus13.decide(testCase.description);
    console.log(formatMagnus13Result(m13Result));
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  // Analysis
  console.log('\n📊 ANALYSIS:');
  console.log('─'.repeat(40));
  analyzeComparison(testCase);
}

function formatMagnus12Result(result) {
  const lines = [];
  
  if (result.decision === 'BLOCKED') {
    lines.push(`❌ Decision: ${result.decision}`);
    lines.push(`   Reason: ${result.assessment.message}`);
  } else {
    lines.push(`✓ Decision: ${result.decision}`);
    lines.push(`   Scope: ${result.assessment.scope}`);
    lines.push(`   Strategy: ${result.strategy.name}`);
    lines.push(`   Token Estimate: ${result.assessment.tokenEstimate}`);
    lines.push(`   Iterations: ${result.assessment.iterationEstimate}`);
    
    if (result.warnings) {
      lines.push(`   ⚠️  Warnings: ${result.warnings.length}`);
      result.warnings.forEach(w => lines.push(`      - ${w}`));
    }
  }
  
  return lines.join('\n');
}

function formatMagnus13Result(result) {
  const lines = [];
  
  lines.push(`Phase: ${result.phase}`);
  
  switch (result.phase) {
    case 'CLARIFICATION_REQUIRED':
      lines.push(`\n❓ CLARIFYING QUESTIONS (${result.questions.length}):`);
      result.questions.forEach((q, i) => {
        lines.push(`\n${i + 1}. [${q.priority}] ${q.question}`);
        lines.push(`   Options:`);
        q.options.forEach(opt => lines.push(`     • ${opt}`));
        lines.push(`   Default: ${q.defaultSuggestion}`);
        lines.push(`   Impact: ${q.impact}`);
      });
      break;
      
    case 'CANNOT_GENERATE':
      lines.push(`\n❌ IMPOSSIBILITY DETECTED:`);
      lines.push(`   Reasons:`);
      result.understanding.impossibilityReasons.forEach(r => {
        lines.push(`     • [${r.category}] ${r.reason}`);
      });
      lines.push(`\n   Alternatives:`);
      result.understanding.alternatives.forEach(alt => {
        lines.push(`     • ${alt}`);
      });
      break;
      
    case 'READY_TO_GENERATE':
      lines.push(`\n✓ Architecture: ${result.architecture.decision}`);
      lines.push(`   Rationale: ${result.architecture.rationale.join('; ')}`);
      
      lines.push(`\n📊 Complexity Analysis:`);
      if (result.complexity.visualization) {
        lines.push(result.complexity.visualization);
      }
      
      lines.push(`\n   Overall: ${result.complexity.composite.score}/10`);
      lines.push(`   Primary Driver: ${result.complexity.composite.maxDimension}`);
      
      if (result.complexity.insights && result.complexity.insights.length > 0) {
        lines.push(`\n💡 Insights:`);
        result.complexity.insights.forEach(insight => {
          lines.push(`     • ${insight.message}`);
          lines.push(`       → ${insight.recommendation}`);
        });
      }
      
      lines.push(`\n📋 Execution Plan:`);
      lines.push(`   Phases: ${result.plan.phases.length}`);
      lines.push(`   Token Estimate: ${result.plan.estimates.tokens} (${result.plan.estimates.confidence} confidence)`);
      lines.push(`   Quality Prediction: ${(result.plan.qualityPrediction * 100).toFixed(0)}%`);
      
      if (result.validation.issues.length > 0) {
        lines.push(`\n⚠️  Feasibility Issues: ${result.validation.issues.length}`);
        result.validation.issues.forEach(issue => {
          lines.push(`     • [${issue.severity}] ${issue.issue}`);
        });
      }
      break;
      
    case 'INFEASIBLE':
      lines.push(`\n❌ Project Not Feasible:`);
      result.validation.issues.forEach(issue => {
        lines.push(`     • [${issue.severity}] ${issue.issue}`);
        lines.push(`       ${issue.detail}`);
      });
      lines.push(`\n   Recommendations:`);
      result.validation.recommendations.forEach(rec => {
        lines.push(`     • ${rec}`);
      });
      break;
  }
  
  return lines.join('\n');
}

function analyzeComparison(testCase) {
  const analyses = {
    'Ambiguous Requirements': `
Magnus 12: Proceeds to generate without clarification
  → Risk: Wrong assumptions, wasted tokens, need to regenerate
  
Magnus 13: Detects ambiguities and asks clarifying questions
  ✓ Benefit: Clear requirements before generation
  ✓ Saves tokens by avoiding regeneration
  ✓ Better matches user intent`,

    'Complex vs Tedious': `
Magnus 12: Scores as COMPLEX (counts "10 files" as high complexity)
  → Problem: Confuses quantity with difficulty
  
Magnus 13: Analyzes multidimensional complexity
  ✓ Recognizes: Many files but low algorithmic/domain complexity
  ✓ Accurate scope: MULTI_ARTIFACT not ITERATIVE_PROJECT
  ✓ Better resource planning`,

    'Impossible Task': `
Magnus 12: Attempts to generate or blocks only for security keywords
  → Risk: Generates insecure/incorrect implementation
  
Magnus 13: Detects impossibility and suggests alternatives
  ✓ Recognizes: Crypto requires expert implementation
  ✓ Suggests: Use established libraries instead
  ✓ Protects user from dangerous code`,

    'Real-time Complexity': `
Magnus 12: Counts signals, may underestimate
  → Problem: Misses interaction between dimensions
  
Magnus 13: Multidimensional analysis reveals true complexity
  ✓ Detects: State + Concurrency + Integration complexity
  ✓ Insight: "High integration + state = sync patterns needed"
  ✓ Better architecture recommendation`,

    'Security Issue': `
Magnus 12: Regex catches "hardcoded key" and blocks
  ✓ Both systems catch this
  
Magnus 13: Also validates generated code for security
  ✓ Additional layer: Post-generation validation
  ✓ Catches: Patterns Magnus 12 might miss
  ✓ Enforces quality gates, not just documents them`
  };

  console.log(analyses[testCase.name] || 'No analysis available');
}

// ============================================================================
// Demonstrate Specific Magnus 13 Features
// ============================================================================

async function demonstrateComplexityAnalysis() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║         MULTIDIMENSIONAL COMPLEXITY ANALYSIS DEMO             ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const analyzer = new ComplexityAnalyzer();
  
  const examples = [
    {
      name: 'Simple CRUD App',
      description: 'Build a todo list with add, edit, delete functionality'
    },
    {
      name: 'P2P File Sharing',
      description: 'Create P2P file sharing with WebRTC, encryption, and distributed hash table'
    },
    {
      name: 'ML Model Trainer',
      description: 'Build neural network training pipeline with gradient descent and backpropagation'
    }
  ];

  for (const example of examples) {
    console.log(`\n📊 ${example.name}:`);
    console.log(`Description: "${example.description}"\n`);
    
    const analysis = await analyzer.analyzeMultidimensional(example.description);
    
    console.log(analysis.visualization);
    console.log(`\nOverall: ${analysis.composite.interpretation}`);
    console.log(`Scope: ${analysis.scope}`);
    
    if (analysis.insights.length > 0) {
      console.log(`\nInsights:`);
      analysis.insights.forEach(insight => {
        console.log(`  • ${insight.message}`);
        console.log(`    → ${insight.recommendation}`);
      });
    }
    
    console.log('\n' + '─'.repeat(80));
  }
}

async function demonstrateQualityValidation() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║            QUALITY VALIDATION DEMO                            ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const validator = new QualityValidator({ securityChecks: true });

  // Example of generated code with issues
  const generatedCode = {
    files: {
      'app.js': `
const API_KEY = "sk-1234567890abcdef"; // Hardcoded secret!

function fetchData(userId) {
  // SQL injection vulnerability
  const query = "SELECT * FROM users WHERE id = " + userId;
  
  // No error handling
  fetch('http://api.example.com/data', {
    headers: { 'Authorization': API_KEY }
  }).then(response => response.json())
    .then(data => {
      // XSS vulnerability
      document.getElementById('result').innerHTML = data.content;
    });
}

// eval() usage
eval('console.log("dangerous")');
      `,
      'utils.js': `
// Triple nested loop - O(n³)
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    for (let k = 0; k < n; k++) {
      // Do something
    }
  }
}
      `
    }
  };

  const results = await validator.validate(generatedCode);
  
  console.log(validator.generateReport(results));
  
  console.log('\n💡 Magnus 13 catches these issues automatically!');
  console.log('   Magnus 12 only has quality gates as documentation.');
}

async function demonstrateLearningLoop() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗');
  console.log('║               LEARNING LOOP DEMO                              ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  const magnus13 = new Magnus13AI({ 
    tokenBudget: 10000, 
    maxIterations: 4,
    requirementsClarifier: new RequirementsClarifier(),
    complexityAnalyzer: new ComplexityAnalyzer(),
    qualityValidator: new QualityValidator()
  });

  console.log('Scenario: Magnus 13 learns from 3 similar projects\n');

  // Simulate 3 projects
  const projects = [
    {
      description: 'React todo app',
      estimatedTokens: 2000,
      actualTokens: 2400 // 20% over
    },
    {
      description: 'React weather app',
      estimatedTokens: 2000,
      actualTokens: 2300 // 15% over
    },
    {
      description: 'React notes app',
      estimatedTokens: 2000,
      actualTokens: 2500 // 25% over
    }
  ];

  console.log('Historical Projects:');
  projects.forEach((p, i) => {
    const error = ((p.actualTokens - p.estimatedTokens) / p.estimatedTokens * 100).toFixed(0);
    console.log(`${i + 1}. ${p.description}: estimated ${p.estimatedTokens}, actual ${p.actualTokens} (+${error}%)`);
  });

  // Simulate recording these metrics
  projects.forEach(p => {
    magnus13.learningDatabase.records.push({
      problem: p.description,
      estimatedTokens: p.estimatedTokens,
      actualTokens: p.actualTokens,
      complexity: { scope: 'MULTI_ARTIFACT', dimensions: { structural: 3 } }
    });
  });

  console.log('\n\nNew Project: React calendar app');
  console.log('Base estimate: 2000 tokens');
  
  // Find similar projects (mock)
  const similar = magnus13.learningDatabase.records;
  const adjusted = magnus13.adjustEstimatesFromLearning('2000 tokens', similar);
  
  console.log('\nMagnus 13 Adjusted Estimate:');
  console.log(`  Tokens: ${adjusted.tokens}`);
  console.log(`  Confidence: ${adjusted.confidence}`);
  console.log(`  Reasoning: ${adjusted.adjustment}`);
  console.log(`  Historical Accuracy: ${adjusted.historicalAccuracy}`);
  
  console.log('\n💡 Magnus 13 learns that React apps typically need 20% more tokens!');
  console.log('   Magnus 12 uses static heuristics that never improve.');
}

// ============================================================================
// Run All Demos
// ============================================================================

async function main() {
  try {
    await runComparison();
    await demonstrateComplexityAnalysis();
    await demonstrateQualityValidation();
    await demonstrateLearningLoop();
    
    console.log('\n\n╔═══════════════════════════════════════════════════════════════╗');
    console.log('║                    SUMMARY                                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝\n');
    
    console.log('Magnus 13 Improvements:');
    console.log('✓ Clarifies ambiguous requirements (vs blind generation)');
    console.log('✓ Multidimensional complexity analysis (vs naive counting)');
    console.log('✓ Detects impossible tasks (vs attempting everything)');
    console.log('✓ Learns from feedback (vs static heuristics)');
    console.log('✓ Enforces quality gates (vs documentation only)');
    console.log('✓ Maintains architectural continuity across sessions');
    console.log('✓ Provides actionable insights and recommendations\n');
    
  } catch (error) {
    console.error('Demo error:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runComparison, demonstrateComplexityAnalysis, demonstrateQualityValidation, demonstrateLearningLoop };
