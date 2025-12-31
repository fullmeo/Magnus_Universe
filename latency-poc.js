#!/usr/bin/env node

/**
 * Latency POC for Claude Code Framework
 *
 * Tests blockchain + consciousness recommendation real-time latency
 * Critical Question: Can we achieve < 100ms end-to-end latency?
 *
 * This POC benchmarks:
 *  1. Blockchain operations
 *  2. Recommendation algorithm
 *  3. API response time
 *  4. End-to-end flow
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

class LatencyMeasurer {
  constructor() {
    this.measurements = [];
  }

  measure(name, fn) {
    const start = process.hrtime.bigint();
    const result = fn();
    const end = process.hrtime.bigint();
    const latencyMs = Number(end - start) / 1_000_000;

    this.measurements.push({ name, latencyMs, timestamp: new Date().toISOString() });
    return { result, latencyMs };
  }

  async measureAsync(name, fn) {
    const start = process.hrtime.bigint();
    const result = await fn();
    const end = process.hrtime.bigint();
    const latencyMs = Number(end - start) / 1_000_000;

    this.measurements.push({ name, latencyMs, timestamp: new Date().toISOString() });
    return { result, latencyMs };
  }

  getSummary() {
    const grouped = {};
    this.measurements.forEach(m => {
      if (!grouped[m.name]) {
        grouped[m.name] = [];
      }
      grouped[m.name].push(m.latencyMs);
    });

    const summary = {};
    Object.entries(grouped).forEach(([name, values]) => {
      summary[name] = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length,
        total: values.reduce((a, b) => a + b, 0)
      };
    });

    return summary;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMULATED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Simulated Blockchain Layer
 * In real implementation, this would call actual blockchain nodes
 */
class BlockchainSimulator {
  async submitTransaction(data) {
    // Simulate network round-trip: ~20-50ms
    await this.sleep(Math.random() * 30 + 20);
    return { txHash: 'tx_' + Math.random().toString(36) };
  }

  async confirmTransaction(txHash) {
    // Simulate block confirmation: ~15-45ms (varies by network)
    await this.sleep(Math.random() * 30 + 15);
    return { confirmed: true };
  }

  async queryState(key) {
    // Simulate RPC call: ~5-15ms
    await this.sleep(Math.random() * 10 + 5);
    return { value: 'data_' + key };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Simulated Consciousness Engine
 * In real implementation, this would run ML models
 */
class ConsciousnessEngine {
  constructor() {
    // Simulate a pre-loaded ML model
    this.modelReady = true;
  }

  async analyzeInput(input) {
    // Simulate model inference: ~30-80ms
    // (Real ML inference varies widely: 10ms-500ms depending on model)
    await this.sleep(Math.random() * 50 + 30);

    return {
      consciousness_score: Math.random(),
      patterns: ['pattern1', 'pattern2'],
      embedding: new Array(768).fill(0).map(() => Math.random())
    };
  }

  async generateRecommendation(consciousnessState, context) {
    // Simulate recommendation generation: ~20-50ms
    await this.sleep(Math.random() * 30 + 20);

    return {
      recommendation_id: 'rec_' + Math.random().toString(36),
      score: Math.random(),
      reasoning: 'Based on consciousness analysis'
    };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Simulated Real-time API
 * In real implementation, this would be Express/FastAPI server
 */
class RealtimeAPI {
  async processRequest(request) {
    // Simulate request processing overhead: ~2-5ms
    await this.sleep(Math.random() * 3 + 2);
    return { processed: true, requestId: request.id };
  }

  async serializeResponse(data) {
    // Simulate JSON serialization: ~1-3ms
    await this.sleep(Math.random() * 2 + 1);
    return JSON.stringify(data);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// TEST SCENARIOS
// ═══════════════════════════════════════════════════════════════════════════

async function runLatencyTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════════════╗');
  console.log('║                     LATENCY POC - PHASE 1: MEASUREMENTS                 ║');
  console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

  const measurer = new LatencyMeasurer();
  const blockchain = new BlockchainSimulator();
  const engine = new ConsciousnessEngine();
  const api = new RealtimeAPI();

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 1: Blockchain Operations
  // ─────────────────────────────────────────────────────────────────────────
  console.log('📊 TEST 1: Blockchain Operations');
  console.log('─────────────────────────────────────────────────────────────');

  // Run multiple times to get averages
  for (let i = 0; i < 5; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'blockchain:submit_transaction',
      () => blockchain.submitTransaction({ data: 'test' })
    );
    console.log(`  ✓ Transaction submission: ${latencyMs.toFixed(2)}ms`);
  }

  for (let i = 0; i < 5; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'blockchain:confirm_transaction',
      () => blockchain.confirmTransaction('tx_test')
    );
    console.log(`  ✓ Transaction confirmation: ${latencyMs.toFixed(2)}ms`);
  }

  for (let i = 0; i < 5; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'blockchain:query_state',
      () => blockchain.queryState('state_key')
    );
    console.log(`  ✓ State query: ${latencyMs.toFixed(2)}ms`);
  }

  console.log();

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 2: Consciousness Engine
  // ─────────────────────────────────────────────────────────────────────────
  console.log('🧠 TEST 2: Consciousness Engine');
  console.log('─────────────────────────────────────────────────────────────');

  for (let i = 0; i < 5; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'engine:analyze_input',
      () => engine.analyzeInput({ text: 'test input' })
    );
    console.log(`  ✓ Input analysis: ${latencyMs.toFixed(2)}ms`);
  }

  for (let i = 0; i < 5; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'engine:generate_recommendation',
      () => engine.generateRecommendation({ score: 0.5 }, {})
    );
    console.log(`  ✓ Recommendation generation: ${latencyMs.toFixed(2)}ms`);
  }

