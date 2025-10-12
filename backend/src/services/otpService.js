const axios = require("axios");
const Otp = require("../models/Otp");

// 🔢 Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

async function createAndSendOtp(mobile) {
  const otp = generateOtp();

  // Save OTP in database
  await Otp.create({ mobile, otp, createdAt: new Date() });

  // Message text
    const msg = `${otp} is your One Time Password (OTP) for verification on NE Cab. Please do not share it with anyone.`
  // ✅ Payload for TrueBulkSMS API
  const payload = {
    key: process.env.TRUEBULKSMS_API_KEY, // from your TrueBulkSMS account
    campaign: "OTP",
    routeid: 7, // transactional route, adjust if needed
    type: "text",
    contacts: mobile,
    senderid: process.env.TRUEBULKSMS_SENDERID, // example: SSWAIT
    msg: msg,
  };

  try {
    // 📤 Send SMS via TrueBulkSMS
    const response = await axios.post("https://truebulksms.bi/api/smsapi", null, {
      params: payload,
      headers: { "Content-Type": "application/json" },
    });

    console.log(" TrueBulkSMS Response:", response.data);
  } catch (err) {
    console.error(" SMS sending failed:", err.message);
  }

  return otp;
}

module.exports = { createAndSendOtp };
