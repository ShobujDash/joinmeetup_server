const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({success:false, message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    req.isAdmin = { id: decoded?.isAdmin};
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authMiddleware;
