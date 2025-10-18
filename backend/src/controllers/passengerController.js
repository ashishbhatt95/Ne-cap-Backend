const Passenger = require("../models/passengerSchema");
const jwt = require("jsonwebtoken");

// Helper: Generate unique 7-char ID (3 letters + 4 digits)
async function generateUniquePassengerId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
  const randomDigit = () => Math.floor(Math.random() * 10);

  let passengerId, existing;
  do {
    passengerId =
      Array.from({ length: 3 }, randomLetter).join("") +
      Array.from({ length: 4 }, randomDigit).join("");
    existing = await Passenger.findOne({ passengerId });
  } while (existing);

  return passengerId;
}

// -----------------------------
// REGISTER PASSENGER (no OTP)
// -----------------------------
exports.registerPassenger = async (req, res) => {
  try {
    const { name, email, dateOfBirth, mobile } = req.body;

    if (!name || !email || !dateOfBirth || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if already registered
    const existing = await Passenger.findOne({ mobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    // Generate unique passenger ID
    const passengerId = await generateUniquePassengerId();

    // Create new passenger
    const passenger = new Passenger({
      passengerId,
      name,
      email,
      dateOfBirth,
      mobile,
      role: "user",
      registrationDate: new Date(),
      status: "normal",
    });

    await passenger.save();

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: passenger._id,
        role: passenger.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // 7-day expiry
    );

    return res.status(201).json({
      success: true,
      message: "Passenger registered successfully",
      token,
      data: {
        id: passenger._id,
        passengerId: passenger.passengerId,
        name: passenger.name,
        email: passenger.email,
        mobile: passenger.mobile,
        role: passenger.role,
      },
    });
  } catch (error) {
    console.error("registerPassenger error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// -----------------------------
// GET ALL PASSENGERS
// -----------------------------
exports.getAllPassengers = async (req, res) => {
  try {
    const passengers = await Passenger.find();
    return res.json({
      success: true,
      count: passengers.length,
      data: passengers,
    });
  } catch (error) {
    console.error("getAllPassengers error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// GET SINGLE PASSENGER BY ID
// -----------------------------
exports.getPassengerById = async (req, res) => {
  try {
    const { id } = req.params;
    const passenger = await Passenger.findById(id);
    if (!passenger) {
      return res.status(404).json({ success: false, message: "Passenger not found" });
    }
    return res.json({ success: true, data: passenger });
  } catch (error) {
    console.error("getPassengerById error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// GET PASSENGER BY TOKEN
// -----------------------------
exports.getPassengerProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1].trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // only allow role = user (passenger)
    if (decoded.role.toLowerCase() !== "user") {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
    }

    const passenger = await Passenger.findById(decoded.id);
    if (!passenger) {
      return res.status(404).json({ success: false, message: "Passenger not found" });
    }

    return res.json({ success: true, data: passenger });
  } catch (error) {
    console.error("getPassengerProfile error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// UPDATE PASSENGER BY TOKEN
// -----------------------------
exports.updatePassengerProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1].trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role.toLowerCase() !== "user") {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
    }

    const updateData = req.body;
    const updatedPassenger = await Passenger.findByIdAndUpdate(decoded.id, updateData, {
      new: true,
    });

    if (!updatedPassenger) {
      return res.status(404).json({ success: false, message: "Passenger not found" });
    }

    return res.json({ success: true, data: updatedPassenger });
  } catch (error) {
    console.error("updatePassengerProfile error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// DELETE PASSENGER
// -----------------------------
exports.deletePassenger = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Passenger.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Passenger not found" });
    }
    return res.json({ success: true, message: "Passenger deleted successfully" });
  } catch (error) {
    console.error("deletePassenger error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// GET LEADERBOARD (Buyers Only)
// -----------------------------
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Passenger.find({ status: "buyer" })
      .sort({ bookingCount: -1 })
      .select("passengerId name mobile status registrationDate bookingCount role");

    return res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    console.error("getLeaderboard error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// -----------------------------
// GET ALL BUYERS
// -----------------------------
exports.getAllBuyers = async (req, res) => {
  try {
    const buyers = await Passenger.find({ status: "buyer" })
      .sort({ createdAt: -1 })
      .select("passengerId name email status mobile bookingCount registrationDate");

    return res.json({
      success: true,
      count: buyers.length,
      data: buyers,
    });
  } catch (error) {
    console.error("getAllBuyers error:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
