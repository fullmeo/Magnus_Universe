/*
 Quick test for Magnus132Hermetic
 Note: this example uses ES modules import; ensure Node is run with `--experimental-modules` or set "type":"module" in package.json.
*/

import Magnus132Hermetic from './magnus-13-2-main.js';

(async () => {
  const magnus = new Magnus132Hermetic({ minClarityScore: 40 });
  await magnus.initialize();

  const request = {
    title: 'Harmonia Cosmica - analysis engine',
    description: 'Analyze frequency consciousness and generate an analysis engine tuned to 432Hz'
  };

  const analysis = await magnus.analyze(request);
  console.log('--- Analysis ---');
  console.log(analysis);
  const generation = await magnus.startGeneration(analysis);

  const generatedCode = `/** Example generated engine */\nclass HarmoniaEngine {\n  constructor(){ this.name = 'harmonia'; }\n  start(){ console.log('start'); }\n}\n`;

  // Structured feedback: numeric scores + text
  const developerFeedback = {
    text: "Yes, exactly — this reveals the intention and feels inevitable",
    recognition: 95,
    inevitability: 92
  };

  const convergence = await magnus.validateConvergence(generation.sessionId, generatedCode, developerFeedback);
  console.log('\n=== Convergence Result ===');
  console.log(convergence);
})();
