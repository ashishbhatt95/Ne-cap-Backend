const VehicleCategory = require("../models/VehicleCategory");
const { uploadImages } = require("../services/cloudinary");

// -----------------------------
// Add Vehicle Category (Admin)
// -----------------------------
exports.addVehicleCategory = async (req, res) => {
  try {
    console.log("Incoming vehicle category data:", req.body);
    console.log("Incoming files:", req.files);

    const { name, type, minPricePerKm, fuelType, personCapacity, acType } = req.body;

    if (!name || !type || !minPricePerKm || !fuelType || !personCapacity || !acType) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    let imageUrl = "";
    if (req.files?.image && req.files.image.length > 0) {
      const uploaded = await uploadImages(req.files.image, "vehicleCategory");
      imageUrl = uploaded[0]?.url || "";
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image upload failed or not provided" });
    }

    const newCategory = await VehicleCategory.create({
      name,
      type,
      minPricePerKm,
      fuelType,
      personCapacity,
      acType,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle category added successfully",
    });
  } catch (err) {
    console.error("addVehicleCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Get All Categories
// -----------------------------
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await VehicleCategory.find();
    return res.json({ success: true, categories });
  } catch (err) {
    console.error("getAllCategories error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Get Category by ID
// -----------------------------
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await VehicleCategory.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    return res.json({ success: true, category });
  } catch (err) {
    console.error("getCategoryById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Update Category
// -----------------------------
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.files?.image && req.files.image.length > 0) {
      const uploaded = await uploadImages(req.files.image, "vehicleCategory");
      updates.image = uploaded[0]?.url || updates.image;
    }

    const updatedCategory = await VehicleCategory.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCategory) return res.status(404).json({ success: false, message: "Category not found" });

    return res.json({ success: true, message: "Category updated", category: updatedCategory });
  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Delete Category
// -----------------------------
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await VehicleCategory.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    return res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
