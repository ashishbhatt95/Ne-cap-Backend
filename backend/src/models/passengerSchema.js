const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    dateOfBirth: { type: Date, required: true },
    mobile: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Passenger", PassengerSchema);
