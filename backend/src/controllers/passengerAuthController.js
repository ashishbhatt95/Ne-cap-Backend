const jwt = require("jsonwebtoken");
const Passenger = require("../models/passengerSchema");
const Otp = require("../models/Otp");
const { createAndSendOtp } = require("../services/otpService");

// Generate JWT for passenger
const generatePassengerToken = (id) => {
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// STEP 1: Send OTP
exports.sendPassengerOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile number required" });
    }

    // Send OTP via TrueBulkSMS
    const otp = await createAndSendOtp(mobile);

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendPassengerOtp error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.verifyPassengerOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile and OTP required" });
    }

    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const passenger = await Passenger.findOne({ mobile });

    if (!passenger) {
      // First-time user → do NOT generate token
      return res.json({
        success: true,
        isRegister: false,
        mobile,
        message: "First-time user. Please complete registration.",
      });
    }

    // Existing user → generate token
    const token = generatePassengerToken(passenger._id);

    // Clean up OTP after successful login
    await Otp.deleteMany({ mobile });

    return res.json({
      success: true,
      isRegister: true,
      mobile,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("verifyPassengerOtp error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


