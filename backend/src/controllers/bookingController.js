const Booking = require("../models/Booking");
const VehicleCategory = require("../models/VehicleCategory");
const Passenger = require("../models/passengerSchema");
const Rider = require("../models/Rider");
const Superadmin = require("../models/admin");

// -------------------------------
// 1️⃣ Create new booking (User)
// -------------------------------
exports.createBooking = async (req, res) => {
  try {
    const passengerId = req.user?.id;
    if (!passengerId) return res.status(401).json({ message: "Unauthorized" });

    const passenger = await Passenger.findById(passengerId);
    if (!passenger) return res.status(404).json({ message: "User not found" });

    const {
      pickupLocation,
      dropLocation,
      distance,
      pickupDate,
      rideEndDate,
      maleCount = 0,
      femaleCount = 0,
      kidsCount = 0,
      selectedCar,
      acType,
      additionalDetails = "",
    } = req.body;

    if (!pickupLocation || !dropLocation || !pickupDate || !rideEndDate || !selectedCar || !acType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const car = await VehicleCategory.findById(selectedCar);
    if (!car) return res.status(404).json({ message: "Vehicle category not found" });

    const pickup = new Date(pickupDate);
    const drop = new Date(rideEndDate);
    const journeyDays = Math.max(1, Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24)));
    const initialPrice = car.minPricePerKm * (distance || 0) * journeyDays;

    const newBooking = await Booking.create({
      passengerId,
      pickupLocation,
      dropLocation,
      distance,
      pickupDate,
      rideEndDate,
      maleCount,
      femaleCount,
      kidsCount,
      totalPassengers: maleCount + femaleCount + kidsCount,
      selectedCar,
      acType,
      additionalDetails,
      journeyDays,
      initialPrice,
      finalPrice: initialPrice,
      status: "in-review",
      history: [{ event: "Booking created", role: "user", details: `Initial price: ${initialPrice}` }],
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------------
// 2️⃣ Get all bookings (Admin / Vendor)
// -------------------------------
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("passengerId", "name email mobile")
      .populate("selectedCar", "name type minPricePerKm")
      .populate("riderId", "name mobile");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// -------------------------------
// 3️⃣ Get booking by ID (Role-based access)
// -------------------------------
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId")
      .populate("riderId")
      .populate("selectedCar");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role === "user" && booking.passengerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "rider" && (!booking.riderId || booking.riderId._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Forbidden: Not assigned" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------------
// 4️⃣ Get candidate riders for booking (Admin)
// -------------------------------
exports.getCandidateRiders = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("selectedCar");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Filter available riders
    const overlappingBookings = await Booking.find({
      riderId: { $ne: null },
      status: { $in: ["rider-assigned", "in-process"] },
      $or: [
        { pickupDate: { $lte: booking.rideEndDate, $gte: booking.pickupDate } },
        { rideEndDate: { $gte: booking.pickupDate, $lte: booking.rideEndDate } },
      ],
    }).select("riderId");

    const busyRiderIds = overlappingBookings.map(b => b.riderId.toString());

    const candidateRiders = await Rider.find({
      _id: { $nin: busyRiderIds },
      isApproved: true,
      vehicleCount: { $gt: 0 },
    });

    res.status(200).json(candidateRiders);
  } catch (error) {
    console.error("Get candidate riders error:", error);
    res.status(500).json({ message: "Failed to fetch candidate riders" });
  }
};

// -------------------------------
// 5️⃣ Assign rider manually (Admin / Vendor)
// -------------------------------
exports.assignRider = async (req, res) => {
  try {
    const { riderId, finalPrice } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.riderId = riderId;
    booking.status = "rider-assigned";

    if (finalPrice) booking.finalPrice = finalPrice;

    booking.history.push({ event: "Rider assigned", role: req.user.role, details: `Rider ID: ${riderId}, finalPrice: ${booking.finalPrice}` });

    await booking.save();

    // TODO: Trigger notification to rider & user (app/email/SMS)
    // notificationSystem.notify(riderId, "New booking assigned");
    // notificationSystem.notify(booking.passengerId, `Rider assigned, final price: ${booking.finalPrice}`);

    res.status(200).json({ message: "Rider assigned successfully", booking });
  } catch (error) {
    console.error("Assign rider error:", error);
    res.status(500).json({ message: "Failed to assign rider" });
  }
};

// -------------------------------
// 6️⃣ Update booking status (Rider / Admin / Vendor)
// -------------------------------
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    booking.history.push({ event: "Status updated", role: req.user.role, details: status });

    await booking.save();
    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

// -------------------------------
// 7️⃣ Cancel booking (Role-based)
// -------------------------------
exports.cancelBooking = async (req, res) => {
  try {
    const { role, reason = "No reason provided" } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (["cancelled", "completed"].includes(booking.status)) {
      return res.status(400).json({ message: `Booking already ${booking.status}` });
    }

    // Role-based cancel rules
    if (role === "user" && ["rider-assigned", "completed"].includes(booking.status)) {
      return res.status(403).json({ message: "Cannot cancel after rider assignment or ride completion" });
    }
    if (role === "rider" && booking.riderId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Rider can cancel only assigned bookings" });
    }

    booking.status = "cancelled";
    booking.cancelledBy = role;
    booking.cancelReason = reason;
    booking.cancelledAt = new Date();

    booking.history.push({ event: "Booking cancelled", role, details: reason });

    await booking.save();

    res.status(200).json({ message: `Booking cancelled by ${role}`, booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------------
// 8️⃣ Submit review/rating (User after ride complete)
// -------------------------------
exports.submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const booking = await Booking.findById(req.params.id).populate("riderId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "completed") return res.status(400).json({ message: "Ride not completed yet" });

    // Update rider reviews
    const rider = booking.riderId;
    if (!rider.reviews) rider.reviews = [];
    rider.reviews.push(rating);
    rider.reviewCount = rider.reviews.length;
    rider.averageRating = rider.reviews.reduce((a,b)=>a+b,0)/rider.reviews.length;

    await rider.save();

    booking.history.push({ event: "Review submitted", role: "user", details: `Rating: ${rating}, Comment: ${comment}` });
    await booking.save();

    res.status(200).json({ message: "Review submitted successfully", booking });
  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
