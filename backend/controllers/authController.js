const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Google Client ID

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @desc Register new user or provider
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

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
    console.log("🔹 Received Google Token:", token);

    // Fetch Google public keys
    const googleCerts = await axios.get("https://www.googleapis.com/oauth2/v3/certs");
    const certs = googleCerts.data.keys;

    console.log("🔹 Google Public Keys Fetched:", certs);

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract user info
    const payload = ticket.getPayload();
    console.log("🔹 Google Payload:", payload);

    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      console.log("🔹 Creating new user from Google login...");
      user = await User.create({
        name,
        email,
        password: "google-auth", // Dummy password
      });
    }

    // Generate JWT Token
    const authToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      token: authToken,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    });

  } catch (error) {
    console.error("❌ Google Login Error:", error);
    res.status(500).json({ message: "Google authentication failed", error });
  }
};


// @desc Get logged-in user profile
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
// @route GET /api/auth/provider-profile/:id
// @access Private
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
