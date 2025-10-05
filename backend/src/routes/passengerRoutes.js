const express = require("express");
const router = express.Router();
const {
  signupSendOtp,
  verifyOtpAndRegister,
} = require("../controllers/passengerController");

// Step 1 — Send OTP
router.post("/signup/send-otp", signupSendOtp);

// Step 2 — Verify OTP and Register
router.post("/signup/verify-otp", verifyOtpAndRegister);

module.exports = router;
