const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "HPPrajapati";

// Verifies Bearer JWTs and exposes decoded claims as req.user.
// Errors are forwarded to centralized error middleware.

module.exports = function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  // Protected routes must include Authorization header.
  if (!authHeader) {
    const err = new Error("Missing Authorization header.");
    err.statusCode = 401;
    err.error = "Unauthorized";
    return next(err);
  }

  // Expected shape: "Bearer <token>".
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    const err = new Error("Authorization header must be in the format: Bearer <token>.");
    err.statusCode = 401;
    err.error = "Unauthorized";
    return next(err);
  }

  try {
    // jwt.verify validates signature and expiry in one step.
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    return next();
  } catch (verifyError) {
    // Keep client messaging simple while preserving token-expired detail.
    const err = new Error(
      verifyError.name === "TokenExpiredError" ? "Token has expired." : "Invalid token."
    );
    err.statusCode = 401;
    err.error = verifyError.name === "TokenExpiredError" ? "TokenExpired" : "Unauthorized";
    return next(err);
  }
};