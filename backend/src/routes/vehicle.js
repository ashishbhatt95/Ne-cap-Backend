const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const upload = require("../middlewares/multer");

// Add Vehicle
router.post(
  "/add",
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

// Rider: Get all vehicles added by self
router.get("/my-vehicles", vehicleController.getRiderVehicles);

// Admin: Get all vehicles
router.get("/", vehicleController.getAllVehicles);

// Get vehicle by ID
router.get("/:id", vehicleController.getVehicleById);

// Update vehicle
router.put(
  "/:id",
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
router.delete("/:id", vehicleController.deleteVehicle);

module.exports = router;
