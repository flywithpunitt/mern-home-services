const Service = require("../models/Service");

// @desc    Add new service (Providers only)
// @route   POST /api/services
// @access  Private
const addService = async (req, res) => {
    if (req.user.role !== "provider") {
      return res.status(403).json({ message: "Only providers can add services" });
    }
  
    const { name, category, price, description, location } = req.body;
  
    try {
      const service = new Service({
        provider: req.user._id,
        name,
        category,
        price,
        description,
        location,
      });
  
      const savedService = await service.save();
      res.status(201).json(savedService);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  const services = await Service.find().populate("provider", "name");
  res.json(services);
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ✅ Check if the logged-in provider owns this service
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only edit your own services!" });
    }

    // ✅ Update fields if provided
    service.name = req.body.name || service.name;
    service.category = req.body.category || service.category;
    service.price = req.body.price || service.price;
    service.description = req.body.description || service.description;
    service.location = req.body.location || service.location;

    const updatedService = await service.save();
    res.json({ message: "Service updated successfully", updatedService });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ✅ Check if the logged-in provider owns this service
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own services!" });
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { addService, getServices,updateService, deleteService };
