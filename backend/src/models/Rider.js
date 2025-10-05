const mongoose = require("mongoose");

const RiderSchema = new mongoose.Schema(
  {
    name: String,
    dob: Date,
    fatherName: String,
    motherName: String,
    email: String,
    mobile: { type: String, required: true },
    aadharNumber: String,
    panNumber: String,
    address: String,
    aadharFront: String,
    aadharBack: String,
    selfie: String,
    otpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rider", RiderSchema);
