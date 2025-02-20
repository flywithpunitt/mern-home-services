const Booking = require("../models/Booking");
const Service = require("../models/Service");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Users only)
const createBooking = async (req, res) => {
  const { serviceId, providerId, date } = req.body;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 🚨 Prevent providers from booking their own services
    if (req.user._id.toString() === providerId) {
      return res.status(400).json({ message: "You cannot book your own service!" });
    }

    // 🚀 Ensure the user making the request is actually a user
    if (req.user.role !== "user") {
      return res.status(400).json({ message: "Only users can book services!" });
    }

    const booking = new Booking({
      user: req.user._id,  // ✅ This ensures the logged-in user is set correctly
      service: serviceId,
      provider: providerId,
      date,
      status: "pending",
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// @desc    Get bookings for a provider
// @route   GET /api/bookings/provider
// @access  Private (Providers only)
const getProviderBookings = async (req, res) => {
  try {
    // Check if the logged-in user is a provider
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can access bookings" });
    }

    // Find all bookings where the provider matches the logged-in provider
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("user", "name email") // Show user details
      .populate("service", "name category price location"); // Show service details

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the logged-in user is the provider of this booking
    if (req.user._id.toString() !== booking.provider.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own bookings!" });
    }

    // Validate status update
    const validStatuses = ["confirmed", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update!" });
    }

    // Update status
    booking.status = status;
    await booking.save();

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getUserBookings = async (req, res) => {
  try {
    // Find all bookings where the user is the logged-in user
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service", "name category price location")
      .populate("provider", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


module.exports = { createBooking, getProviderBookings, updateBookingStatus, getUserBookings };
