const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken, allowRoles } = require("../middlewares/authMiddleware");

// User creates a new booking
router.post("/create", verifyToken, allowRoles("user"), bookingController.createBooking);

// Admin: Get all bookings
router.get("/", verifyToken, allowRoles("superadmin", "vendor"), bookingController.getAllBookings);

// Get booking by ID (any authenticated role can view their own)
router.get("/:id", verifyToken, bookingController.getBookingById);

// Admin: Assign rider manually
router.put("/:id/assign", verifyToken, allowRoles("superadmin", "vendor"), bookingController.assignRider);

// Update booking status
router.put("/:id/status", verifyToken, allowRoles("rider", "superadmin", "vendor"), bookingController.updateBookingStatus);

// Cancel booking (Admin, Rider, User)
router.put("/:id/cancel", verifyToken, allowRoles("user", "rider", "superadmin", "vendor"), bookingController.cancelBooking);

module.exports = router;
