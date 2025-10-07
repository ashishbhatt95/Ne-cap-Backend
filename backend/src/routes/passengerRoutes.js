const express = require("express");
const router = express.Router();
const {
  signupSendOtp,
  verifyOtpAndRegister,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  deletePassenger,
} = require("../controllers/passengerController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// OTP Signup Routes (public)
router.post("/signup/send-otp", signupSendOtp);
router.post("/signup/verify-otp", verifyOtpAndRegister);

// Passenger CRUD Routes (protected - admin only)
router.get("/", verifyToken, allowRoles("superadmin"), getAllPassengers);
router.get("/:id", verifyToken, allowRoles("superadmin"), getPassengerById);
router.put("/:id", verifyToken, allowRoles("superadmin"), updatePassenger);
router.delete("/:id", verifyToken, allowRoles("superadmin"), deletePassenger);

module.exports = router;
