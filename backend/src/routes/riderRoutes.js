const express = require("express");
const router = express.Router();
const riderController = require("../controllers/riderController");
const upload = require("../middlewares/multer");

// Step 1: Register + Send OTP
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
router.post("/resend-otp", riderController.resendOtp);



module.exports = router;