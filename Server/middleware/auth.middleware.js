import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import UserModel from '../models/user.js';
import { asyncHandler } from '../utils/common.util.js';

const authenticateToken = asyncHandler(async (req, res, next) => {
  // Extract token from httpOnly cookie named 'token'
  const token = req.cookies && req.cookies.token;

  if (!token) {
    throw new ApiError(401, 'Unauthorized access.');
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const requestDomain = req.hostname || req.get('origin');

    const user = await UserModel.findById(verified.userId);
    // Check domain
    if (process.env.NODE_ENV === 'production' && user.domain !== requestDomain) {
      throw new ApiError(401, 'Invalid access');
    }

    // Verify account status
    if (!user.isActive) {
      throw new ApiError(401, 'User access disabled');
    }

    req.user = user;
    req.userId = verified.userId;
    next();
  } catch (error) {
    console.log('Unauthorized error:', error);
    next(error);
  }
});

export { authenticateToken };
