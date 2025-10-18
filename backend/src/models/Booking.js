// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // User Information
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
      index: true
    },

    // Location Details
    pickupLocation: {
      type: String,
      required: true,
      trim: true
    },
    dropLocation: {
      type: String,
      required: true,
      trim: true
    },
    distance: {
      type: Number,
      default: 0,
      min: 0
    },

    // Date & Time
    pickupDate: {
      type: Date,
      required: true,
      index: true
    },
    rideEndDate: {
      type: Date,
      required: true,
      index: true
    },
    journeyDays: {
      type: Number,
      default: 1,
      min: 1
    },

    // Passenger Count
    maleCount: {
      type: Number,
      default: 0,
      min: 0
    },
    femaleCount: {
      type: Number,
      default: 0,
      min: 0
    },
    kidsCount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalPassengers: {
      type: Number,
      default: 0,
      min: 0
    },

    // Vehicle Information
    selectedCar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VehicleCategory",
      required: true
    },
    acType: {
      type: String,
      required: true,
      enum: ["AC", "Non-AC", "Both"]
    },

    // Rider Assignment
    riderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      default: null,
      index: true
    },

    // Pricing
    initialPrice: {
      type: Number,
      required: true,
      min: 0
    },
    finalPrice: {
      type: Number,
      default: null,
      min: 0
    },

    // Booking Status
    status: {
      type: String,
      required: true,
      enum: [
        "in-review",          // Pending admin approval
        "rider-offer-sent",   // Offers sent to multiple riders
        "rider-assigned",     // Rider assigned/accepted, waiting to start
        "in-process",         // Trip in progress
        "completed",          // Trip completed
        "cancelled"           // Cancelled by user/rider/admin
      ],
      default: "in-review",
      index: true
    },

    // Cancellation Details
    cancelledBy: {
      type: String,
      enum: ["user", "rider", "admin", "vendor"],
      default: null
    },
    cancelReason: {
      type: String,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },

    // Additional Information
    additionalDetails: {
      type: String,
      default: "",
      trim: true
    },

    // Acceptance timestamp (when rider accepts)
    acceptedAt: {
      type: Date,
      default: null
    },

    // Booking History (Timeline)
    history: [
      {
        event: {
          type: String,
          required: true
        },
        role: {
          type: String,
          enum: ["user", "rider", "admin", "vendor", "system"],
          required: true
        },
        details: {
          type: String,
          default: ""
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Multiple riders who received offer (First come, first served)
    offeredRiders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rider"
      }
    ]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ==================== INDEXES ====================
bookingSchema.index({ passengerId: 1, status: 1 });
bookingSchema.index({ riderId: 1, status: 1 });
bookingSchema.index({ pickupDate: 1, rideEndDate: 1 });
bookingSchema.index({ createdAt: -1 });

// ==================== VIRTUAL FIELDS ====================
bookingSchema.virtual("isActive").get(function () {
  return ["rider-assigned", "in-process"].includes(this.status);
});

bookingSchema.virtual("isPending").get(function () {
  return this.status === "in-review";
});

bookingSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

bookingSchema.virtual("isCancelled").get(function () {
  return this.status === "cancelled";
});

// ==================== METHODS ====================

// Check if booking can be cancelled by user
bookingSchema.methods.canUserCancel = function () {
  return this.status === "in-review";
};

// Check if booking can be cancelled by rider
bookingSchema.methods.canRiderCancel = function (riderId) {
  if (!this.riderId) return false;
  if (this.status === "completed") return false;
  return this.riderId.toString() === riderId.toString();
};

// Check if booking can be reassigned
bookingSchema.methods.canReassign = function () {
  if (this.status === "completed") return false;
  if (this.status === "cancelled" && this.cancelledBy === "user") return false;
  return true;
};

// Add history entry
bookingSchema.methods.addHistory = function (event, role, details = "") {
  this.history.push({
    event,
    role,
    details,
    timestamp: new Date()
  });
};

// ==================== STATIC METHODS ====================

// Find overlapping bookings for a rider
bookingSchema.statics.findOverlappingBookings = async function (
  riderId,
  pickupDate,
  rideEndDate,
  excludeBookingId = null
) {
  const query = {
    riderId: riderId,
    status: { $in: ["rider-assigned", "in-process"] },
    $or: [
      {
        pickupDate: { $lte: rideEndDate },
        rideEndDate: { $gte: pickupDate }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  return this.find(query);
};

// Get bookings by status
bookingSchema.statics.findByStatus = function (status) {
  return this.find({ status })
    .populate("passengerId", "name email mobile")
    .populate("riderId", "name mobile email")
    .populate("selectedCar")
    .sort({ createdAt: -1 });
};

// Get pending bookings
bookingSchema.statics.getPendingBookings = function () {
  return this.findByStatus("in-review");
};

// Get active bookings (assigned + in-process)
bookingSchema.statics.getActiveBookings = function () {
  return this.find({ status: { $in: ["rider-assigned", "in-process"] } })
    .populate("passengerId", "name email mobile")
    .populate("riderId", "name mobile email")
    .populate("selectedCar")
    .sort({ pickupDate: 1 });
};

// Get completed bookings
bookingSchema.statics.getCompletedBookings = function () {
  return this.findByStatus("completed");
};

// Get user's booking history
bookingSchema.statics.getUserBookings = function (passengerId) {
  return this.find({ passengerId })
    .populate("riderId", "name mobile averageRating")
    .populate("selectedCar")
    .sort({ createdAt: -1 });
};

// Get rider's assigned bookings
bookingSchema.statics.getRiderBookings = function (riderId) {
  return this.find({ riderId })
    .populate("passengerId", "name mobile")
    .populate("selectedCar")
    .sort({ pickupDate: 1 });
};

// ==================== MIDDLEWARE ====================

// Pre-save: Calculate total passengers
bookingSchema.pre("save", function (next) {
  if (this.isModified("maleCount") || this.isModified("femaleCount") || this.isModified("kidsCount")) {
    this.totalPassengers = (this.maleCount || 0) + (this.femaleCount || 0) + (this.kidsCount || 0);
  }
  next();
});

// Pre-save: Validate date range
bookingSchema.pre("save", function (next) {
  if (this.rideEndDate < this.pickupDate) {
    return next(new Error("Ride end date cannot be before pickup date"));
  }
  next();
});

// ==================== EXPORT ====================
const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;