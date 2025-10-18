const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleCategoryController");
const upload = require("../middlewares/multer");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// Add Vehicle Category (Admin)
router.post(
  "/add",
  roleAuthorization(["admin"]),
  upload.fields([{ name: "image", maxCount: 1 }]),
  vehicleController.addVehicleCategory
);

// Get All Vehicle Categories (Admin, Vendor)
router.get("/", vehicleController.getAllCategories);

// Get Vehicle Category by ID (Admin, Vendor)
router.get("/:id", roleAuthorization(["admin", "vendor"]), vehicleController.getCategoryById);

// Update Vehicle Category (Admin)
router.put(
  "/:id",
  roleAuthorization(["admin"]),
  upload.fields([{ name: "image", maxCount: 1 }]),
  vehicleController.updateCategory
);

// Delete Vehicle Category (Admin)
router.delete("/:id", roleAuthorization(["admin"]), vehicleController.deleteCategory);

module.exports = router;
