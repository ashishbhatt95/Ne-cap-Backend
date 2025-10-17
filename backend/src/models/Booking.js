const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: "Passenger", required: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: "Rider", default: null },
    candidateRiders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rider" }],
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    distance: { type: Number, default: 0 },
    pickupDate: { type: Date, required: true },
    rideEndDate: { type: Date, required: true },
    journeyDays: { type: Number, default: 1 },
    maleCount: { type: Number, default: 0 },
    femaleCount: { type: Number, default: 0 },
    kidsCount: { type: Number, default: 0 },
    totalPassengers: { type: Number, default: 0 },
    selectedCar: { type: mongoose.Schema.Types.ObjectId, ref: "VehicleCategory", required: true },
    acType: { type: String, enum: ["AC", "Non-AC"], required: true },
    additionalDetails: { type: String, default: "" },
    initialPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in-review", "in-process", "rider-assigned", "completed", "cancelled"],
      default: "in-review",
    },
    cancelledBy: { type: String, enum: ["user", "rider", "admin", null], default: null },
    cancelReason: { type: String, default: "" },
    cancelledAt: { type: Date, default: null },
    history: [
      { event: String, role: String, date: { type: Date, default: Date.now }, details: String },
    ],
    notificationsSent: [{ type: String }],
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  this.totalPassengers = this.maleCount + this.femaleCount + this.kidsCount;

  if (this.pickupDate && this.rideEndDate) {
    const diff = (new Date(this.rideEndDate).getTime() - new Date(this.pickupDate).getTime()) / (1000 * 60 * 60 * 24);
    this.journeyDays = Math.max(1, Math.ceil(diff));
  }

  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
