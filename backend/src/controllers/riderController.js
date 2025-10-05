const Rider = require("../models/Rider");
const Otp = require("../models/Otp");
const { uploadImages } = require("../services/cloudinary");

// Step 1: Register Rider + Send OTP
exports.registerRider = async (req, res) => {
  try {
    console.log("Incoming registration request body:", req.body);
    console.log("Incoming files:", req.files);

    const { name, dob, fatherName, motherName, email, mobile, aadharNumber, panNumber, address } = req.body;

    if (!name || !dob || !fatherName || !motherName || !email || !mobile || !aadharNumber || !address) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    const mobileStr = mobile.toString().trim();
    console.log("Mobile after trim:", mobileStr);

    // Check existing rider
    let existing = await Rider.findOne({ mobile: mobileStr });
    console.log("Existing rider found:", existing);

    if (existing && existing.otpVerified) {
      console.log("Rider already verified with this mobile");
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
      });
      console.log("New rider created:", existing._id);
    } else {
      existing.name = name; existing.dob = dob; existing.fatherName = fatherName; existing.motherName = motherName;
      existing.email = email; existing.aadharNumber = aadharNumber; existing.panNumber = panNumber;
      existing.address = address; existing.aadharFront = aadharFrontUrl; existing.aadharBack = aadharBackUrl;
      existing.selfie = selfieUrl;
      await existing.save();
      console.log("Existing rider updated (pre-OTP):", existing._id);
    }

    // Delete any old OTPs and create new
    await Otp.deleteMany({ mobile: mobileStr });
    console.log("Deleted old OTPs for mobile:", mobileStr);

    const otp = "123456"; // static OTP for testing
    const otpRecord = await Otp.create({ mobile: mobileStr, otp });
    console.log("Created new OTP:", otpRecord);

    return res.json({ success: true, message: "OTP sent successfully (use 123456 for testing)", riderId: existing._id });
  } catch (err) {
    console.error("registerRider error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Step 2: Verify OTP
exports.verifyRiderOtp = async (req, res) => {
  try {
    console.log("Incoming verify OTP request body:", req.body);
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      console.log("Missing mobile or OTP in request");
      return res.status(400).json({ success: false, message: "Mobile and OTP are required" });
    }

    const mobileStr = mobile.toString().trim();
    console.log("Verifying mobile:", mobileStr);

    const otpRecord = await Otp.findOne({ mobile: mobileStr }).sort({ createdAt: -1 });
    console.log("Found OTP record:", otpRecord);

    if (!otpRecord) {
      console.log("OTP record not found or expired");
      return res.status(400).json({ success: false, message: "OTP not found or not sent" });
    }

    if (otpRecord.otp !== otp) {
      console.log("OTP mismatch. Provided:", otp, "Expected:", otpRecord.otp);
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const rider = await Rider.findOne({ mobile: mobileStr });
    if (!rider) {
      console.log("Rider not found for mobile:", mobileStr);
      return res.status(404).json({ success: false, message: "Rider not found" });
    }

    rider.otpVerified = true;
    await rider.save();
    console.log("Rider OTP verified:", rider._id);

    await Otp.deleteMany({ mobile: mobileStr });
    console.log("Deleted OTP after verification for mobile:", mobileStr);

    return res.json({ success: true, message: "Rider registered successfully", rider });
  } catch (err) {
    console.error("verifyRiderOtp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    console.log("Incoming resend OTP request:", req.body);
    const { mobile } = req.body;

    if (!mobile) return res.status(400).json({ success: false, message: "Mobile is required" });

    const mobileStr = mobile.toString().trim();
    const rider = await Rider.findOne({ mobile: mobileStr });

    if (!rider) return res.status(404).json({ success: false, message: "Rider not found" });
    if (rider.otpVerified) return res.status(400).json({ success: false, message: "Rider already verified" });

    await Otp.deleteMany({ mobile: mobileStr });
    console.log("Deleted old OTPs for resend");

    const otp = "123456"; // static OTP
    const otpRecord = await Otp.create({ mobile: mobileStr, otp });
    console.log("Created new OTP for resend:", otpRecord);

    return res.json({ success: true, message: "OTP resent successfully (use 123456)" });
  } catch (err) {
    console.error("resendOtp error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
