const jwt = require("jsonwebtoken");
const Rider = require("../models/Rider");
const Otp = require("../models/Otp");
const { createAndSendOtp } = require("../services/otpService");

// Generate JWT for rider
const generateRiderToken = (id) => {
  return jwt.sign({ id, role: "rider" }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// -----------------------------
// STEP 1: Send OTP
// -----------------------------
exports.sendRiderOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number required" });
    }

    // Send OTP via TrueBulkSMS
    const otp = await createAndSendOtp(mobile);
    console.log(`📱 OTP for rider ${mobile}: ${otp}`);

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendRiderOtp error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// STEP 2: Verify OTP & Check Registration
// -----------------------------
exports.verifyRiderOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile and OTP required" });
    }

    // TEMP bypass for testing
    const otpRecord = "123456";
    // In production: const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });

    if (otpRecord !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check if rider exists
    const rider = await Rider.findOne({ mobile });

    if (!rider) {
      // First-time user → no token
      return res.json({
        success: true,
        isRegister: false,
        mobile,  
        message: "First-time rider. Please complete registration.",
      });
    }

    // Existing rider → generate token
    const token = generateRiderToken(rider._id);

    // Clean up OTP
    await Otp.deleteMany({ mobile });

    return res.json({
      success: true,
      isRegister: true,
      mobile,  
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("verifyRiderOtp error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
