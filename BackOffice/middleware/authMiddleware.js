const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); 
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'CLE_SECRETE_PAR_DEFAUT';
    if (secretKey === 'CLE_SECRETE_PAR_DEFAUT') {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env for token verification!");
        return res.sendStatus(500);
    }

    const decodedPayload = jwt.verify(token, secretKey);

    req.user = {
        id: decodedPayload.userId,
        role: decodedPayload.role
    };

    const userExists = await User.findByPk(decodedPayload.userId);
    if (!userExists) {
        return res.status(403).json({ message: 'Forbidden: User associated with token no longer exists.' });
    }


    next(); 

  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({ message: 'Invalid token' }); 
    }
    return res.sendStatus(403); 
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
        console.error("Authorization Error: req.user not set. Ensure authenticateToken runs first.");
        return res.sendStatus(403); 
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role permissions.' }); // Forbidden
    }
    next(); 
  };
};

module.exports = {
    authenticateToken,
    authorizeRole
};