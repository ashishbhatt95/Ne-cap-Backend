const express = require("express");
const router = express.Router();
const adminAuth = require("../controllers/adminAuthController");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// Admin OTP & login routes (login stays POST)
router.post("/send-otp", adminAuth.sendAdminOtp);
router.post("/verify-otp", adminAuth.verifyAdminOtpAndLogin);

// Mobile change (update resource) → use PUT
router.put(
  "/change-mobile/send-otp",
  roleAuthorization(["admin"]),
  adminAuth.sendOtpForMobileChange
);

router.put(
  "/change-mobile/verify-otp",
  roleAuthorization(["admin"]),
  adminAuth.verifyOtpAndChangeMobile
);

module.exports = router;
