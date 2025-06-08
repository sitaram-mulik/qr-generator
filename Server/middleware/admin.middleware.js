import UserModel from '../models/user.js';

const superAdminCheck = async (req, res, next) => {
  const token = req.cookies && req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const userId = req.user?.id || req.userId;
    const userData = await UserModel.findOne({ userId });
    if(!userData.isSuperAdmin) {
        return res.status(403).json({ error: "Access denied" });
    }
    next();
  } catch (error) {
    console.log('error ', error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export { superAdminCheck };
