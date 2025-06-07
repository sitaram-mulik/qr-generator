import express from 'express';
import { getAssets, getAssetByCode, generate, downloadAssets, verifyProduct, getAssetsCount } from '../controllers/assets.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes

router.get("/", authenticateToken, getAssets);
router.get("/verify/:code", verifyProduct);
router.post("/generate", authenticateToken, generate);
router.get("/download", authenticateToken, downloadAssets);
router.get("/count", authenticateToken, getAssetsCount);
router.get("/:code", authenticateToken, getAssetByCode);

// Protected routes (if needed in future)
// router.post('/protected-route', authenticateToken, protectedController);

export default router;
