const VehicleCategory = require("../models/VehicleCategory");
const { uploadImages } = require("../services/cloudinary"); // Reuse cloudinary upload function

// Add new category
exports.addCategory = async (req, res) => {
  try {
    const { name, type, minPricePerKm, fuelType, capacity, acType } = req.body;

    if (!name || !type || !minPricePerKm || !fuelType || !capacity || !acType) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    let imageUrl = "";
    if (req.files?.image) {
      const upload = await uploadImages(req.files.image, "vehicleCategory");
      imageUrl = upload[0].url;
    }

    const category = await VehicleCategory.create({
      name,
      type,
      minPricePerKm,
      fuelType,
      capacity,
      acType,
      image: imageUrl,
    });

    return res.json({ success: true, message: "Vehicle category added", category });
  } catch (err) {
    console.error("addCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await VehicleCategory.find();
    res.json({ success: true, categories });
  } catch (err) {
    console.error("getAllCategories error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await VehicleCategory.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, category });
  } catch (err) {
    console.error("getCategoryById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.files?.image) {
      const upload = await uploadImages(req.files.image, "vehicleCategory");
      updateData.image = upload[0].url;
    }

    const category = await VehicleCategory.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category updated", category });
  } catch (err) {
    console.error("updateCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await VehicleCategory.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    console.error("deleteCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
