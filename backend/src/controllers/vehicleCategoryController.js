const VehicleCategory = require("../models/VehicleCategory");
const { uploadImages } = require("../services/cloudinary");

// ------------------------------------
// Add Vehicle Category (Admin)
// ------------------------------------
exports.addVehicleCategory = async (req, res) => {
  try {
    const {
      name,
      type,
      minPricePerKm,
      fuelType,
      personCapacity,
      acType,
      status,
    } = req.body;

    if (!name || !type || !minPricePerKm || !fuelType || !personCapacity || !acType) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    let imageUrl = "";
    if (req.files?.image && req.files.image.length > 0) {
      const uploaded = await uploadImages(req.files.image, "vehicleCategory");
      imageUrl = uploaded[0]?.url || "";
    }

    const newCategory = await VehicleCategory.create({
      name,
      type,
      minPricePerKm,
      fuelType,
      image: imageUrl,
      personCapacity,
      acType,
      status: status || "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle category added successfully",
      data: newCategory,
    });
  } catch (err) {
    console.error("addVehicleCategory error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------------
// Get All Vehicle Categories
// ------------------------------------
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await VehicleCategory.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    console.error("getAllCategories error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------------
// Get Single Vehicle Category by ID
// ------------------------------------
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await VehicleCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error("getCategoryById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------------
// Update Vehicle Category
// ------------------------------------
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.files?.image && req.files.image.length > 0) {
      const uploaded = await uploadImages(req.files.image, "vehicleCategory");
      updates.image = uploaded[0]?.url || updates.image;
    }

    const updatedCategory = await VehicleCategory.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle category updated successfully",
      data: updatedCategory,
    });
  } catch (err) {
    console.error("updateCategory error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------------
// Delete Vehicle Category
// ------------------------------------
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VehicleCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vehicle category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle category deleted successfully",
    });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
