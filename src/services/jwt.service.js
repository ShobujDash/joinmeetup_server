const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET ;

exports.verifyTokenService = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};
