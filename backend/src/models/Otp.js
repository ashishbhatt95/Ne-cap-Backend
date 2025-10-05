const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    mobile: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3000 }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", OtpSchema);