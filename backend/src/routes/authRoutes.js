const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtpAndLogin } = require("../controllers/authController");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndLogin);

module.exports = router;
