/**
 * In-Memory Rate Limiter
 * Simple sliding-window rate limiter for API endpoints.
 * No external dependencies required. Resets on server restart.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to prevent memory leaks
const CLEANUP_INTERVAL = 60_000; // 1 minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Check and increment rate limit for a given key.
 * @param key       Unique identifier (e.g. IP address or IP + route)
 * @param limit     Max requests allowed in the window
 * @param windowMs  Time window in milliseconds
 * @returns         `{ success: true }` if allowed, `{ success: false, retryAfter }` if blocked
 */
export function rateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60_000
): { success: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = store.get(key);

  // First request or window expired → create fresh entry
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  // Within window → check count
  if (entry.count < limit) {
    entry.count += 1;
    return { success: true };
  }

  // Over limit → block
  const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
  return { success: false, retryAfter };
}

/**
 * Extract client IP from a NextRequest for rate-limit keying.
 * Handles X-Forwarded-For (Vercel, reverse proxies) and fallback.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
