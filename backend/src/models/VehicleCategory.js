const mongoose = require("mongoose");

const VehicleCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // Vehicle Name
    type: { type: String, required: true },          // Vehicle Type (dropdown)
    minPricePerKm: { type: Number, required: true }, // Minimum Price (/KM)
    fuelType: { type: String, required: true },      // Fuel type
    image: { type: String },                         // Image URL/Icon
    personCapacity: { type: Number, required: true },// Seats
    acType: { type: String, required: true }, // AC/Non AC
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleCategory", VehicleCategorySchema);