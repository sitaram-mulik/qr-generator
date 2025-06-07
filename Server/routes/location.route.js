import express from 'express';
import { getLocations } from '../controllers/locations.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", authenticateToken, getLocations);

export default router;
