const mongoose = require("mongoose");

const VehicleCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    minPricePerKm: { type: Number, required: true },
    fuelType: { type: String, required: true },
    image: { type: String },
    personCapacity: { type: Number, required: true },
    acType: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleCategory", VehicleCategorySchema);
