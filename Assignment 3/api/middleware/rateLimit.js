// Very simple in-memory rate limiter for demo purposes.
// AI assistance was used to help draft and organize this implementation.
// Requirements (from assignment spec):
// - Track requests per IP OR per user (token), your choice.
// - Limit to RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW_SECONDS.
// - When exceeded, produce an error (429 Too Many Requests) via next(err).
// - Include a Retry-After header in the final response (set that in errorHandler).

const windowMs = (parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS, 10) || 60) * 1000;
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX, 10) || 5;

const buckets = new Map();
// shape: key -> { count, windowStart }

module.exports = function rateLimit(req, res, next) {
  // This limiter uses the client IP as the tracking key.
  const key = req.ip;
  const now = Date.now();
  const bucket = buckets.get(key);

  // Start a fresh counter when we see a new IP or the time window expires.
  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  // Reject requests that exceed the configured limit for the current window.
  if (bucket.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((windowMs - (now - bucket.windowStart)) / 1000);
    const err = new Error("Rate limit exceeded. Please try again later.");
    err.statusCode = 429;
    err.error = "TooManyRequests";
    err.retryAfter = retryAfterSeconds;
    return next(err);
  }

  // Increment the counter and allow the request through.
  bucket.count += 1;
  buckets.set(key, bucket);
  return next();
};