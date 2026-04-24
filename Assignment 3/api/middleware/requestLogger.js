const { v4: uuidv4 } = require("uuid");

// Adds a unique request ID so every incoming request can be traced in logs.

module.exports = function requestLogger(req, res, next) {
  // Create and store a request-scoped identifier for downstream middleware.
  const requestId = uuidv4();
  req.requestId = requestId;

  // Log a compact, searchable line for request tracing.
  console.log(`REQUEST ${requestId} ${req.method} ${req.originalUrl}`);
  next();
};