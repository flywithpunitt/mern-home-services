const User = require("../models/User");

// @desc    Get all providers
// @route   GET /api/providers
// @access  Private
const getProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" }).select("-password");

    if (providers.length === 0) {
      return res.status(404).json({ message: "No providers found" });
    }

    res.json(providers);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProviders };
