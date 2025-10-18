const Booking = require("../models/Booking");
const VehicleCategory = require("../models/VehicleCategory");
const Passenger = require("../models/passengerSchema");
const Rider = require("../models/Rider");

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

    // Role-based access control
    if (req.user.role === "user" && booking.passengerId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.user.role === "rider" && booking.riderId?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: Not assigned" });
    }

    // Hide final price for users in review status
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

    // ONLY basic filter - get ALL approved riders with vehicles
    // NO pre-filtering by date, vehicle type, etc.
    const filter = {
      isApproved: true,
      vehicleCount: { $gt: 0 },
    };

    // Get ALL available riders (admin will filter manually)
    const candidateRiders = await Rider.find(filter)
      .select("name mobile email riderId registrationDate averageRating reviewCount vehicleCount selfie vehicle isAvailable")
      .sort({ averageRating: -1, reviewCount: -1 });

    // Optional: Check which riders are currently busy (for UI indication only)
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

    // Mark riders as busy in response (but still show them)
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
    const { riderIds = [], finalPrice } = req.body; // Multiple riders selection
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role !== "admin" && req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only admin/vendor can send offers to riders" });
    }

    // Validation
    if (!riderIds || riderIds.length === 0) {
      return res.status(400).json({ message: "Please select at least one rider" });
    }

    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({ message: "Valid final price is required" });
    }

    // Verify all riders exist and are approved
    const riders = await Rider.find({ 
      _id: { $in: riderIds },
      isApproved: true 
    });

    if (riders.length !== riderIds.length) {
      return res.status(400).json({ message: "Some riders are not available or not approved" });
    }

    // Reassignment rules
    if (booking.status === "cancelled" && booking.cancelledBy === "user") {
      return res.status(400).json({ message: "Cannot reassign — cancelled by user" });
    }

    // If booking was cancelled by rider/admin, reopen it
    if (["cancelled", "rider-cancelled"].includes(booking.status)) {
      booking.status = "rider-offer-sent";
      booking.history.push({
        event: "Booking reopened by admin",
        role: "admin",
        details: "Reassignment initiated",
      });
    }

    // Save offered riders (all selected riders)
    booking.offeredRiders = riderIds;
    booking.finalPrice = finalPrice;
    booking.status = "rider-offer-sent"; // New status for pending offers
    booking.riderId = null; // Clear previous rider if any

    booking.history.push({
      event: "Offers sent to multiple riders",
      role: req.user.role,
      details: `Offer sent to ${riderIds.length} rider(s) with final price: ₹${finalPrice}. First to accept gets the booking.`,
    });

    await booking.save();

    // TODO: Send notifications to all selected riders
    // notificationSystem.notifyMultiple(riderIds, {
    //   type: "new_booking_offer",
    //   bookingId: booking._id,
    //   price: finalPrice,
    //   message: "New booking offer available. Accept now!"
    // });

    res.status(200).json({
      message: `Offer sent to ${riderIds.length} rider(s). First to accept will get the booking.`,
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
// 6️⃣ Update booking status (Rider / Admin / Vendor)
// -------------------------------
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Validate status transitions
    const validStatuses = ["in-review", "rider-assigned", "in-process", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Role-based status update restrictions
    if (req.user.role === "rider") {
      if (booking.riderId?.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this booking" });
      }
      // Riders can only update to in-process or completed
      if (!["in-process", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status for rider" });
      }
    }

    const oldStatus = booking.status;
    booking.status = status;
    
    booking.history.push({ 
      event: "Status updated", 
      role: req.user.role, 
      details: `Status changed from ${oldStatus} to ${status}` 
    });

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
    const { reason = "No reason provided" } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (["cancelled", "completed"].includes(booking.status)) {
      return res.status(400).json({ message: `Booking already ${booking.status}` });
    }

    const role = req.user.role;

    // User cancellation rules
    if (role === "user") {
      if (booking.passengerId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }
      if (["rider-assigned", "in-process", "completed"].includes(booking.status)) {
        return res.status(403).json({ 
          message: "Cannot cancel after rider assignment or ride start. Please contact support." 
        });
      }
    }

    // Rider cancellation rules
    if (role === "rider") {
      if (booking.riderId?.toString() !== req.user.id) {
        return res.status(403).json({ message: "Rider can only cancel their own assigned booking" });
      }
      if (booking.status === "completed") {
        return res.status(400).json({ message: "Cannot cancel completed ride" });
      }
    }

    // Update booking
    booking.status = "cancelled";
    booking.cancelledBy = role;
    booking.cancelReason = reason;
    booking.cancelledAt = new Date();

    // If rider cancelled, make it available for reassignment
    if (role === "rider") {
      booking.riderId = null;
      booking.finalPrice = null;
      booking.status = "in-review"; // Back to review for admin to reassign
      
      booking.history.push({ 
        event: "Booking reopened for reassignment", 
        role: "system", 
        details: `Previous rider cancelled: ${reason}` 
      });
    }

    booking.history.push({ 
      event: "Booking cancelled", 
      role, 
      details: reason 
    });

    await booking.save();

    res.status(200).json({ 
      message: `Booking ${role === "rider" ? "cancelled and reopened for reassignment" : "cancelled"}`, 
      booking 
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------------
// 9️⃣ Rider accepts booking offer (First come, first served)
// -------------------------------
exports.acceptBookingOffer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("passengerId", "name mobile")
      .populate("offeredRiders", "name mobile");
    
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const riderId = req.user.id;

    // Check if this rider was offered the booking
    const wasOffered = booking.offeredRiders.some(
      rider => rider._id.toString() === riderId
    );

    if (!wasOffered) {
      return res.status(403).json({ 
        message: "You were not offered this booking" 
      });
    }

    // Check if booking is still available
    if (booking.status !== "rider-offer-sent") {
      return res.status(400).json({ 
        message: "This booking is no longer available. Another rider may have already accepted it." 
      });
    }

    // Check if rider is already busy during this time
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
      return res.status(400).json({ 
        message: "You are already assigned to another booking during this time" 
      });
    }

    // Get rider info
    const rider = await Rider.findById(riderId);
    if (!rider || !rider.isApproved) {
      return res.status(400).json({ message: "Rider account is not active" });
    }

    // ASSIGN BOOKING TO THIS RIDER (First come, first served!)
    booking.riderId = riderId;
    booking.status = "rider-assigned";
    booking.acceptedAt = new Date();

    booking.history.push({
      event: "Booking accepted by rider",
      role: "rider",
      details: `${rider.name} accepted the booking offer. Price: ₹${booking.finalPrice}`,
    });

    await booking.save();

    // TODO: Notify other riders that booking is taken
    // TODO: Notify user that rider is assigned
    // TODO: Notify admin about successful assignment

    res.status(200).json({
      message: "Booking accepted successfully! You have been assigned this ride.",
      booking: {
        _id: booking._id,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        pickupDate: booking.pickupDate,
        rideEndDate: booking.rideEndDate,
        finalPrice: booking.finalPrice,
        passenger: booking.passengerId,
        status: booking.status
      },
    });
  } catch (error) {
    console.error("Accept booking offer error:", error);
    res.status(500).json({ message: "Failed to accept booking" });
  }
};

// -------------------------------
// 🔟 Rider rejects booking offer
// -------------------------------
exports.rejectBookingOffer = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const riderId = req.user.id;

    // Remove rider from offered list
    booking.offeredRiders = booking.offeredRiders.filter(
      id => id.toString() !== riderId
    );

    booking.history.push({
      event: "Rider rejected offer",
      role: "rider",
      details: `Rider ${riderId} rejected the booking offer`,
    });

    await booking.save();

    // If no riders left, notify admin
    if (booking.offeredRiders.length === 0 && booking.status === "rider-offer-sent") {
      booking.status = "in-review";
      booking.history.push({
        event: "All riders rejected",
        role: "system",
        details: "All offered riders rejected. Booking back to review.",
      });
      await booking.save();
    }

    res.status(200).json({
      message: "Booking offer rejected",
    });
  } catch (error) {
    console.error("Reject booking offer error:", error);
    res.status(500).json({ message: "Failed to reject booking" });
  }
};

// ✅ Passenger: Get Completed Booking History
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
    console.error("Error fetching user history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Rider: Get Completed Booking History
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
    console.error("Error fetching rider history:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};