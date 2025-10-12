const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// User creates a new booking
router.post("/create", roleAuthorization(["user"]), bookingController.createBooking);

// Admin: Get all bookings
router.get("/", roleAuthorization(["superadmin", "vendor"]), bookingController.getAllBookings);

// Get booking by ID (any authenticated role can view)
router.get("/:id", roleAuthorization(["user", "rider", "superadmin", "vendor"]), bookingController.getBookingById);

// Admin: Assign rider manually
router.put("/:id/assign", roleAuthorization(["superadmin", "vendor"]), bookingController.assignRider);

// Update booking status
router.put("/:id/status", roleAuthorization(["rider", "superadmin", "vendor"]), bookingController.updateBookingStatus);

// Cancel booking
router.put("/:id/cancel", roleAuthorization(["user", "rider", "superadmin", "vendor"]), bookingController.cancelBooking);

module.exports = router;
