const Passenger = require("../models/passengerSchema");
const Otp = require("../models/Otp");

// -----------------------------
// STEP 1️⃣ — Send OTP (static 123456)
// -----------------------------
exports.signupSendOtp = async (req, res) => {
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

    // Generate static OTP
    const otpCode = "123456";

    // Save or update OTP in DB
    await Otp.findOneAndUpdate(
      { mobile },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // For demo purpose (no actual SMS)
    console.log(`📱 OTP for ${mobile}: ${otpCode}`);

    return res.json({
      success: true,
      message: "OTP sent successfully (static 123456)",
    });
  } catch (error) {
    console.error("signupSendOtp error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// -----------------------------
// STEP 2️⃣ — Verify OTP & Register Passenger
// -----------------------------
exports.verifyOtpAndRegister = async (req, res) => {
  try {
    const { name, email, dateOfBirth, mobile, otp } = req.body;

    if (!name || !email || !dateOfBirth || !mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields and OTP are required",
      });
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({ mobile }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    // Validate OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Recheck mobile not already used
    const existing = await Passenger.findOne({ mobile });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already registered",
      });
    }

    // Create new passenger
    const passenger = new Passenger({
      name,
      email,
      dateOfBirth,
      mobile,
      role: "user",
    });

    await passenger.save();
    await Otp.deleteMany({ mobile }); // clean OTP

    return res.json({
      success: true,
      message: "Passenger registered successfully",
    });
  } catch (error) {
    console.error("verifyOtpAndRegister error:", error.message);
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
// UPDATE PASSENGER
// -----------------------------
exports.updatePassenger = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedPassenger = await Passenger.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedPassenger) {
      return res.status(404).json({ success: false, message: "Passenger not found" });
    }

    return res.json({ success: true, data: updatedPassenger });
  } catch (error) {
    console.error("updatePassenger error:", error.message);
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
