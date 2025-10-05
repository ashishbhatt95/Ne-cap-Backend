const express = require("express");
const router = express.Router();
const {
  signupSendOtp,
  verifyOtpAndRegister,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger,
} = require("../controllers/passengerController");

// -----------------------------
// OTP Signup Routes
// -----------------------------
router.post("/signup/send-otp", signupSendOtp);
router.post("/signup/verify-otp", verifyOtpAndRegister);

// -----------------------------
// Passenger CRUD Routes
// -----------------------------
router.get("/", getAllPassengers);           // Get all passengers
router.get("/:id", getPassengerById);        // Get passenger by ID
router.put("/:id", updatePassenger);         // Update passenger
router.delete("/:id", deletePassenger);      // Delete passenger

module.exports = router;
