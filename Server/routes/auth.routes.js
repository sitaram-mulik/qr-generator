const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);

module.exports = router;
