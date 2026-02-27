import time
import threading
from typing import Optional


class RateLimitError(Exception):
    """Raised when the rate limit is exceeded."""

    def __init__(self, retry_after: float, message: Optional[str] = None):
        self.retry_after = retry_after
        super().__init__(message or f"Rate limit exceeded. Retry after {retry_after:.2f}s.")


class TokenBucketRateLimiter:
    """
    Thread-safe token bucket rate limiter.

    Tokens refill continuously at a rate of `limit / window` tokens per second.
    A request consumes one token; if none are available, RateLimitError is raised.

    Args:
        limit:       Maximum number of requests allowed per window.
        window:      Time window in seconds (default: 60).
        burst:       Max burst capacity (defaults to `limit`).
    """

    def __init__(
        self,
        limit: int,
        window: float = 60.0,
        burst: Optional[int] = None,
    ) -> None:
        if limit <= 0:
            raise ValueError("limit must be a positive integer")
        if window <= 0:
            raise ValueError("window must be a positive number")

        self.limit: int = limit
        self.window: float = window
        self.burst: int = burst if burst is not None else limit
        self._rate: float = limit / window          # tokens per second
        self._tokens: float = float(self.burst)
        self._last_refill: float = time.monotonic()
        self._lock: threading.Lock = threading.Lock()

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _refill(self) -> None:
        """Refill tokens based on elapsed time. Must be called under lock."""
        now = time.monotonic()
        elapsed = now - self._last_refill
        self._tokens = min(self.burst, self._tokens + elapsed * self._rate)
        self._last_refill = now

    def _seconds_until_token(self) -> float:
        """Return seconds until at least one token is available."""
        if self._tokens >= 1.0:
            return 0.0
        deficit = 1.0 - self._tokens
        return deficit / self._rate

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def acquire(self, tokens: int = 1) -> None:
        """
        Consume `tokens` from the bucket.

        Raises:
            RateLimitError: If insufficient tokens are available.
            ValueError:     If `tokens` is not a positive integer.
        """
        if tokens <= 0:
            raise ValueError("tokens must be a positive integer")
        if tokens > self.burst:
            raise ValueError(f"tokens ({tokens}) exceeds burst capacity ({self.burst})")

        with self._lock:
            self._refill()
            if self._tokens < tokens:
                retry_after = (tokens - self._tokens) / self._rate
                raise RateLimitError(retry_after)
            self._tokens -= tokens

    def try_acquire(self, tokens: int = 1) -> bool:
        """
        Non-raising variant of acquire().

        Returns:
            True if tokens were consumed, False if rate-limited.
        """
        try:
            self.acquire(tokens)
            return True
        except RateLimitError:
            return False

    def wait_and_acquire(self, tokens: int = 1, timeout: Optional[float] = None) -> None:
        """
        Block until tokens are available, then consume them.

        Args:
            tokens:  Number of tokens to consume.
            timeout: Maximum seconds to wait. Raises RateLimitError if exceeded.
        """
        deadline = (time.monotonic() + timeout) if timeout is not None else None

        while True:
            with self._lock:
                self._refill()
                wait = (tokens - self._tokens) / self._rate if self._tokens < tokens else 0.0

            if wait <= 0:
                try:
                    self.acquire(tokens)
                    return
                except RateLimitError:
                    continue  # another thread grabbed it first; retry

            if deadline is not None:
                remaining = deadline - time.monotonic()
                if remaining <= wait:
                    raise RateLimitError(
                        retry_after=wait,
                        message=f"Timeout exceeded waiting for rate limit. Retry after {wait:.2f}s.",
                    )
                time.sleep(min(wait, remaining))
            else:
                time.sleep(wait)

    @property
    def available_tokens(self) -> float:
        """Current token count (snapshot; may change immediately)."""
        with self._lock:
            self._refill()
            return self._tokens

    def reset(self) -> None:
        """Refill the bucket to burst capacity immediately."""
        with self._lock:
            self._tokens = float(self.burst)
            self._last_refill = time.monotonic()

    def __repr__(self) -> str:
        return (
            f"TokenBucketRateLimiter("
            f"limit={self.limit}, window={self.window}s, "
            f"burst={self.burst}, tokens≈{self.available_tokens:.2f})"
        )
