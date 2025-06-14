import express from 'express';
import {
  getAssets,
  getAssetByCode,
  generate,
  downloadAssets,
  verifyProduct,
  getAssetsCount,
  getStatistics,
  getAssetPattern
} from '../controllers/assets.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkCredits } from '../middleware/credits.middleware.js';
import { checkSubscription } from '../middleware/subscription.middleware.js';

const router = express.Router();

// Public routes

router.get('/', authenticateToken, checkSubscription, getAssets);
router.get('/verify/:code', verifyProduct);
router.get('/pattern/:code', getAssetPattern);
router.post(
  '/generate',
  authenticateToken,
  checkSubscription,
  checkCredits(req => req.body.count),
  generate
);
router.get(
  '/download',
  authenticateToken,
  checkSubscription,
  checkCredits(req => req.query.count),
  downloadAssets
);
router.get('/count', authenticateToken, checkSubscription, getAssetsCount);
router.get('/statistics', authenticateToken, checkSubscription, getStatistics);
router.get('/:code', authenticateToken, checkSubscription, getAssetByCode);

// Protected routes (if needed in future)
// router.post('/protected-route', authenticateToken, protectedController);

export default router;
