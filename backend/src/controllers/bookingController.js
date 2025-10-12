const Booking = require("../models/Booking");
const VehicleCategory = require("../models/VehicleCategory");
const Passenger = require("../models/passengerSchema"); // ✅ Added
const Rider = require("../models/Rider");               // If needed
const Superadmin = require("../models/admin");         // If needed

// 📘 Create new booking (User)
exports.createBooking = async (req, res) => {
  try {
    console.log("🔥 Incoming request body:", req.body);
    console.log("🔑 User info from JWT:", req.user);

    const passengerId = req.user?.id; // from JWT
    if (!passengerId) {
      console.warn("⚠️ Passenger ID missing in token");
      return res.status(401).json({ message: "Unauthorized: User not found in token" });
    }

    // Verify passenger exists in DB
    const passenger = await Passenger.findById(passengerId);
    if (!passenger) {
      console.error(`❌ Passenger with ID ${passengerId} not found in DB`);
      return res.status(404).json({ message: "User not found" });
    }
    console.log("✅ Passenger found:", passenger);

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

    // Required fields
    if (!pickupLocation || !dropLocation || !pickupDate || !rideEndDate || !selectedCar || !acType) {
      console.warn("⚠️ Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate vehicle category
    const car = await VehicleCategory.findById(selectedCar);
    if (!car) {
      console.error(`❌ Vehicle category with ID ${selectedCar} not found`);
      return res.status(404).json({ message: "Vehicle category not found" });
    }
    console.log("✅ Vehicle category found:", car);

    // Calculate journey days and total price
    const pickup = new Date(pickupDate);
    const drop = new Date(rideEndDate);
    const journeyDays = Math.max(1, Math.ceil((drop - pickup) / (1000 * 60 * 60 * 24)));
    const totalPassengers = maleCount + femaleCount + kidsCount;
    const totalPrice = car.minPricePerKm * (distance || 0) * journeyDays;

    console.log("📊 Journey Days:", journeyDays);
    console.log("👥 Total Passengers:", totalPassengers);
    console.log("💰 Total Price:", totalPrice);

    // Create booking
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
      journeyDays,
      finalPrice: totalPrice,
    });

    console.log("✅ Booking created successfully:", newBooking);

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking create error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 📋 Get all bookings (Admin / Vendor)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("passengerId", "name email mobile")
      .populate("selectedCar", "name type minPricePerKm")
      .populate("riderId", "name mobile");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
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

    if (req.user.role === "user" && booking.passengerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: Cannot access other user's booking" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Fetch booking error:", error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};

// 👨‍✈️ Assign rider manually (Admin / Vendor)
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
    console.error("Assign rider error:", error);
    res.status(500).json({ message: "Failed to assign rider" });
  }
};

// 🔄 Update booking status (Rider / Admin / Vendor)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();
    res.status(200).json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// ❌ Cancel booking (Admin / Rider / User)
exports.cancelBooking = async (req, res) => {
  try {
    const { role, reason = "No reason provided" } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (["cancelled", "completed"].includes(booking.status)) {
      return res.status(400).json({ message: `Booking already ${booking.status}` });
    }

    if (role === "user" && ["rider-assigned", "completed"].includes(booking.status)) {
      return res.status(403).json({ message: "Cannot cancel after rider assignment or ride completion" });
    }
    if (role === "rider" && booking.status !== "rider-assigned") {
      return res.status(403).json({ message: "Rider can cancel only assigned bookings" });
    }
    if (!["user", "rider", "superadmin", "vendor"].includes(role)) {
      return res.status(403).json({ message: "Invalid role provided" });
    }

    booking.status = "cancelled";
    booking.cancelledBy = role;
    booking.cancelReason = reason;
    booking.cancelledAt = new Date();

    await booking.save();
    res.status(200).json({ message: `Booking cancelled by ${role}`, booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
