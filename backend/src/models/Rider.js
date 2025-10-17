const mongoose = require("mongoose");

const RiderSchema = new mongoose.Schema(
  {
    riderId: { type: String, unique: true },
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
    isSubmitted: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    role: { type: String, default: "rider" },
    reviews: [Number],
    reviewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    vehicleCount: { type: Number, default: 0 },
    registrationDate: { type: Date, default: Date.now },
    currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    availabilityStatus: { type: String, enum: ["available", "busy", "offline"], default: "available" },
    bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rider", RiderSchema);
