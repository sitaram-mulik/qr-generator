import express from 'express';
import { getAllCodes, getCodeById, generate } from '../controllers/assets.controller.js';
// import { generateShapeImage, uploadPatternImage } from '../controllers/pattern.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get("/codes", authenticateToken, getAllCodes);
router.get("/codes/:code", getCodeById);
router.post("/generate", authenticateToken, generate);

// Protected routes (if needed in future)
// router.post('/protected-route', authenticateToken, protectedController);

export default router;
