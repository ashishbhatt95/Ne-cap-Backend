const Booking = require("../models/Booking");
const VehicleCategory = require("../models/VehicleCategory");
const Passenger = require("../models/passengerSchema");
const Rider = require("../models/Rider");
const { sendNotification, notifyAdmins } = require("../utils/notificationHelper");

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
    const estimatedPrice = car.minPricePerKm * (distance || 0) * journeyDays;

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
      initialPrice: estimatedPrice,
      status: "in-review",
      history: [
        { event: "Booking created", role: "user", details: `Estimated price: ${estimatedPrice}` },
      ],
    });

    // Notify admin
    notifyAdmins("admin:new_booking", {
      bookingId: newBooking._id,
      passengerName: passenger.name,
      pickupLocation,
      dropLocation,
      message: `New booking from ${passenger.name}`
    });

    res.status(201).json({
      message: "Booking created successfully (awaiting admin review)",
      booking: {
        ...newBooking.toObject(),
        finalPrice: undefined,
      },
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
      .populate("passengerId", "name email mobile registrationDate status")
      .populate("selectedCar", "name type minPricePerKm fuelType personCapacity acType image")
      .populate("riderId", "name mobile email registrationDate averageRating reviewCount vehicleCount selfie aadharFront aadharBack")
      .sort({ createdAt: -1 });

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
      .populate("passengerId", "name email mobile registrationDate status profileImage")
      .populate("riderId", "name mobile email registrationDate averageRating reviewCount vehicleCount selfie aadharFront aadharBack vehicle")
      .populate("selectedCar");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role === "user" && booking.passengerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "rider" && booking.riderId?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: Not assigned" });
    }

    if (req.user.role === "user" && booking.status === "in-review") {
      booking.finalPrice = undefined;
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

    const candidateRiders = await Rider.find({
      isApproved: true,
      vehicleCount: { $gt: 0 },
    })
      .select("name mobile email riderId registrationDate averageRating reviewCount vehicleCount selfie vehicle isAvailable")
      .sort({ averageRating: -1, reviewCount: -1 });

    const overlappingBookings = await Booking.find({
      riderId: { $ne: null },
      status: { $in: ["rider-assigned", "in-process"] },
      $or: [
        { 
          pickupDate: { $lte: booking.rideEndDate },
          rideEndDate: { $gte: booking.pickupDate }
        }
      ],
    }).select("riderId");

    const busyRiderIds = overlappingBookings.map(b => b.riderId.toString());

    const ridersWithStatus = candidateRiders.map(rider => ({
      ...rider.toObject(),
      currentlyBusy: busyRiderIds.includes(rider._id.toString())
    }));

    res.status(200).json(ridersWithStatus);
  } catch (error) {
    console.error("Get candidate riders error:", error);
    res.status(500).json({ message: "Failed to fetch candidate riders" });
  }
};

// -------------------------------
// 5️⃣ Send offer to multiple riders (Admin only)
// -------------------------------
exports.assignRider = async (req, res) => {
  try {
    const { riderIds = [], finalPrice } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId", "name mobile");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only admin/vendor can send offers to riders" });
    }

    if (!riderIds || riderIds.length === 0) {
      return res.status(400).json({ message: "Please select at least one rider" });
    }

    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({ message: "Valid final price is required" });
    }

    const riders = await Rider.find({ 
      _id: { $in: riderIds },
      isApproved: true 
    });

    if (riders.length !== riderIds.length) {
      return res.status(400).json({ message: "Some riders are not available or not approved" });
    }

    if (booking.status === "cancelled" && booking.cancelledBy === "user") {
      return res.status(400).json({ message: "Cannot reassign — cancelled by user" });
    }

    if (["cancelled", "rider-cancelled"].includes(booking.status)) {
      booking.status = "rider-offer-sent";
      booking.history.push({
        event: "Booking reopened by admin",
        role: "admin",
        details: "Reassignment initiated",
      });
    }

    booking.offeredRiders = riderIds;
    booking.finalPrice = finalPrice;
    booking.status = "rider-offer-sent";
    booking.riderId = null;

    booking.history.push({
      event: "Offers sent to multiple riders",
      role: req.user.role,
      details: `Offer sent to ${riderIds.length} rider(s) with final price: ₹${finalPrice}`,
    });

    await booking.save();

    // 📱 Notify riders
    riderIds.forEach(riderId => {
      sendNotification(riderId, "rider", "rider:new_booking_offer", {
        bookingId: booking._id,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        pickupDate: booking.pickupDate,
        finalPrice: booking.finalPrice,
        message: `New ride: ${booking.pickupLocation} to ${booking.dropLocation}`
      });
    });

    // 📱 Notify user
    sendNotification(booking.passengerId._id, "user", "user:offers_sent", {
      bookingId: booking._id,
      message: `Your booking sent to ${riderIds.length} riders`
    });

    res.status(200).json({
      message: `Offer sent to ${riderIds.length} rider(s)`,
      booking: {
        ...booking.toObject(),
        offeredRidersCount: riderIds.length
      },
    });
  } catch (error) {
    console.error("Send offer error:", error);
    res.status(500).json({ message: "Failed to send offers to riders" });
  }
};

