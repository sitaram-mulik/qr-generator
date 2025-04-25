const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Extract token from httpOnly cookie named 'token'
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  authenticateToken,
};
