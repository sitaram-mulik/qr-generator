import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const checkSubscription = (req, res, next) => {
  // Extract token from httpOnly cookie named 'token'
  const token = req.cookies && req.cookies.token;

  try {
    const subscriptionEnds = req.user.subscriptionEnds;
    const subscriptionEndsEpoch = Math.floor(new Date(subscriptionEnds).getTime() / 1000);

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    console.log('Current time:', subscriptionEndsEpoch, currentTime);
    if (subscriptionEndsEpoch && subscriptionEndsEpoch < currentTime) {
      throw new ApiError(403, 'Inactive subscription');
    }
    next();
  } catch (error) {
    console.log('Unauthorized error:', error);
    next(error);
  }
};

export { checkSubscription };
