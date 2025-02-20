const express = require("express");
const { getProviders } = require("../controllers/providerController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to get all providers
router.get("/", protect, getProviders);

module.exports = router;
