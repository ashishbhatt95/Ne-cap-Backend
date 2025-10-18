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
// 4️⃣ Admin: Get ALL available riders (no pre-filtering)
// -------------------------------
router.get(
  "/candidate-riders/:id",
  roleAuthorization(["admin", "vendor"]),
  bookingController.getCandidateRiders
);

// -------------------------------
// 5️⃣ Admin / Vendor: Send offer to multiple riders
// -------------------------------
router.put(
  "/assign/:id",
  roleAuthorization(["admin", "vendor"]),
  bookingController.assignRider
);

// -------------------------------
// 6️⃣ Rider: Accept booking offer (First come, first served)
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
// 8️⃣ Rider / Admin / Vendor: Update booking status
// -------------------------------
router.put(
  "/status/:id",
  roleAuthorization(["rider", "admin", "vendor"]),
  bookingController.updateBookingStatus
);

// -------------------------------
// 9️⃣ User / Rider / Admin / Vendor: Cancel booking
// -------------------------------
router.put(
  "/cancel/:id",
  roleAuthorization(["user", "rider", "admin", "vendor"]),
  bookingController.cancelBooking
);

// -------------------------------
// 🔟 User: Submit review after ride completion
// -------------------------------
router.post(
  "/review/:id",
  roleAuthorization(["user"]),
  bookingController.submitReview
);

module.exports = router;