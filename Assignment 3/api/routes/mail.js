const express = require("express");
const mailData = require("../data/mail");
const authenticateJWT = require("../middleware/authenticateJWT");
const authorize = require("../middleware/authorize");
const canViewMail = require("../policies/canViewMail");

const router = express.Router();

// Resource loader for /mail/:id
function loadMail(req, res, next) {
  // Convert the route parameter into a numeric ID before searching the store.
  const id = parseInt(req.params.id, 10);
  const mail = mailData.find(m => m.id === id);

  if (!mail) {
    // Missing resources are reported as a 404 so the handler can format them.
    const err = new Error("Mail not found.");
    err.statusCode = 404;
    err.error = "NotFound";
    return next(err);
  }

  // Attach the loaded resource for later authorization and response use.
  req.mail = mail;
  next();
}

// GET /mail/:id
// Requirements:
// - Must be authenticated (JWT)
// - Must satisfy canViewMail policy (admin OR owner)
router.get("/:id",
  // Authentication runs first so req.user is available to later middleware.
  authenticateJWT,
  // Load the resource before checking access to it.
  loadMail,
  // Enforce RBAC after both the user and resource are known.
  authorize(canViewMail),
  (req, res) => {
    // At this point, user is authenticated and authorized.
    res.json(req.mail);
  }
);

module.exports = router;