const express = require("express");
const router = express.Router();
const {
  getAllPassengers,
  getPassengerById,
  updatePassenger,
  getLeaderboard,
  getAllBuyers,
  deletePassenger,
} = require("../controllers/passengerController");
const { roleAuthorization } = require("../middlewares/authMiddleware");

const passengerAuth = require("../controllers/passengerAuthController");


router.post("/send-otp", passengerAuth.sendPassengerOtp);
router.post("/verify-otp", passengerAuth.verifyPassengerOtp);

// Passenger CRUD Routes (protected - admin only)
router.get("/leaderboard", roleAuthorization(["admin"]), getLeaderboard);
router.get("/buyers", roleAuthorization(["admin"]), getAllBuyers);
router.get("/", roleAuthorization(["admin"]), getAllPassengers);
router.get("/:id", roleAuthorization(["admin"]), getPassengerById);
router.put("/:id", roleAuthorization(["admin"]), updatePassenger);
router.delete("/:id", roleAuthorization(["admin"]), deletePassenger);

module.exports = router;
