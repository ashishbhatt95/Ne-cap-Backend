const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const upload = require("../middlewares/multer");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// Add Vehicle (Rider)
router.post(
  "/add",
  verifyToken,
  allowRoles("rider"),
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "leftSide", maxCount: 1 },
    { name: "rightSide", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "pollutionCert", maxCount: 1 },
  ]),
  vehicleController.addVehicle
);

// Rider: Get own vehicles
router.get("/my-vehicles", verifyToken, allowRoles("rider"), vehicleController.getRiderVehicles);

// Admin: Get all vehicles
router.get("/", verifyToken, allowRoles("superadmin"), vehicleController.getAllVehicles);

// Get vehicle by ID
router.get("/:id", verifyToken, vehicleController.getVehicleById);

// Update vehicle
router.put(
  "/:id",
  verifyToken,
  allowRoles("rider", "superadmin"),
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
    { name: "leftSide", maxCount: 1 },
    { name: "rightSide", maxCount: 1 },
    { name: "insurance", maxCount: 1 },
    { name: "pollutionCert", maxCount: 1 },
  ]),
  vehicleController.updateVehicle
);

// Delete vehicle
router.delete("/:id", verifyToken, allowRoles("superadmin", "rider"), vehicleController.deleteVehicle);

module.exports = router;
