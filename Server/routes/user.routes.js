import express from 'express';
import { getAvailableCredits } from '../controllers/user.controller.js';

const router = express.Router();

router.get("/credits/available", getAvailableCredits);

export default router;
