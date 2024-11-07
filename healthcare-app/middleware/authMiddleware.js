const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token required' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); 
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.userType)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = { authenticate, authorize };
