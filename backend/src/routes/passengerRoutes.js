const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // for handling multipart/form-data

const {
  registerRider,
  verifyRiderOtp,
  resendOtp,
  getAllRiders,
  getRiderById,
  updateRider,
  deleteRider,
  approveRider,
  rejectRider,
  addReview,
} = require("../controllers/riderController");

// Rider registration & OTP

// Step 1 — Register Rider + Send OTP
router.post("/register", upload.fields([
  { name: "aadharFront" },
  { name: "aadharBack" },
  { name: "selfie" },
]), registerRider);

// Step 2 — Verify OTP
router.post("/verify-otp", verifyRiderOtp);

// Resend OTP
router.post("/resend-otp", resendOtp);

// CRUD Operations
router.get("/", getAllRiders);          // Get all riders
router.get("/:id", getRiderById);      // Get single rider
router.put("/:id", updateRider);       // Update rider
router.delete("/:id", deleteRider);    // Delete rider

// Admin Approve / Reject Rider
router.post("/:id/approve", approveRider);
router.post("/:id/reject", rejectRider);

// Passenger Reviews
router.post("/:riderId/review", addReview);

module.exports = router;
