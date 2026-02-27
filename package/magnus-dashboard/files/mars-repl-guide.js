/**
 * MARS REPL Guide
 * Copy and paste these commands into Node.js REPL to test MARS
 */

// 1. Import MARS system
import MARS from './magnus-autonomous-research-system.js';

// 2. Configure MARS
const config = {
  storageDir: '.mars',
  userProfile: {
    name: 'Serigne',
    background: {
      musical: '40 years training',
      mathematics: 'Pythagorean theory',
      philosophy: 'Sacred geometry, Kabbalah',
      coding: '25,954+ lines produced'
    },
    interests: [
      'sacred_geometry',
      'pythagorean_harmony',
      'harmonic_ratios',
      'language_processing',
      'framework_development'
    ]
  }
};

// 3. Initialize MARS
const system = new MARS(config);
await system.initialize([]);

// 4. Get research proposal
const proposal = await system.proposeNextResearch();
console.log(proposal.message);

// 5. Show suggestions
console.log('\nTop suggestions:');
proposal.suggestions.forEach((s, i) => {
  console.log(`${i + 1}. ${s.area} (score: ${s.score.toFixed(2)})`);
});

// 6. Conduct research on top suggestion
const direction = proposal.suggestions[0];
console.log(`\nResearching: ${direction.area}`);
const research = await system.conductAutonomousResearch(direction);

// 7. View results
console.log('\nResearch completed!');
console.log(`Insights: ${research.phase3_synthesis.insights.length}`);
console.log(`Recommendations: ${research.phase3_synthesis.recommendations.length}`);

// 8. Show key insights
console.log('\nKey insights:');
research.phase3_synthesis.insights.forEach((insight, i) => {
  console.log(`${i + 1}. ${insight.insight} (confidence: ${(insight.confidence * 100).toFixed(0)}%)`);
});

console.log('\n✅ MARS test completed!');