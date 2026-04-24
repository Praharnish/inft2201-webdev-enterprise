// Centralized error handler.
// AI assistance was used to help draft and organize this implementation.
// This should be the LAST app.use(...) in server.js.

module.exports = function errorHandler(err, req, res, next) {
  // Reuse the request ID from requestLogger so client errors can be matched
  // to the exact log entry that recorded the request.
  const requestId = req.requestId || null;
  // Prefer custom status codes from upstream middleware and default to 500.
  const statusCode = Number.isInteger(err && err.statusCode)
    ? err.statusCode
    : Number.isInteger(err && err.status)
      ? err.status
      : err && err.type === "entity.parse.failed"
        ? 400
        : 500;

  let error = "InternalServerError";
  let message = "An unexpected error occurred.";

  // Map known client-side status codes to friendly JSON error categories.
  if (statusCode < 500) {
    if (typeof err.error === "string" && err.error.trim()) {
      error = err.error;
    } else if (statusCode === 400) {
      error = "BadRequest";
    } else if (statusCode === 401) {
      error = "Unauthorized";
    } else if (statusCode === 403) {
      error = "Forbidden";
    } else if (statusCode === 404) {
      error = "NotFound";
    } else if (statusCode === 429) {
      error = "TooManyRequests";
    } else {
      error = "ClientError";
    }

    message = typeof err.message === "string" && err.message.trim()
      ? err.message
      : "Request failed.";
  }

  // Keep server-side detail in logs, but return a safe response body to the client.
  console.error(`Unhandled error for request ${requestId}`, err);

  // Retry-After is only relevant when rate limiting is triggered.
  if (statusCode === 429 && Number.isInteger(err && err.retryAfter) && err.retryAfter > 0) {
    res.setHeader("Retry-After", String(err.retryAfter));
  }

  res.status(statusCode).json({
    error,
    message,
    statusCode,
    requestId,
    timestamp: new Date().toISOString()
  });
};