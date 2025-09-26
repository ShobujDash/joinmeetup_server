const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const adminAuthMiddleware = (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token)
    return res.status(401).json({ success: false, message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = { id: decoded?.id };
    if (decoded?.isAdmin) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized By Admin" });
    }
  } catch (err) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = adminAuthMiddleware;
