const axios = require("axios");
const Otp = require("../models/Otp");

// 6-digit OTP generator
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Send OTP via TrueBulkSMS
 * Returns an object: { success: boolean, message: string, logId?: string }
 */
exports.createAndSendOtp = async (mobile) => {
  // Validate mobile
  if (!/^\d{10}$/.test(mobile)) {
    return { success: false, message: "Invalid mobile number" };
  }

  const otp = generateOtp();

  // Remove any previous OTPs for this mobile
  await Otp.deleteMany({ mobile });

  // Save new OTP with 5-minute expiry
  await Otp.create({
    mobile,
    otp,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  });

  const message = `${otp} is your One Time Passcode for registration. SSWAIT`;

  const params = {
    APIKEY: process.env.TRUEBULKSMS_API_KEY,
    sender: process.env.TRUEBULKSMS_SENDERID,
    sendto: `${mobile}`,
    message,
    PEID: process.env.TRUEBULKSMS_PEID,
    templateid: process.env.TRUEBULKSMS_TEMPLATEID,
  };

  try {
    const response = await axios.get("http://truebulksms.biz/apikey.php", { params });
  } catch (err) {
    console.error("OTP send error:", err.message);
    return { success: false, message: "Error sending OTP: " + err.message };
  }
};
