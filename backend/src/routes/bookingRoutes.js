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
// 2️⃣ Admin: Get all bookings
// -------------------------------
router.get(
  "/",
  roleAuthorization(["admin"]),
  bookingController.getAllBookings
);

// -------------------------------
// 3️⃣ Get booking by ID (Role-based)
// -------------------------------
router.get(
  "/:id",
  roleAuthorization(["user", "rider", "admin"]),
  bookingController.getBookingById
);

// -------------------------------
// 4️⃣ Admin: Get ALL available riders
// -------------------------------
router.get(
  "/candidate-riders/:id",
  roleAuthorization(["admin"]),
  bookingController.getCandidateRiders
);

// -------------------------------
// 5️⃣ Admin: Send offer to multiple riders
// -------------------------------
router.put(
  "/assign/:id",
  roleAuthorization(["admin"]),
  bookingController.assignRider
);

// -------------------------------
// 6️⃣ Rider: Accept booking offer
// -------------------------------
router.put(
  "/accept/:id",
  roleAuthorization(["rider"]),
  bookingController.acceptBookingOffer
);

// -------------------------------
// 7️⃣ Rider: Reject booking offer
// -------------------------------
router.put(
  "/reject/:id",
  roleAuthorization(["rider"]),
  bookingController.rejectBookingOffer
);

// -------------------------------
// 8️⃣ Rider / Admin: Update booking status
// -------------------------------
router.put(
  "/status/:id",
  roleAuthorization(["rider", "admin"]),
  bookingController.updateBookingStatus
);

// -------------------------------
// 9️⃣ User / Rider / Admin: Cancel booking
// -------------------------------
router.put(
  "/cancel/:id",
  roleAuthorization(["user", "rider", "admin"]),
  bookingController.cancelBooking
);

module.exports = router;