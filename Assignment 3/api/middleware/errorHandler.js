// Centralized error handler.
// This should be the LAST app.use(...) in server.js.

module.exports = function errorHandler(err, req, res, next) {
  // Reuse the request ID from requestLogger so client errors can be matched
  // to the exact log entry that recorded the request.
  const requestId = req.requestId || null;

  // Keep server-side detail in logs, but return a safe generic response body.
  console.error(`Unhandled error for request ${requestId}`, err);

  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred.",
    statusCode: 500,
    requestId,
    timestamp: new Date().toISOString()
  });
};