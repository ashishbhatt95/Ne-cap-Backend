// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
      index: true
    },
    
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
      index: true
    },
    
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      required: true,
      index: true
    },

    // Review Details
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    
    comment: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Indexes
reviewSchema.index({ riderId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;