// -------------------------------
// 6️⃣ Rider accepts booking offer
// -------------------------------
exports.acceptBookingOffer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId", "name mobile")
      .populate("offeredRiders", "name mobile");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const riderId = req.user.id;

    const wasOffered = booking.offeredRiders.some(
      rider => rider._id.toString() === riderId
    );

    if (!wasOffered) {
      return res.status(403).json({ message: "You were not offered this booking" });
    }

    if (booking.status !== "rider-offer-sent") {
      return res.status(400).json({ message: "Booking no longer available" });
    }

    const overlappingBooking = await Booking.findOne({
      riderId: riderId,
      status: { $in: ["rider-assigned", "in-process"] },
      $or: [
        { 
          pickupDate: { $lte: booking.rideEndDate },
          rideEndDate: { $gte: booking.pickupDate }
        }
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "You are already assigned to another booking" });
    }

    const rider = await Rider.findById(riderId);
    if (!rider || !rider.isApproved) {
      return res.status(400).json({ message: "Rider account not active" });
    }

    booking.riderId = riderId;
    booking.status = "rider-assigned";
    booking.acceptedAt = new Date();

    booking.history.push({
      event: "Booking accepted by rider",
      role: "rider",
      details: `${rider.name} accepted - Price: ₹${booking.finalPrice}`,
    });

    await booking.save();

    // 📱 Notify other riders
    booking.offeredRiders
      .filter(r => r._id.toString() !== riderId)
      .forEach(otherRider => {
        sendNotification(otherRider._id, "rider", "rider:booking_taken", {
          bookingId: booking._id,
          message: "Booking already accepted by another rider"
        });
      });

    // 📱 Notify user
    sendNotification(booking.passengerId._id, "user", "user:rider_assigned", {
      bookingId: booking._id,
      riderName: rider.name,
      riderMobile: rider.mobile,
      message: `${rider.name} has been assigned to your booking`
    });

    res.status(200).json({
      message: "Booking accepted successfully!",
      booking: {
        _id: booking._id,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        pickupDate: booking.pickupDate,
        finalPrice: booking.finalPrice,
        passenger: booking.passengerId,
        status: booking.status
      },
    });
  } catch (error) {
    console.error("Accept booking error:", error);
    res.status(500).json({ message: "Failed to accept booking" });
  }
};

// -------------------------------
// 7️⃣ Rider rejects booking offer
// -------------------------------
exports.rejectBookingOffer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId", "name mobile");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const riderId = req.user.id;

    booking.offeredRiders = booking.offeredRiders.filter(
      id => id.toString() !== riderId
    );

    booking.history.push({
      event: "Rider rejected offer",
      role: "rider",
      details: `Rider ${riderId} rejected`,
    });

    await booking.save();

    // If no riders left
    if (booking.offeredRiders.length === 0 && booking.status === "rider-offer-sent") {
      booking.status = "in-review";
      booking.history.push({
        event: "All riders rejected",
        role: "system",
        details: "Back to review",
      });
      await booking.save();

      // 📱 Notify user
      sendNotification(booking.passengerId._id, "user", "user:no_riders_available", {
        bookingId: booking._id,
        message: "All riders declined. We're finding new drivers."
      });
    }

    res.status(200).json({ message: "Booking offer rejected" });
  } catch (error) {
    console.error("Reject booking error:", error);
    res.status(500).json({ message: "Failed to reject booking" });
  }
};

