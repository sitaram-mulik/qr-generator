import express from 'express';
import { getAssets, getAssetByCode, generate, downloadAssets, verifyProduct, getAssetsCount, getStatistics } from '../controllers/assets.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkCredits } from '../middleware/credits.middleware.js';

const router = express.Router();

// Public routes

router.get("/", authenticateToken, getAssets);
router.get("/verify/:code", verifyProduct);
router.post("/generate", authenticateToken, checkCredits((req) => req.body.count), generate);
router.get("/download", authenticateToken, checkCredits((req) => req.query.count), downloadAssets);
router.get("/count", authenticateToken, getAssetsCount);
router.get("/statistics", authenticateToken, getStatistics);
router.get("/:code", authenticateToken, getAssetByCode);

// Protected routes (if needed in future)
// router.post('/protected-route', authenticateToken, protectedController);

export default router;
