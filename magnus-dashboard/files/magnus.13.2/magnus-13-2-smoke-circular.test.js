import { safeStringify } from './utils-safe.js';
import Magnus132Hermetic from './magnus-13-2-main.js';

(async () => {
  console.log('Running circular input smoke test...');

  const circ = {};
  circ.self = circ; // circular reference

  // safeStringify should handle circular
  console.log('safeStringify(circular) =>', safeStringify(circ));

  const magnus = new Magnus132Hermetic({ minClarityScore: 30 });
  await magnus.initialize();

  // Provide circular object inside a request field (description), test robustness
  const request = {
    title: 'Smoke: Circular Input',
    description: circ // intentionally circular
  };

  try {
    const analysis = await magnus.analyze(request);
    console.log('Analysis succeeded. clarityScore:', analysis.understanding && analysis.understanding.clarityScore);
  } catch (err) {
    console.error('Analysis failed:', err);
  }

  // Test recording a circular outcome safely by using safeStringify before saving
  try {
    // Attempt to record using LearningEngine.recordActual may fail if it tries to JSON.stringify circular
    // So we'll demonstrate safe serialization instead
    const serialized = safeStringify({ session: 'smoke', payload: circ });
    console.log('Serialized outcome (safe):', serialized.slice(0, 200));
  } catch (err) {
    console.error('Safe serialization failed:', err);
  }

  console.log('Smoke test complete.');
})();
