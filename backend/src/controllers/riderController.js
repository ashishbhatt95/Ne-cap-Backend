const jwt = require("jsonwebtoken");
const Rider = require("../models/Rider");
const { uploadImages } = require("../services/cloudinary");

// -----------------------------
// Helper: Generate unique 7-char Rider ID
// -----------------------------
async function generateUniqueRiderId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
  const randomDigit = () => Math.floor(Math.random() * 10);

  let riderId, existing;
  do {
    riderId =
      Array.from({ length: 3 }, randomLetter).join("") +
      Array.from({ length: 4 }, randomDigit).join("");
    existing = await Rider.findOne({ riderId });
  } while (existing);
  return riderId;
}

// -----------------------------
// Helper: Generate JWT
// -----------------------------
const generateRiderToken = (id) =>
  jwt.sign({ id, role: "rider" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// -----------------------------
// REGISTER RIDER
// -----------------------------
exports.registerRider = async (req, res) => {
  try {
    const {
      name, dob, fatherName, motherName,
      email, mobile, aadharNumber, panNumber, address
    } = req.body;

    if (!name || !dob || !fatherName || !motherName || !email || !mobile || !aadharNumber || !address) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const mobileStr = mobile.toString().trim();

    // Check if already registered
    const existing = await Rider.findOne({ mobile: mobileStr });
    if (existing) return res.status(400).json({ success: false, message: "Mobile number already registered" });

    // Upload images
    const aadharFrontUrl = req.files?.aadharFront ? (await uploadImages(req.files.aadharFront, "riders/aadharFront"))[0].url : "";
    const aadharBackUrl = req.files?.aadharBack ? (await uploadImages(req.files.aadharBack, "riders/aadharBack"))[0].url : "";
    const selfieUrl = req.files?.selfie ? (await uploadImages(req.files.selfie, "riders/selfie"))[0].url : "";

    // Generate Rider ID
    const riderId = await generateUniqueRiderId();

    // Create Rider
    const rider = new Rider({
      riderId, name, dob, fatherName, motherName,
      email, mobile: mobileStr, aadharNumber, panNumber,
      address, aadharFront: aadharFrontUrl, aadharBack: aadharBackUrl, selfie: selfieUrl,
      otpVerified: true,
      isSubmitted: true,
      isApproved: false,
      role: "rider",
      registrationDate: new Date()
    });

    await rider.save();

    // JWT token
    const token = generateRiderToken(rider._id);

    return res.status(201).json({
      success: true,
      message: "Rider registered successfully",
      token,
      rider: {
        id: rider._id,
        riderId: rider.riderId,
        name: rider.name,
        email: rider.email,
        mobile: rider.mobile,
        role: rider.role,
        isApproved: rider.isApproved
      }
    });

  } catch (err) {
    console.error("registerRider error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// GET ALL RIDERS
// -----------------------------
exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: riders.length, riders });
  } catch (err) {
    console.error("getAllRiders error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// GET RIDER BY ID
// -----------------------------
exports.getRiderById = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, rider });
  } catch (err) {
    console.error("getRiderById error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// UPDATE RIDER (by ID)
// -----------------------------
exports.updateRider = async (req, res) => {
  try {
    const rider = await Rider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, message: "Rider updated successfully", rider });
  } catch (err) {
    console.error("updateRider error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// DELETE RIDER
// -----------------------------
exports.deleteRider = async (req, res) => {
  try {
    const rider = await Rider.findByIdAndDelete(req.params.id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, message: "Rider deleted successfully" });
  } catch (err) {
    console.error("deleteRider error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// ADMIN: APPROVE / REJECT RIDER
// -----------------------------
exports.updateRiderStatus = async (req, res) => {
  try {
    const { action } = req.body;
    const rider = await Rider.findById(req.params.id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });

    if (action === "approve") {
      rider.isApproved = true;
      await rider.save();
      return res.json({ success: true, message: "Rider approved successfully", rider });
    }
    if (action === "reject") {
      await Rider.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: "Rider rejected and removed" });
    }

    return res.status(400).json({ success: false, message: "Invalid action. Use 'approve' or 'reject'." });

  } catch (err) {
    console.error("updateRiderStatus error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// ADD REVIEW
// -----------------------------
exports.addReview = async (req, res) => {
  try {
    const { riderId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: "Rating must be between 1–5" });

    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });

    rider.reviews.push(rating);
    rider.reviewCount = rider.reviews.length;
    rider.averageRating = rider.reviews.reduce((sum, r) => sum + r, 0) / rider.reviewCount;

    await rider.save();

    return res.json({
      success: true,
      message: "Review added successfully",
      reviewCount: rider.reviewCount,
      averageRating: rider.averageRating
    });
  } catch (err) {
    console.error("addReview error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// GET APPROVED & PENDING RIDERS
// -----------------------------
exports.getApprovedRiders = async (req, res) => {
  try {
    const riders = await Rider.find({ isApproved: true }).sort({ createdAt: -1 });
    return res.json({ success: true, count: riders.length, riders });
  } catch (err) {
    console.error("getApprovedRiders error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPendingRiders = async (req, res) => {
  try {
    const riders = await Rider.find({ isApproved: false, isSubmitted: true }).sort({ createdAt: -1 });
    return res.json({ success: true, count: riders.length, riders });
  } catch (err) {
    console.error("getPendingRiders error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// GET / UPDATE RIDER PROFILE (TOKEN)
// -----------------------------
exports.getRiderProfile = async (req, res) => {
  try {
    const rider = await Rider.findById(req.user.id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, data: rider });
  } catch (err) {
    console.error("getRiderProfile error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRiderProfile = async (req, res) => {
  try {
    const rider = await Rider.findByIdAndUpdate(req.user.id, req.body, { new: true });
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, data: rider });
  } catch (err) {
    console.error("updateRiderProfile error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
