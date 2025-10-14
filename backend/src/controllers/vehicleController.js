const Vehicle = require("../models/Vehicle");
const { uploadImages } = require("../services/cloudinary");
const Rider = require("../models/Rider")

// -----------------------------
// Add Vehicle (Rider can add multiple)
// -----------------------------
exports.addVehicle = async (req, res) => {
  try {
    const { riderId, categoryId, vehicleNumber } = req.body;

    if (!riderId || !categoryId || !vehicleNumber) {
      return res.status(400).json({ success: false, message: "riderId, categoryId, and vehicleNumber are required" });
    }

    const images = {};
    if (req.files?.front) images.front = req.files.front[0].path;
    if (req.files?.back) images.back = req.files.back[0].path;
    if (req.files?.leftSide) images.leftSide = req.files.leftSide[0].path;
    if (req.files?.rightSide) images.rightSide = req.files.rightSide[0].path;

    let insuranceUrl = "";
    let pollutionCertUrl = "";
    if (req.files?.insurance) insuranceUrl = req.files.insurance[0].path;
    if (req.files?.pollutionCert) pollutionCertUrl = req.files.pollutionCert[0].path;

    const newVehicle = await Vehicle.create({
      riderId,
      categoryId,
      vehicleNumber,
      images,
      insurance: insuranceUrl,
      pollutionCert: pollutionCertUrl,
    });

    // ✅ Update Rider vehicle count
    const rider = await Rider.findById(riderId);
    if (rider) {
      rider.vehicleCount = await Vehicle.countDocuments({ riderId });
      await rider.save();
    }

    return res.status(201).json({ success: true, message: "Vehicle added successfully", vehicle: newVehicle });
  } catch (err) {
    console.error("addVehicle error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Rider: Get all vehicles added by self
// -----------------------------
exports.getRiderVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ riderId: req.user.id })
      .populate("categoryId", "name type minPricePerKm fuelType personCapacity acType")
      .sort({ createdAt: -1 });

    return res.json({ success: true, vehicles });
  } catch (err) {
    console.error("getRiderVehicles error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Admin: Get all vehicles
// -----------------------------
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .populate("riderId", "name mobile")
      .populate("categoryId", "name type")
      .sort({ createdAt: -1 });

    return res.json({ success: true, vehicles });
  } catch (err) {
    console.error("getAllVehicles error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Get vehicle by ID
// -----------------------------
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate("riderId", "name mobile")
      .populate("categoryId", "name type");

    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    return res.json({ success: true, vehicle });
  } catch (err) {
    console.error("getVehicleById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Update Vehicle
// -----------------------------
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

    const updateData = { ...req.body };

    if (req.files?.front) updateData.images = { ...vehicle.images, front: req.files.front[0].path };
    if (req.files?.back) updateData.images = { ...vehicle.images, back: req.files.back[0].path };
    if (req.files?.leftSide) updateData.images = { ...vehicle.images, leftSide: req.files.leftSide[0].path };
    if (req.files?.rightSide) updateData.images = { ...vehicle.images, rightSide: req.files.rightSide[0].path };
    if (req.files?.insurance) updateData.insurance = req.files.insurance[0].path;
    if (req.files?.pollutionCert) updateData.pollutionCert = req.files.pollutionCert[0].path;

    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.json({ success: true, message: "Vehicle updated", vehicle: updatedVehicle });
  } catch (err) {
    console.error("updateVehicle error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Delete Vehicle
// -----------------------------
// Delete Vehicle
// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    const riderId = vehicle.riderId;

    await vehicle.deleteOne();

    const rider = await Rider.findById(riderId);
    if (rider) {
      rider.vehicleCount = await Vehicle.countDocuments({ riderId });
      await rider.save();
    }

    return res.json({ success: true, message: "Vehicle deleted" });
  } catch (err) {
    console.error("deleteVehicle error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


