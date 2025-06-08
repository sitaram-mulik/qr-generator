import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  // Extract token from httpOnly cookie named 'token'
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }


  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    console.log('user -> ', verified);

    const requestDomain = req.hostname || req.get('origin');

    console.log('requestDomain -> ', requestDomain);
  
    if (process.env.NODE_ENV === 'production' &&  verified.domain !== requestDomain) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  

    req.user = verified;
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export { authenticateToken };
