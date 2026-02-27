import MagnusInfinity from './magnus-infinity-core.js';
import Magnus14 from './magnus-14.js';

async function simpleTest() {
  console.log('🧪 Simple test of autonomous decisions...\n');

  // Create infinity with correct config
  const infinity = new MagnusInfinity({
    autonomyLevel: 'semi-autonomous',
    confidenceThreshold: 0.5, // Lower threshold to test
    learningRate: 0.1,
    enableSelfImprovement: true,
    enableSafeguards: true
  });

  // Initialize scanner
  infinity.magnus14 = new Magnus14();
  await infinity.magnus14.initialize();

  // Setup event listeners
  infinity.on('decision', (decisions) => {
    console.log(`🎯 DECISION: ${decisions.approved?.length || 0} approved, ${decisions.rejected?.length || 0} rejected`);
    if (decisions.approved?.length > 0) {
      console.log('✅ AUTONOMOUS DECISION MADE!');
      console.log('   Details:', decisions.approved[0]);
    }
  });

  infinity.on('improvement', (data) => {
    console.log(`📈 IMPROVEMENT: ${data.type}`);
  });

  infinity.on('cycle-complete', (cycle) => {
    console.log(`✅ Cycle ${cycle.number} completed`);
  });

  // Initialize
  await infinity.initialize();

  console.log('Starting 5 cycles...\n');

  // Start the infinity loop (it runs continuously)
  await infinity.start();

  // Wait for 5 cycles to complete
  let completedCycles = 0;
  await new Promise((resolve) => {
    const checkCycles = () => {
      if (infinity.cycleCount >= 5) {
        resolve();
      } else {
        setTimeout(checkCycles, 100);
      }
    };
    checkCycles();
  });

  // Stop the system
  await infinity.stop();

  // Check final pattern memory
  const memory = infinity.learningEngine.getPatternMemory();
  console.log(`\nFinal pattern memory: ${memory.length} patterns`);
  const frequent = memory.filter(p => p.seenCount >= 10);
  if (frequent.length > 0) {
    console.log(`Frequent patterns (${frequent.length}):`);
    frequent.forEach(p => console.log(`  ${p.pattern}: ${p.seenCount}x (conf: ${p.confidence})`));
  }

  console.log('\n🏁 Test complete');
}

simpleTest().catch(console.error);