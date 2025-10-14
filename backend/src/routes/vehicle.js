const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const upload = require("../middlewares/multer");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// Add Vehicle (Rider)
router.post(
  "/add",
  roleAuthorization(["rider"]),
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
router.get("/my-vehicles", roleAuthorization(["rider"]), vehicleController.getRiderVehicles);

// Admin: Get all vehicles
router.get("/", roleAuthorization(["admin"]), vehicleController.getAllVehicles);

// Get vehicle by ID
router.get("/:id", roleAuthorization(["rider", "admin"]), vehicleController.getVehicleById);

// Update vehicle
router.put(
  "/:id",
  roleAuthorization(["rider", "admin"]),
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
router.delete("/:id", roleAuthorization(["admin", "rider"]), vehicleController.deleteVehicle);

module.exports = router;
