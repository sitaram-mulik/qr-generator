import { buildAssetsDBQuery } from "../utils/assets.util.js";
import UserModel from '../models/user.js';

export const getProfile = async (req, res) => {
    try {
      const profile = await UserModel.findOne({userId: req.userId});
      res.json(profile);
    } catch (error) {
      console.error("Error fetching codes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};