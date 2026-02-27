# Short Metrics Report

Generated: 2026-01-01 UTC

Summary (from .logs/metrics.json):

- **analyze** — p50: 1ms, p95: 8ms, p99: 21ms
- **generation** — p50: 11025ms, p95: 14773ms, p99: 17109ms
- **validation** — p50: 0ms, p95: 1ms, p99: 2ms

Counts: analyze=1000, generation=1000, validation=1000, errors=0

Notes:
- Generation shows a long tail (p99 ≈ 17.1s). Consider further IO batching/retries or reducing per-generation sync work.

Next steps:
- If you want, I can run the full soak (TOTAL=5000) or implement additional I/O hardening (backoff/retry + batching).
