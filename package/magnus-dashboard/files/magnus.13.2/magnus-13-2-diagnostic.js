import Magnus132Hermetic from './magnus-13-2-main.js';

(async function(){
  console.log('Diagnostic run: initializing Magnus');
  const magnus = new Magnus132Hermetic({ maxConcurrent: 5 });
  try {
    await magnus.initialize();
    console.log('Initialized Magnus');

    const req = { title: 'diagnostic', description: 'single-run diagnostic for failure stack traces' };
    console.log('Starting analysis');
    const analysis = await magnus.analyze(req);
    console.log('Analysis completed');

    console.log('Starting generation');
    const generation = await magnus.startGeneration(analysis);
    console.log('Generation completed, sessionId=', generation && generation.sessionId);

    const generatedCode = '// diagnostic generated code';
    const feedback = { text: 'diag feedback', recognition: 50, inevitability: 50 };

    console.log('Validating convergence');
    const conv = await magnus.validateConvergence(generation.sessionId, generatedCode, feedback);
    console.log('Convergence result:', conv);
    console.log('Diagnostic run completed successfully');
  } catch (err) {
    console.error('DIAGNOSTIC ERROR STACK:');
    if (err && err.stack) console.error(err.stack);
    else console.error(err);
    process.exitCode = 1;
  }
})();
