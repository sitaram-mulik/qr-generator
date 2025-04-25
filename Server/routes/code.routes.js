const express = require("express");
const router = express.Router();
const {
  generateCodes,
  getAllCodes,
  getPatternOptions,
  getCodeById,
} = require("../controllers/code.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

// Public routes
router.get("/codes", getAllCodes);
router.get("/codes/:code", getCodeById);
router.post("/generate-codes", authenticateToken, generateCodes);
router.get("/pattern-options", getPatternOptions);

// Protected routes (if needed in future)
// router.post('/protected-route', authenticateToken, protectedController);

module.exports = router;
