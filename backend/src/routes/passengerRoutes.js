const express = require("express");
const router = express.Router();
const {
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  getLeaderboard,
  registerPassenger,
  getAllBuyers,
  deletePassenger,
  getPassengerProfile,
  updatePassengerProfile,
} = require("../controllers/passengerController");
const { roleAuthorization } = require("../middlewares/authMiddleware");
const passengerAuth = require("../controllers/passengerAuthController");

// -----------------------------
// Auth Routes
// -----------------------------
router.post("/send-otp", passengerAuth.sendPassengerOtp);
router.post("/verify-otp", passengerAuth.verifyPassengerOtp);
router.post("/register", registerPassenger);

// -----------------------------
// User Routes (for passengers themselves)
// -----------------------------
router.get("/me", roleAuthorization(["user"]), getPassengerProfile);
router.put("/me", roleAuthorization(["user"]), updatePassengerProfile);

// -----------------------------
// Admin Routes (for admin panel)
// -----------------------------
router.get("/leaderboard", roleAuthorization(["admin"]), getLeaderboard);
router.get("/buyers", roleAuthorization(["admin"]), getAllBuyers);
router.get("/", roleAuthorization(["admin"]), getAllPassengers);
router.get("/:id", roleAuthorization(["admin"]), getPassengerById);
router.delete("/:id", roleAuthorization(["admin"]), deletePassenger);

module.exports = router;
