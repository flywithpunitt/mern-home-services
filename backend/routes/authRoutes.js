const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getProviderProfile, 
  googleLogin 
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.post("/register", registerUser); // Register user/provider
router.post("/login", loginUser); // Login user/provider
router.post("/google-login", googleLogin); // ✅ Google Login Route
router.get("/profile", protect, getUserProfile); // Get logged-in user profile
router.get("/provider-profile/:id", protect, getProviderProfile); // Get provider profile

module.exports = router;
