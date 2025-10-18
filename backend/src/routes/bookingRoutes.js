const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { roleAuthorization } = require("../middlewares/authMiddleware");

// -------------------------------
// 1️⃣ User creates a new booking
// -------------------------------
router.post(
  "/create",
  roleAuthorization(["user"]),
  bookingController.createBooking
);

// -------------------------------
// 2️⃣ Admin / Vendor: Get all bookings
// -------------------------------
router.get(
  "/",
  roleAuthorization(["admin", "vendor"]),
  bookingController.getAllBookings
);

// -------------------------------
// 3️⃣ Get booking by ID (Role-based)
// -------------------------------
router.get(
  "/:id",
  roleAuthorization(["user", "rider", "admin", "vendor"]),
  bookingController.getBookingById
);

// -------------------------------
// 4️⃣ Admin: Get candidate riders for booking
// -------------------------------
router.get(
  "/candidate-riders/:id",
  roleAuthorization(["admin", "vendor"]),
  bookingController.getCandidateRiders
);

// -------------------------------
// 5️⃣ Admin / Vendor: Assign rider manually
// -------------------------------
router.put(
  "/assign/:id",
  roleAuthorization(["admin", "vendor"]),
  bookingController.assignRider
);

// -------------------------------
// 6️⃣ Rider / Admin / Vendor: Update booking status
// -------------------------------
router.put(
  "/status/:id",
  roleAuthorization(["rider", "admin", "vendor"]),
  bookingController.updateBookingStatus
);

// -------------------------------
// 7️⃣ User / Rider / Admin / Vendor: Cancel booking
// -------------------------------
router.put(
  "/cancel/:id",
  roleAuthorization(["user", "rider", "admin", "vendor"]),
  bookingController.cancelBooking
);

// -------------------------------
// 8️⃣ User: Submit review after ride completion
// -------------------------------
router.post(
  "/review/:id",
  roleAuthorization(["user"]),
  bookingController.submitReview
);

module.exports = router;
