const jwt = require("jsonwebtoken");
const Superadmin = require("../models/admin");
const Otp = require("../models/Otp");
const { createAndSendOtp } = require("../services/otpService");

// Generate JWT for admin
const generateAdminToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// STEP 1: Send OTP (Admin)
exports.sendAdminOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number required" });
    }

    // Check if admin exists
    const admin = await Superadmin.findOne({ mobile });
    if (!admin) {
      return res.status(403).json({ success: false, message: "Access denied. Not an admin." });
    }

    // Send OTP using TrueBulkSMS
    const otp = await createAndSendOtp(mobile);

    return res.json({ success: true, message: "OTP sent to admin successfully" });
  } catch (error) {
    console.error("sendAdminOtp error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// STEP 2: Verify OTP & Login (Admin)
exports.verifyAdminOtpAndLogin = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile and OTP required" });
    }

    const admin = await Superadmin.findOne({ mobile });
    if (!admin) {
      return res.status(403).json({ success: false, message: "Access denied. Not an admin." });
    }

    // const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    // if (!otpRecord || otpRecord.otp !== otp) {
    //   return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    // }

    // (TEMP bypass during testing)
    const otpRecord = "123456";
    if (otpRecord !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const token = generateAdminToken(admin._id);
    await Otp.deleteMany({ mobile });

    return res.json({
      success: true,
      message: "Admin login successful",
      token,
      role: "admin",
    });
  } catch (error) {
    console.error("verifyAdminOtpAndLogin error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};