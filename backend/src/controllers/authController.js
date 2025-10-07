const jwt = require("jsonwebtoken");
const Passenger = require("../models/passengerSchema");
const Rider = require("../models/Rider");
const Vendor = require("../models/Vendor");
const Superadmin = require("../models/Superadmin");
const Otp = require("../models/Otp");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ==========================
// STEP 1: Send OTP
// ==========================
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number required" });
    }

    const otpCode = "123456";
    await Otp.findOneAndUpdate(
      { mobile },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`📱 OTP for ${mobile}: ${otpCode}`);
    return res.json({ success: true, message: "OTP sent successfully (static 123456)" });
  } catch (error) {
    console.error("sendOtp error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ==========================
// STEP 2: Verify OTP & Login
// ==========================
exports.verifyOtpAndLogin = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile and OTP required" });
    }

    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found or expired" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Find user across all roles
    let user =
      (await Passenger.findOne({ mobile })) ||
      (await Rider.findOne({ mobile })) ||
      (await Vendor.findOne({ mobile })) ||
      (await Superadmin.findOne({ mobile }));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered. Please sign up first.",
      });
    }

    // Identify role
    let role = "user";
    if (await Rider.findOne({ mobile })) role = "rider";
    if (await Vendor.findOne({ mobile })) role = "vendor";
    if (await Superadmin.findOne({ mobile })) role = "superadmin";

    // Generate token
    const token = generateToken(user._id, role);
    await Otp.deleteMany({ mobile }); // Clean OTP

    return res.json({
      success: true,
      message: "Login successful",
      token,
      role,
    });
  } catch (error) {
    console.error("verifyOtpAndLogin error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
