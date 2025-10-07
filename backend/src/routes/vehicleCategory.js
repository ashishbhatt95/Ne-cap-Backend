const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleCategoryController");
const upload = require("../middlewares/multer");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Add Vehicle Category (Admin)
router.post("/add", verifyToken, allowRoles("superadmin"), upload.fields([{ name: "image", maxCount: 1 }]), vehicleController.addVehicleCategory);

// Get all categories
router.get("/", verifyToken, allowRoles("superadmin", "vendor"), vehicleController.getAllCategories);

// Get category by ID
router.get("/:id", verifyToken, allowRoles("superadmin", "vendor"), vehicleController.getCategoryById);

// Update category
router.put("/:id", verifyToken, allowRoles("superadmin"), upload.fields([{ name: "image", maxCount: 1 }]), vehicleController.updateCategory);

// Delete category
router.delete("/:id", verifyToken, allowRoles("superadmin"), vehicleController.deleteCategory);

module.exports = router;
