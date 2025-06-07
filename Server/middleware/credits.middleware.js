import UserModel from '../models/user.js';

export const checkCredits = (getCountFn) => async (req, res, next) => {
    try {
      const userId = req.user?.id || req.userId; // Adjust based on your auth logic
      const count = await getCountFn(req); // You can pass a function to get required count dynamically
  
      const userData = await UserModel.findOne({ userId });
      const availableCredits = userData.credits - (userData.totalAssets + userData.downloads);
  
      if (availableCredits < count) {
        return res.status(403).json({
          message: availableCredits <= 0
            ? "You don't have any credits left"
            : `Insufficient credits. Available: ${availableCredits}, requested: ${count}`,
        });
      }
  
      next();
    } catch (err) {
      console.error("Credit check failed:", err);
      res.status(500).json({ message: "Server error during credit validation" });
    }
  };
  