  console.log();

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 3: API Operations
  // ─────────────────────────────────────────────────────────────────────────
  console.log('⚡ TEST 3: API Operations');
  console.log('─────────────────────────────────────────────────────────────');

  for (let i = 0; i < 10; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'api:process_request',
      () => api.processRequest({ id: 'req_' + i })
    );
    console.log(`  ✓ Request processing: ${latencyMs.toFixed(2)}ms`);
  }

  for (let i = 0; i < 10; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'api:serialize_response',
      () => api.serializeResponse({ data: 'test response' })
    );
    console.log(`  ✓ Response serialization: ${latencyMs.toFixed(2)}ms`);
  }

  console.log();

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 4: End-to-End Flow
  // ─────────────────────────────────────────────────────────────────────────
  console.log('🔄 TEST 4: End-to-End Flow (Complete Request Cycle)');
  console.log('─────────────────────────────────────────────────────────────');

  for (let i = 0; i < 5; i++) {
    const { latencyMs } = await measurer.measureAsync(
      'e2e:full_request_cycle',
      async () => {
        // Simulate complete flow: API → Engine → Blockchain → Response
        await api.processRequest({ id: 'e2e_' + i });
        const consciousness = await engine.analyzeInput({ data: 'test' });
        const rec = await engine.generateRecommendation(consciousness, {});
        await blockchain.submitTransaction(rec);
        await api.serializeResponse(rec);
        return rec;
      }
    );
    console.log(`  ✓ Full cycle: ${latencyMs.toFixed(2)}ms`);

    // Check if under target
    const statusEmoji = latencyMs < 100 ? '✅' : '⚠️ ';
    console.log(`    ${statusEmoji} Target: < 100ms, Actual: ${latencyMs.toFixed(2)}ms`);
  }

  console.log();

  // ═════════════════════════════════════════════════════════════════════════
  // ANALYSIS
  // ═════════════════════════════════════════════════════════════════════════
  console.log('\n📊 ANALYSIS & SUMMARY');
  console.log('═════════════════════════════════════════════════════════════════════════\n');

  const summary = measurer.getSummary();

  Object.entries(summary).forEach(([name, stats]) => {
    console.log(`${name}`);
    console.log(`  Min:     ${stats.min.toFixed(2)}ms`);
    console.log(`  Avg:     ${stats.avg.toFixed(2)}ms`);
    console.log(`  Max:     ${stats.max.toFixed(2)}ms`);
    console.log(`  Total:   ${stats.total.toFixed(2)}ms (${stats.count} samples)`);

    // Status check
    if (stats.avg < 100) {
      console.log(`  Status:  ✅ PASSES < 100ms target`);
    } else if (stats.avg < 150) {
      console.log(`  Status:  ⚠️  MARGINAL (100-150ms range)`);
    } else {
      console.log(`  Status:  ❌ EXCEEDS target (> 150ms)`);
    }
    console.log();
  });

  // ═════════════════════════════════════════════════════════════════════════
  // BOTTLENECK ANALYSIS
  // ═════════════════════════════════════════════════════════════════════════
  console.log('🔍 BOTTLENECK ANALYSIS');
  console.log('─────────────────────────────────────────────────────────────');

  const components = {
    'Blockchain Operations': summary['blockchain:submit_transaction']?.avg || 0 +
                             summary['blockchain:confirm_transaction']?.avg || 0 +
                             summary['blockchain:query_state']?.avg || 0,
    'Consciousness Engine': summary['engine:analyze_input']?.avg || 0 +
                           summary['engine:generate_recommendation']?.avg || 0,
    'API Overhead': summary['api:process_request']?.avg || 0 +
                   summary['api:serialize_response']?.avg || 0
  };

  const sorted = Object.entries(components)
    .sort((a, b) => b[1] - a[1]);

  sorted.forEach(([component, latency]) => {
    const pct = (latency / (summary['e2e:full_request_cycle']?.avg || 100) * 100).toFixed(1);
    console.log(`  ${component}: ~${latency.toFixed(2)}ms (${pct}% of total)`);
  });

  console.log();

  // ═════════════════════════════════════════════════════════════════════════
  // SAVE RESULTS
  // ═════════════════════════════════════════════════════════════════════════
  const results = {
    timestamp: new Date().toISOString(),
    critical_question: 'Can we achieve < 100ms real-time latency with blockchain + consciousness?',
    answer: summary['e2e:full_request_cycle']?.avg < 100 ? 'LIKELY YES' : 'NEEDS OPTIMIZATION',
    measurements: summary,
    full_measurements: measurer.measurements,
    end_to_end_average: summary['e2e:full_request_cycle']?.avg || 0,
    bottleneck: sorted[0][0],
    findings: {
      blockchain_latency: summary['blockchain:submit_transaction']?.avg || 0,
      engine_latency: summary['engine:analyze_input']?.avg || 0,
      api_latency: summary['api:process_request']?.avg || 0,
      total_average_latency: summary['e2e:full_request_cycle']?.avg || 0,
      passes_100ms_target: (summary['e2e:full_request_cycle']?.avg || 0) < 100
    },
    recommendations: [
      'Optimize blockchain layer (highest latency contributor)',
      'Cache consciousness model predictions',
      'Use batch processing for multiple requests',
      'Implement response caching where possible',
      'Consider L2 solutions for blockchain (Arbitrum, Polygon, etc.)'
    ]
  };

  // Save to file
  const resultsPath = path.join(__dirname, 'latency-poc-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

  console.log('💾 RESULTS SAVED TO: latency-poc-results.json\n');

  return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN TESTS
// ═══════════════════════════════════════════════════════════════════════════

runLatencyTests()
  .then(results => {
    console.log('═════════════════════════════════════════════════════════════════════════\n');
    console.log('✨ LATENCY POC COMPLETE');
    console.log(`\n🎯 CRITICAL FINDING: Average end-to-end latency is ${results.findings.total_average_latency.toFixed(2)}ms`);
    console.log(`\n${results.findings.passes_100ms_target ? '✅ PASSES' : '⚠️ NEEDS OPTIMIZATION'} < 100ms target\n`);
    console.log('📊 Results saved to latency-poc-results.json');
    console.log('\n🚀 NEXT: Feed results back to Magnus 14 learning system\n');
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
