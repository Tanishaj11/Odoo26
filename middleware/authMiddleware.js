const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }

  const token = authHeader.slice(7);

  if (!process.env.JWT_SECRET) {
    return next(new AppError('JWT configuration is missing', 500));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user_id: decoded.user_id };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = {
  authenticate,
};
