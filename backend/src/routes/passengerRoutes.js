const express = require("express");
const router = express.Router();
const {
  signupSendOtp,
  verifyOtpAndRegister,
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  getLeaderboard,
  getAllBuyers,
  deletePassenger,
} = require("../controllers/passengerController");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// OTP Signup Routes (public)
router.post("/signup/send-otp", signupSendOtp);
router.post("/signup/verify-otp", verifyOtpAndRegister);

// Passenger CRUD Routes (protected - admin only)
router.get("/leaderboard", roleAuthorization(["admin"]), getLeaderboard);
router.get("/buyers", roleAuthorization(["admin"]), getAllBuyers);
router.get("/", roleAuthorization(["admin"]), getAllPassengers);
router.get("/:id", roleAuthorization(["admin"]), getPassengerById);
router.put("/:id", roleAuthorization(["admin"]), updatePassenger);
router.delete("/:id", roleAuthorization(["admin"]), deletePassenger);

module.exports = router;
