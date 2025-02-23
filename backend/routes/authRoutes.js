const express = require("express");
const { registerUser, loginUser, googleLogin, getUserProfile, getProviderProfile } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();



// Routes
router.post("/register", registerUser); // Register user/provider
router.post("/login", loginUser); // Login user/provider
router.post("/google-login", googleLogin); // Google Login (NEW)
router.get("/profile", protect, getUserProfile); // Get logged-in user profile
router.get("/provider-profile/:id", protect, getProviderProfile);

module.exports = router;
