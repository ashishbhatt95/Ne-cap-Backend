const Rider = require("../models/Rider");
const Otp = require("../models/Otp");
const { uploadImages } = require("../services/cloudinary");

// -----------------------------
// Step 1: Register Rider + Send OTP
// -----------------------------
exports.registerRider = async (req, res) => {
  try {
    console.log("Incoming registration request body:", req.body);
    console.log("Incoming files:", req.files);

    const { name, dob, fatherName, motherName, email, mobile, aadharNumber, panNumber, address } = req.body;

    if (!name || !dob || !fatherName || !motherName || !email || !mobile || !aadharNumber || !address) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const mobileStr = mobile.toString().trim();

    // Check existing rider
    let existing = await Rider.findOne({ mobile: mobileStr });

    if (existing && existing.otpVerified) {
      return res.status(400).json({ success: false, message: "This mobile number is already registered" });
    }

    // Upload Images
    const aadharFrontUrl = req.files?.aadharFront ? (await uploadImages(req.files.aadharFront, "riders/aadharFront"))[0].url : "";
    const aadharBackUrl = req.files?.aadharBack ? (await uploadImages(req.files.aadharBack, "riders/aadharBack"))[0].url : "";
    const selfieUrl = req.files?.selfie ? (await uploadImages(req.files.selfie, "riders/selfie"))[0].url : "";

    if (!existing) {
      existing = await Rider.create({
        name, dob, fatherName, motherName, email, mobile: mobileStr,
        aadharNumber, panNumber, address,
        aadharFront: aadharFrontUrl,
        aadharBack: aadharBackUrl,
        selfie: selfieUrl,
        otpVerified: false,
        isSubmitted: true, // rider submitted registration
      });
    } else {
      existing.name = name; existing.dob = dob; existing.fatherName = fatherName; existing.motherName = motherName;
      existing.email = email; existing.aadharNumber = aadharNumber; existing.panNumber = panNumber;
      existing.address = address; existing.aadharFront = aadharFrontUrl; existing.aadharBack = aadharBackUrl;
      existing.selfie = selfieUrl;
      existing.isSubmitted = true;
      await existing.save();
    }

    await Otp.deleteMany({ mobile: mobileStr });
    const otp = "123456"; // static OTP for testing
    await Otp.create({ mobile: mobileStr, otp });

    return res.json({ success: true, message: "OTP sent successfully (use 123456 for testing)"});
  } catch (err) {
    console.error("registerRider error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Step 2: Verify OTP
// -----------------------------
exports.verifyRiderOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ success: false, message: "Mobile and OTP are required" });

    const mobileStr = mobile.toString().trim();
    const otpRecord = await Otp.findOne({ mobile: mobileStr }).sort({ createdAt: -1 });
    if (!otpRecord) return res.status(400).json({ success: false, message: "OTP not found or not sent" });

    if (otpRecord.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

    const rider = await Rider.findOne({ mobile: mobileStr });
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });

    rider.otpVerified = true;
    await rider.save();
    await Otp.deleteMany({ mobile: mobileStr });

    return res.json({ success: true, message: "Rider registered successfully", rider });
  } catch (err) {
    console.error("verifyRiderOtp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Resend OTP
// -----------------------------
exports.resendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ success: false, message: "Mobile is required" });

    const mobileStr = mobile.toString().trim();
    const rider = await Rider.findOne({ mobile: mobileStr });
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    if (rider.otpVerified) return res.status(400).json({ success: false, message: "Rider already verified" });

    await Otp.deleteMany({ mobile: mobileStr });
    const otp = "123456";
    await Otp.create({ mobile: mobileStr, otp });

    return res.json({ success: true, message: "OTP resent successfully (use 123456)" });
  } catch (err) {
    console.error("resendOtp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// CRUD Operations
// -----------------------------
exports.getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find();
    return res.json({ success: true, riders });
  } catch (err) {
    console.error("getAllRiders error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRiderById = async (req, res) => {
  try {
    const { id } = req.params;
    const rider = await Rider.findById(id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, rider });
  } catch (err) {
    console.error("getRiderById error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRider = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const rider = await Rider.findByIdAndUpdate(id, updates, { new: true });
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, message: "Rider updated", rider });
  } catch (err) {
    console.error("updateRider error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteRider = async (req, res) => {
  try {
    const { id } = req.params;
    const rider = await Rider.findByIdAndDelete(id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    return res.json({ success: true, message: "Rider deleted" });
  } catch (err) {
    console.error("deleteRider error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Admin: Approve / Reject Rider
// -----------------------------
exports.approveRider = async (req, res) => {
  try {
    const { id } = req.params;
    const rider = await Rider.findById(id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });

    rider.isApproved = true;
    await rider.save();

    return res.json({ success: true, message: "Rider approved", rider });
  } catch (err) {
    console.error("approveRider error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectRider = async (req, res) => {
  try {
    const { id } = req.params;
    const rider = await Rider.findById(id);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });

    rider.isApproved = false;
    rider.isSubmitted = false;
    await rider.save();

    return res.json({ success: true, message: "Rider rejected", rider });
  } catch (err) {
    console.error("rejectRider error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// -----------------------------
// Add Passenger Review
// -----------------------------
exports.addReview = async (req, res) => {
  try {
    const { riderId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: "Rating must be 1–5" });

    const rider = await Rider.findById(riderId);
    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });

    rider.reviews.push(rating);
    rider.reviewCount = rider.reviews.length;
    rider.averageRating = rider.reviews.reduce((sum, r) => sum + r, 0) / rider.reviewCount;

    await rider.save();

    return res.json({ success: true, message: "Review added", reviewCount: rider.reviewCount, averageRating: rider.averageRating });
  } catch (err) {
    console.error("addReview error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
