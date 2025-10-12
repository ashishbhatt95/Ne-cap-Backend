const mongoose = require("mongoose");

const RiderSchema = new mongoose.Schema(
  {
    name: String,
    dob: Date,
    fatherName: String,
    motherName: String,
    email: String,
    mobile: { type: String, required: true, unique: true },
    aadharNumber: String,
    panNumber: String,
    address: String,
    aadharFront: String,
    aadharBack: String,
    selfie: String,
    otpVerified: { type: Boolean, default: false },
    isSubmitted: { type: Boolean, default: false }, // rider submitted registration
    isApproved: { type: Boolean, default: false },  // admin approval
    role: { type: String, default: "rider" },       // <-- add this

    // Reviews simplified: only numbers
    reviews: [Number], // array of rating numbers
    reviewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rider", RiderSchema);
