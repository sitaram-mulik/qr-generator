import express from 'express';
import { createCampaign, getAllCampaigns } from "../controllers/campaign.controller.js";
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", authenticateToken, getAllCampaigns);
router.post("/create", authenticateToken, createCampaign);

export default router;