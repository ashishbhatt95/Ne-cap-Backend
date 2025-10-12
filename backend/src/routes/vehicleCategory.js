const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleCategoryController");
const upload = require("../middlewares/multer");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// Add Vehicle Category (Admin)
router.post(
  "/add",
  roleAuthorization(["superadmin"]),
  upload.fields([{ name: "image", maxCount: 1 }]),
  vehicleController.addVehicleCategory
);

// Get all categories
router.get("/", roleAuthorization(["superadmin", "vendor"]), vehicleController.getAllCategories);

// Get category by ID
router.get("/:id", roleAuthorization(["superadmin", "vendor"]), vehicleController.getCategoryById);

// Update category
router.put(
  "/:id",
  roleAuthorization(["superadmin"]),
  upload.fields([{ name: "image", maxCount: 1 }]),
  vehicleController.updateCategory
);

// Delete category
router.delete("/:id", roleAuthorization(["superadmin"]), vehicleController.deleteCategory);

module.exports = router;
