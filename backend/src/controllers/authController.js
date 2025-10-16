// const jwt = require("jsonwebtoken");
// const Passenger = require("../models/passengerSchema");
// const Rider = require("../models/Rider");
// const Superadmin = require("../models/admin");
// const Otp = require("../models/Otp");
// const { createAndSendOtp } = require("../services/otpService"); // ✅ import TrueBulkSMS OTP service

// // Generate JWT
// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// // ==========================
// // STEP 1: Send OTP (TrueBulkSMS Integration)
// // ==========================
// exports.sendOtp = async (req, res) => {
//   try {
//     const { mobile } = req.body;
//     if (!mobile) {
//       return res.status(400).json({ success: false, message: "Mobile number required" });
//     }

//     // ✅ Send OTP using TrueBulkSMS service
//     const otp = await createAndSendOtp(mobile);

//     console.log(`📱 OTP for ${mobile}: ${otp}`);

//     return res.json({ success: true, message: "OTP sent successfully" });
//   } catch (error) {
//     console.error("sendOtp error:", error.message);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // ==========================
// // STEP 2: Verify OTP & Login
// // ==========================
// exports.verifyOtpAndLogin = async (req, res) => {
//   try {
//     const { mobile, otp } = req.body;
//     if (!mobile || !otp) {
//       return res.status(400).json({ success: false, message: "Mobile and OTP required" });
//     }

//     // const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });

//     // if (!otpRecord) {
//     //   return res.status(400).json({ success: false, message: "OTP not found or expired" });
//     // }

//     const otpRecord = "123456";

//     // if (otpRecord.otp !== otp) {
//     //   return res.status(400).json({ success: false, message: "Invalid OTP" });
//     // }

// if (otpRecord !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }
    
//     // Find user in all roles
//     let user = await Passenger.findOne({ mobile });
//     let role = "user";

//     if (!user) {
//       user = await Rider.findOne({ mobile });
//       role = "rider";
//     }
//     if (!user) {
//       user = await Superadmin.findOne({ mobile });
//       role = "admin";
//     }

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not registered. Please sign up first.",
//       });
//     }

//     // ✅ Generate JWT
//     const token = generateToken(user._id, role);

//     // ✅ Delete OTP after successful verification
//     await Otp.deleteMany({ mobile });

//     return res.json({
//       success: true,
//       message: "Login successful",
//       token,
//       role,
//     });
//   } catch (error) {
//     console.error("verifyOtpAndLogin error:", error.message);
//     return res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };
