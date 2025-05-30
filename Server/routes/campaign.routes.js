import express from 'express';
import { createCampaign, getAllCampaigns } from "../controllers/campaign.controller.js";

const router = express.Router();

router.get("/", getAllCampaigns);
router.post("/create", createCampaign);

export default router;