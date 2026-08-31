export const authorize = function (...allowedRoles) {
  return (req, res, next) => {
    if (allowedRoles.includes(req.user.role)) {
      return next();
    } else {
      res.status(403).json({ message: "Unauthorized access" });
    }
  };
};
