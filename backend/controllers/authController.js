const User = require("../models/User");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebaseAdmin"); // Firebase Admin SDK

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register new user or provider
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password, role, businessName, servicesOffered } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Login user or provider
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        servicesOffered: user.servicesOffered,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Google Login
// @route POST /api/auth/google-login
// @access Public
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { name, email, picture, uid } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: uid,
        avatar: picture,
        role: "user", // Default role
      });
    }

    // Generate JWT Token for authentication
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      businessName: user.businessName,
      servicesOffered: user.servicesOffered,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(401).json({ message: "Google authentication failed", error });
  }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc Get provider profile
// @route GET /api/auth/provider/:id
// @access Public
const getProviderProfile = async (req, res) => {
  try {
    const provider = await User.findById(req.params.id).select("-password");

    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { registerUser, loginUser, googleLogin, getUserProfile, getProviderProfile };
