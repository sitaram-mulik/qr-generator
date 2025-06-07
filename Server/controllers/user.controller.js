import { buildAssetsDBQuery } from "../utils/assets.util.js";
import AssetModel from '../models/asset.js';

export const getAvailableCredits = async (req, res) => {
    try {
      const query = buildAssetsDBQuery(req.query);
      const totalCount = await AssetModel.countDocuments(query);
      console.log('totalCount ', totalCount)
      res.json({
        count: totalCount
      });
    } catch (error) {
      console.error("Error fetching codes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};