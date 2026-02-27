# Token Bucket Rate Limiter

## Explicit Requirements (MUST)
- must implement token bucket algorithm
- must track requests per time window
- must raise RateLimitError when limit exceeded
- must reset tokens on window expiry
- must allow custom window sizes
- must support concurrent requests
- must be thread-safe

## Implicit Preferences (SHOULD)
- should use type hints
- should have clear class hierarchy
- should provide proper error handling
- should support burst capacity
- should allow non-blocking checks
- should provide retry information
