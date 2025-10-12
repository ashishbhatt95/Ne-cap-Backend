const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema(
  {
    passengerId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    dateOfBirth: { type: Date, required: true },
    mobile: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["normal", "buyer"], default: "normal" },
    bookingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Passenger", PassengerSchema);
