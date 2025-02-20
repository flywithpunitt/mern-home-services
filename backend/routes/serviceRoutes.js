const express = require("express");
const { addService, getServices,updateService,deleteService } = require("../controllers/serviceController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.post("/", protect, addService); // Providers add services AFTER login
router.get("/", getServices); // Users can see available services


// ✅ Update a service (Providers only)
router.put("/:id", protect, updateService);

// ✅ Delete a service (Providers only)
router.delete("/:id", protect, deleteService);

module.exports = router;
