const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleCategoryController");
const upload = require("../middlewares/multer");

// Add Vehicle Category (Admin)
router.post("/add", upload.fields([{ name: "image", maxCount: 1 }]), vehicleController.addVehicleCategory);

// Get all categories
router.get("/", vehicleController.getAllCategories);

// Get category by ID
router.get("/:id", vehicleController.getCategoryById);

// Update category
router.put("/:id", upload.fields([{ name: "image", maxCount: 1 }]), vehicleController.updateCategory);

// Delete category
router.delete("/:id", vehicleController.deleteCategory);

module.exports = router;
