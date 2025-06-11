import express from 'express';
import { getLocations } from '../controllers/locations.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { checkSubscription } from '../middleware/subscription.middleware.js';

const router = express.Router();

router.get('/', authenticateToken, checkSubscription, getLocations);

export default router;
