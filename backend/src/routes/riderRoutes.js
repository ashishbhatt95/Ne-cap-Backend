const express = require("express");
const router = express.Router();
const riderController = require("../controllers/riderController");
const upload = require("../middlewares/multer");

// -----------------------------
// OTP & Registration
// -----------------------------

// Step 1: Register Rider + Send OTP (with document upload)
router.post(
  "/register",
  upload.fields([
    { name: "aadharFront", maxCount: 1 },
    { name: "aadharBack", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  riderController.registerRider
);

// Step 2: Verify OTP
router.post("/verify-otp", riderController.verifyRiderOtp);

// Resend OTP
router.post("/resend-otp", riderController.resendOtp);

// -----------------------------
// CRUD Operations
// -----------------------------
router.get("/", riderController.getAllRiders);          // Get all riders
router.get("/:id", riderController.getRiderById);      // Get rider by ID
router.put("/:id", riderController.updateRider);       // Update rider
router.delete("/:id", riderController.deleteRider);    // Delete rider

// -----------------------------
// Admin Approve / Reject
// -----------------------------
router.put("/:id/approve", riderController.approveRider);
router.put("/:id/reject", riderController.rejectRider);

// -----------------------------
// Add Passenger Review
// -----------------------------
router.post("/:riderId/review", riderController.addReview);

module.exports = router;