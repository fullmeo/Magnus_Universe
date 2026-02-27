import MagnusInfinity from './magnus-infinity-core.js';
import Magnus14 from './magnus-14.js';

async function debugDecisions() {
  console.log('🔍 Starting decision debug test...\n');

  // Initialize Magnus Infinity
  const infinity = new MagnusInfinity({
    autonomyLevel: 'semi-autonomous',
    confidenceThreshold: 0.6,
    learningRate: 0.1,
    enableSelfImprovement: true,
    enableSafeguards: true
  });

  // Load scanner
  infinity.magnus14 = new Magnus14();
  await infinity.magnus14.initialize();

  // Setup event listeners
  infinity.on('decision', (decisions) => {
    console.log(`🎯 DECISION EVENT: ${decisions.approved?.length || 0} approved, ${decisions.rejected?.length || 0} rejected, ${decisions.pending?.length || 0} pending`);
    if (decisions.approved?.length > 0) {
      console.log('✅ FIRST AUTONOMOUS DECISION ACHIEVED!');
      decisions.approved.forEach(d => console.log(`   - ${d.pattern} (${d.confidence})`));
    }
  });

  infinity.on('improvement', (data) => {
    console.log(`📈 IMPROVEMENT: ${data.type} - ${data.data?.pattern || 'unknown'}`);
  });

  // Run a few cycles
  await infinity.initialize();

  for (let i = 1; i <= 15; i++) {
    console.log(`\n--- Cycle ${i} ---`);
    await infinity.start();

    // Check pattern memory
    const memory = infinity.learningEngine.getPatternMemory();
    console.log(`📊 Pattern Memory: ${memory.length} patterns stored`);
    memory.forEach(m => {
      if (m.seenCount > 5) {
        console.log(`   ${m.pattern}: seen ${m.seenCount}x, confidence ${m.confidence}`);
      }
    });

    await infinity.stop();
  }

  console.log('\n🏁 Debug test complete');
}

debugDecisions().catch(console.error);