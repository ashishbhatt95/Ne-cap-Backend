const express = require("express");
const router = express.Router();
const adminAuth = require("../controllers/adminAuthController");

// Admin OTP & login routes
router.post("/send-otp", adminAuth.sendAdminOtp);
router.post("/verify-otp", adminAuth.verifyAdminOtpAndLogin);

module.exports = router;
