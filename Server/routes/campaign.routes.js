import express from 'express';
import {
  createCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignDetails,
  updateCampaign
} from '../controllers/campaign.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkSubscription } from '../middleware/subscription.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, checkSubscription, getAllCampaigns);
router.delete('/', authenticateToken, checkSubscription, deleteCampaign);
router.post('/create', authenticateToken, checkSubscription, createCampaign);
router.put('/update', updateCampaign);
router.get('/:campaign', getCampaignDetails);

export default router;
