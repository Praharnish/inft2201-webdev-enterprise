// Generic authorization middleware.
// Expects authentication middleware to populate req.user and resource loader
// middleware to populate req.mail before this runs.

module.exports = function authorize(policy) {
  return (req, res, next) => {
    const user = req.user;
    const resource = req.mail;

    // Allow request when policy grants access for this user/resource pair.
    if (policy(user, resource)) {
      return next();
    }

    // Deny access with a standardized Forbidden error for central handling.
    const err = new Error("You do not have permission to access this resource.");
    err.statusCode = 403;
    err.error = "Forbidden";
    return next(err);
  };
};