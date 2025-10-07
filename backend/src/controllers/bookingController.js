const Booking = require("../models/Booking");
const VehicleCategory = require("../models/VehicleCategory");

// 📘 Create new booking (User)
exports.createBooking = async (req, res) => {
  try {
    const {
      passengerId,
      pickupLocation,
      dropLocation,
      distance,
      pickupDate,
      rideEndDate,
      maleCount,
      femaleCount,
      kidsCount,
      selectedCar,
      acType,
      additionalDetails,
    } = req.body;

    if (
      !passengerId ||
      !pickupLocation ||
      !dropLocation ||
      !pickupDate ||
      !rideEndDate ||
      !selectedCar ||
      !acType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const car = await VehicleCategory.findById(selectedCar);
    if (!car) return res.status(404).json({ message: "Vehicle category not found" });

    const pickup = new Date(pickupDate);
    const drop = new Date(rideEndDate);
    const days = Math.max(1, Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24)));
    const totalPassengers = (maleCount || 0) + (femaleCount || 0) + (kidsCount || 0);
    const totalPrice = car.minPricePerKm * (distance || 0) * days;

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
      totalPassengers,
      selectedCar,
      acType,
      additionalDetails,
      journeyDays: days,
      finalPrice: totalPrice,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking create error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📋 Get all bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("passengerId", "name email mobile")
      .populate("selectedCar", "name type minPricePerKm")
      .populate("riderId", "name mobile");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// 🔍 Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId")
      .populate("riderId")
      .populate("selectedCar");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

// 👨‍✈️ Assign rider manually (Admin)
exports.assignRider = async (req, res) => {
  try {
    const { riderId, finalPrice } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.riderId = riderId;
    booking.status = "rider-assigned";
    if (finalPrice) booking.finalPrice = finalPrice;

    await booking.save();
    res.status(200).json({ message: "Rider assigned successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign rider" });
  }
};

// 🔄 Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();
    res.status(200).json({ message: "Status updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

// ❌ Cancel booking (Admin, Rider, or User)
exports.cancelBooking = async (req, res) => {
  try {
    const { role, reason } = req.body; 
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Already cancelled or completed
    if (booking.status === "cancelled" || booking.status === "completed") {
      return res.status(400).json({ message: `Booking already ${booking.status}` });
    }

    // Rules
    if (role === "user") {
      if (["rider-assigned", "completed"].includes(booking.status)) {
        return res
          .status(403)
          .json({ message: "You can't cancel after rider assignment or ride completion" });
      }
    } else if (role === "rider") {
      if (booking.status !== "rider-assigned") {
        return res
          .status(403)
          .json({ message: "Rider can cancel only assigned bookings" });
      }
    } else if (role !== "admin") {
      return res.status(403).json({ message: "Invalid role provided" });
    }

    booking.status = "cancelled";
    booking.cancelledBy = role;
    booking.cancelReason = reason || "No reason provided";
    booking.cancelledAt = new Date();

    await booking.save();

    res.status(200).json({
      message: `Booking cancelled successfully by ${role}`,
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
