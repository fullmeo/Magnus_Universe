import Magnus132Hermetic from './magnus-13-2-main.js';

// Simple load simulator: run multiple concurrent analyze+generate+validate flows
// Adjust `CONCURRENCY` and `TOTAL` as needed for testing.

const CONCURRENCY = parseInt(process.env.CONCURRENCY, 10) || 20;
const TOTAL = parseInt(process.env.TOTAL, 10) || 100;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function worker(id, magnus) {
  const request = {
    title: `Load test ${id}`,
    description: `Simulated load request #${id} - test concurrency behavior.`
  };

  const analysis = await magnus.analyze(request);
  const generation = await magnus.startGeneration(analysis);

  const generatedCode = `// Load-sim generated code for ${id}\nfunction run(){ return ${id}; }`;

  const feedback = { text: 'Yes, exactly', recognition: 90, inevitability: 85 };
  const conv = await magnus.validateConvergence(generation.sessionId, generatedCode, feedback);
  return { id, status: conv.convergenceState };
}

async function runLoad() {
  console.log(`Starting load simulation: total=${TOTAL}, concurrency=${CONCURRENCY}`);
    // Respect production thresholds by default. For test runs override using MIN_CLARITY env var.
    const minClarity = process.env.MIN_CLARITY ? parseInt(process.env.MIN_CLARITY, 10) : undefined;
    const magnus = new Magnus132Hermetic({
      maxConcurrent: Math.max(5, CONCURRENCY),
      ...(typeof minClarity === 'number' && !Number.isNaN(minClarity) ? { minClarityScore: minClarity } : {})
    });
    // Expose for global handlers so we can flush metrics on unexpected exits
    try { global.magnus = magnus; } catch (e) {}
  await magnus.initialize();

  const results = [];
  let inFlight = 0;
  let next = 0;

  const start = Date.now();

  const promises = [];
  while (next < TOTAL) {
    if (inFlight < CONCURRENCY) {
      const id = ++next;
      inFlight++;
      const p = worker(id, magnus)
        .then(r => { results.push(r); })
        .catch(err => { results.push({ id, error: err && err.message }); })
        .finally(() => { inFlight--; });
      promises.push(p);
    } else {
      // brief backoff
      // eslint-disable-next-line no-await-in-loop
      await sleep(10);
    }
  }

  await Promise.all(promises);
  const duration = Date.now() - start;
  console.log(`Load simulation complete in ${duration}ms. Results: total=${results.length}`);
  try {
    if (magnus && magnus.metrics && typeof magnus.metrics.saveToFile === 'function') {
      await magnus.metrics.saveToFile();
      console.log('Metrics written to .logs/metrics.json');
    }
  } catch (e) {
    console.warn('Failed to write metrics:', e && e.message);
  }
  const summary = results.reduce((acc, r) => { acc[r.status || 'ERROR'] = (acc[r.status || 'ERROR']||0)+1; return acc; }, {});
  console.log('Summary:', summary);
}

runLoad().catch(err => {
  console.error('Load simulation failed:', err);
  (async () => {
    try {
      if (global && global.magnus && global.magnus.metrics && typeof global.magnus.metrics.saveToFile === 'function') {
        await global.magnus.metrics.saveToFile();
        console.log('Metrics flushed before exit');
      }
    } catch (e) {
      console.warn('Failed flushing metrics on error:', e && e.message);
    } finally {
      process.exit(1);
    }
  })();
});

// Ensure unhandled rejections are captured and metrics flushed
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
  (async () => {
    try {
      if (global && global.magnus && global.magnus.metrics && typeof global.magnus.metrics.saveToFile === 'function') {
        await global.magnus.metrics.saveToFile();
      }
    } catch (e) {}
    // allow default handler to proceed (which may terminate process)
  })();
});
