const express = require("express");
const { createBooking, getProviderBookings, updateBookingStatus, getUserBookings } = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Route for providers to see their bookings
router.get("/provider", protect, getProviderBookings);

// Route for providers to update booking status
router.put("/:id/status", protect, updateBookingStatus);

router.get("/user", protect, getUserBookings);


// Route to book a service
router.post("/", protect, createBooking);

// Route for providers to see who booked their services
router.get("/provider", protect, getProviderBookings);

module.exports = router;
