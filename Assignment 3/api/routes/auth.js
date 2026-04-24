const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../data/users");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "HPPrajapati";

// POST /login
// Body: { username, password }
// On success: return a JWT that includes { userId, role } as claims.
router.post("/login", (req, res, next) => {
  const { username, password } = req.body || {};

  // Basic payload validation so downstream checks can assume strings.
  if (typeof username !== "string" || typeof password !== "string") {
    const err = new Error("username and password are required.");
    err.statusCode = 400;
    err.error = "BadRequest";
    return next(err);
  }

  // Demo assignment: plain-text password match against in-memory users.
  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    const err = new Error("Invalid username or password.");
    err.statusCode = 401;
    err.error = "Unauthorized";
    return next(err);
  }

  // Include only the claims needed by authorization logic.
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    SECRET,
    // Short expiry keeps compromised tokens useful for less time.
    { expiresIn: "1h" }
  );

  return res.json({ token });
});

module.exports = router;