// -------------------------------
// 8️⃣ Update booking status
// -------------------------------
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId", "name mobile")
      .populate("riderId", "name mobile");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const validStatuses = ["in-review", "rider-assigned", "in-process", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (req.user.role === "rider") {
      if (booking.riderId?._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      if (!["in-process", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status for rider" });
      }
    }

    const oldStatus = booking.status;
    booking.status = status;
    
    booking.history.push({ 
      event: "Status updated", 
      role: req.user.role, 
      details: `${oldStatus} → ${status}` 
    });

    await booking.save();

    // 📱 Notifications
    if (status === "in-process") {
      sendNotification(booking.passengerId._id, "user", "user:ride_started", {
        bookingId: booking._id,
        riderName: booking.riderId.name,
        riderMobile: booking.riderId.mobile,
        message: "Your ride has started"
      });
    }

    if (status === "completed") {
      sendNotification(booking.passengerId._id, "user", "user:ride_completed", {
        bookingId: booking._id,
        message: "Ride completed. Thank you!"
      });

      sendNotification(booking.riderId._id, "rider", "rider:ride_completed", {
        bookingId: booking._id,
        finalPrice: booking.finalPrice,
        message: `Ride completed - You earned ₹${booking.finalPrice}`
      });
    }
    
    res.status(200).json({ message: "Status updated", booking });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// -------------------------------
// 9️⃣ Cancel booking
// -------------------------------
exports.cancelBooking = async (req, res) => {
  try {
    const { reason = "No reason provided" } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId", "_id name mobile")
      .populate("riderId", "_id name mobile");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (["cancelled", "completed"].includes(booking.status)) {
      return res.status(400).json({ message: `Already ${booking.status}` });
    }

    const role = req.user.role;

    if (role === "user") {
      if (booking.passengerId._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      if (["rider-assigned", "in-process"].includes(booking.status)) {
        return res.status(403).json({ message: "Cannot cancel after assignment" });
      }
    }

    if (role === "rider") {
      if (booking.riderId?._id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not your booking" });
      }
      if (booking.status === "completed") {
        return res.status(400).json({ message: "Cannot cancel completed ride" });
      }
    }

    booking.status = "cancelled";
    booking.cancelledBy = role;
    booking.cancelReason = reason;
    booking.cancelledAt = new Date();

    if (role === "rider") {
      booking.riderId = null;
      booking.finalPrice = null;
      booking.status = "in-review";
      
      booking.history.push({ 
        event: "Reopened for reassignment", 
        role: "system", 
        details: `Rider cancelled: ${reason}` 
      });
    }

    booking.history.push({ event: "Cancelled", role, details: reason });
    await booking.save();

    // 📱 Notifications
    if (role === "user" && booking.riderId) {
      sendNotification(booking.riderId._id, "rider", "rider:booking_cancelled", {
        bookingId: booking._id,
        message: "Passenger cancelled the booking"
      });
    }

    if (role === "rider" && booking.passengerId) {
      sendNotification(booking.passengerId._id, "user", "user:booking_cancelled", {
        bookingId: booking._id,
        message: "Rider cancelled. Finding another driver for you."
      });
    }

    res.status(200).json({ 
      message: role === "rider" ? "Cancelled and reopened" : "Cancelled", 
      booking 
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------------
// 🔟 Get booking history
// -------------------------------
exports.getUserBookingHistory = async (req, res) => {
  try {
    const passengerId = req.user?.id;
    if (!passengerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({
      passengerId,
      status: "completed",
    })
      .populate("riderId", "name mobile averageRating")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get user history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getRiderBookingHistory = async (req, res) => {
  try {
    const riderId = req.user?.id;
    if (!riderId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({
      riderId,
      status: "completed",
    })
      .populate("passengerId", "name mobile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get rider history error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};