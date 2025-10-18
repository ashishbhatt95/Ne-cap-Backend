// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { roleAuthorization } = require("../middlewares/authMiddleware"); // updated import

// -------------------------------
// User: Submit review after ride completion
// -------------------------------
router.post(
    "/submit/:bookingId",
    roleAuthorization(["user"]),
    reviewController.submitReview
);

// -------------------------------
// Admin / Rider: Get all reviews
// -------------------------------
router.get(
    "/all",
    roleAuthorization(["admin", "rider"]),
    reviewController.getAllReviews
);

// -------------------------------
// Admin / Rider: Get single review
// -------------------------------
router.get(
    "/review/:id",
    roleAuthorization(["admin", "rider"]),
    reviewController.getReviewById
);

// -------------------------------
// Admin: Delete review
// -------------------------------
router.delete(
    "/review/:reviewId",
    roleAuthorization(["admin"]),
    reviewController.deleteReview
);

// -------------------------------
// Admin / Rider: Get review stats
// -------------------------------
router.get(
    "/stats/dashboard",
    roleAuthorization(["admin", "rider"]),
    reviewController.getReviewStats
);

module.exports = router;
