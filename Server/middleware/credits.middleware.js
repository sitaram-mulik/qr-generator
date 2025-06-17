import UserModel from '../models/user.js';

export const checkCredits = getCountFn => async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const count = await getCountFn(req);

    const userData = await UserModel.findById(userId);
    const availableCredits = userData.credits;

    if (availableCredits < count) {
      return res.status(403).json({
        message:
          availableCredits <= 0
            ? "You don't have any credits left"
            : `Insufficient credits. Available: ${availableCredits}, requested: ${count}`
      });
    }

    next();
  } catch (err) {
    console.log('Credit check failed:', err);
    res.status(500).json({ message: 'Server error during credit validation' });
  }
};
