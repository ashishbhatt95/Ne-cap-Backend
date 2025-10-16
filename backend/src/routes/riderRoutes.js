const express = require("express");
const router = express.Router();
const riderController = require("../controllers/riderController");
const upload = require("../middlewares/multer");
const { roleAuthorization } = require("../middlewares/authMiddleware");
const riderAuth = require("../controllers/riderAuthController");

router.post("/send-otp", riderAuth.sendRiderOtp);
router.post("/verify-otp", riderAuth.verifyRiderOtp);

// Registration (public)
router.post(
  "/register",
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  riderController.registerRider
);
// Get all approved riders
router.get("/approved", roleAuthorization(["admin"]), riderController.getApprovedRiders);

// Get all pending riders
router.get("/pending", roleAuthorization(["admin"]), riderController.getPendingRiders);

// CRUD Operations (protected)
router.get("/", roleAuthorization(["admin"]), riderController.getAllRiders);
router.get("/:id", roleAuthorization(["admin", "rider"]), riderController.getRiderById);
router.put("/:id", roleAuthorization(["rider", "admin"]), riderController.updateRider);
router.delete("/:id", roleAuthorization(["admin"]), riderController.deleteRider);

// Admin Approve / Reject
router.put("/:id/updateRiderStatus", roleAuthorization(["admin"]), riderController.updateRiderStatus);

// Add Passenger Review
router.post("/:riderId/review", roleAuthorization(["user"]), riderController.addReview);

module.exports = router;
