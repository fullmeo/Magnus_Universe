/**
 * Interactive MARS Test Script
 * Run this in Node.js REPL to test MARS functionality
 */

// Import MARS system
import MARS from './magnus-autonomous-research-system.js';

// Test configuration
const TEST_CONFIG = {
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

// Initialize MARS
const system = new MARS(TEST_CONFIG);

// Initialize the system
await system.initialize([]);

// Get research proposal
const proposal = await system.proposeNextResearch();
console.log(proposal.message);

// Show top suggestions
console.log('\nTop research suggestions:');
proposal.suggestions.forEach((s, i) => {
  console.log(`${i + 1}. ${s.area} (score: ${s.score.toFixed(2)})`);
});

// Test autonomous research on top suggestion
const direction = proposal.suggestions[0];
console.log(`\nResearching: ${direction.area}`);
const research = await system.conductAutonomousResearch(direction);

console.log('\nResearch completed!');
console.log(`Insights generated: ${research.phase3_synthesis.insights.length}`);
console.log(`Recommendations: ${research.phase3_synthesis.recommendations.length}`);

// Show key insights
console.log('\nKey insights:');
research.phase3_synthesis.insights.forEach((insight, i) => {
  console.log(`${i + 1}. ${insight.insight} (confidence: ${(insight.confidence * 100).toFixed(0)}%)`);
});

console.log('\n✅ Interactive test completed successfully!');