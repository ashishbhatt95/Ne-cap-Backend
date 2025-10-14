const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleCategory", required: true },
    vehicleNumber: { type: String, required: true },
    images: {
      front: String,
      back: String,
      leftSide: String,
      rightSide: String,
    },
    insurance: { type: String },       // uploaded document URL
    pollutionCert: { type: String },   // uploaded document URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);