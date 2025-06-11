import express from 'express';
import { createCampaign, getAllCampaigns } from '../controllers/campaign.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkSubscription } from '../middleware/subscription.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, checkSubscription, getAllCampaigns);
router.post('/create', authenticateToken, checkSubscription, createCampaign);

export default router;
