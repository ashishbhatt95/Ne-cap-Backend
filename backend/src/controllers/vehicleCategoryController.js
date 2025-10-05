const VehicleCategory = require("../models/VehicleCategory");
const { uploadImages } = require("../services/cloudinary");

// Add new vehicle category (Admin)
exports.addCategory = async (req, res) => {
  try {
    const { name, type, minPricePerKm, fuelType, personCapacity, acType } = req.body;

    if (!name || !type || !minPricePerKm || !fuelType || !personCapacity || !acType) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    let imageUrl = "";
    if (req.files?.image) {
      const upload = await uploadImages(req.files.image, "vehicleCategory");
      imageUrl = upload[0].url;
    }

    const category = await VehicleCategory.create({
      name, type, minPricePerKm, fuelType, personCapacity, acType, image: imageUrl,
    });

    return res.json({ success: true, message: "Vehicle category added successfully", category });
  } catch (err) {
    console.error("addCategory error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await VehicleCategory.find();
    return res.json({ success: true, categories });
  } catch (err) {
    console.error("getAllCategories error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
