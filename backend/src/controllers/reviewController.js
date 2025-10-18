// controllers/reviewController.js
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Rider = require("../models/Rider");

// =====================================================
// 1️⃣ SUBMIT REVIEW (User - After Ride Completion)
// =====================================================
exports.submitReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const passengerId = req.user?.id;

    if (!passengerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { rating, comment = "" } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "Rating is required and must be between 1 and 5" 
      });
    }

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate("riderId")
      .populate("passengerId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if passenger owns this booking
    if (booking.passengerId._id.toString() !== passengerId) {
      return res.status(403).json({ 
        message: "You can only review your own rides" 
      });
    }

    // Check if ride is completed
    if (booking.status !== "completed") {
      return res.status(400).json({ 
        message: "Can only review completed rides" 
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ 
        message: "Review already submitted for this booking" 
      });
    }

    const riderId = booking.riderId._id;

    // Create review
    const review = await Review.create({
      bookingId,
      passengerId,
      riderId,
      rating,
      comment
    });

    // Update rider's rating and review count
    const rider = booking.riderId;
    if (!rider.reviews) rider.reviews = [];
    
    rider.reviews.push(rating);
    rider.reviewCount = rider.reviews.length;
    rider.averageRating = (
      rider.reviews.reduce((a, b) => a + b, 0) / rider.reviews.length
    ).toFixed(2);

    await rider.save();

    // Update booking history
    booking.history.push({
      event: "Review submitted",
      role: "user",
      details: `Rating: ${rating}/5${comment ? `, Comment: ${comment}` : ""}`,
    });

    await booking.save();

    res.status(201).json({
      message: "Review submitted successfully!",
      review,
      riderNewRating: rider.averageRating
    });

  } catch (error) {
    console.error("Submit review error:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

// =====================================================
// 2️⃣ GET ALL REVIEWS (Admin Dashboard)
// =====================================================
exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, rating } = req.query;

    const filter = {};
    if (rating) filter.rating = Number(rating);

    const reviews = await Review.find(filter)
      .populate("passengerId", "name email mobile")
      .populate("riderId", "name mobile riderId averageRating reviewCount")
      .populate("bookingId", "pickupLocation dropLocation pickupDate finalPrice")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalReviews: total
    });

  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// =====================================================
// 3️⃣ GET REVIEW BY ID (Admin)
// =====================================================
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("passengerId", "name mobile email profileImage")
      .populate("riderId", "name mobile riderId averageRating reviewCount selfie")
      .populate("bookingId");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);

  } catch (error) {
    console.error("Get review by ID error:", error);
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

// =====================================================
// 4️⃣ DELETE REVIEW (Admin only)
// =====================================================
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Recalculate rider rating after removing this review
    const rider = await Rider.findById(review.riderId);
    if (rider && rider.reviews && rider.reviews.length > 0) {
      // Remove this rating from reviews array
      const ratingIndex = rider.reviews.indexOf(review.rating);
      if (ratingIndex > -1) {
        rider.reviews.splice(ratingIndex, 1);
      }
      
      rider.reviewCount = rider.reviews.length;
      rider.averageRating = rider.reviews.length > 0
        ? (rider.reviews.reduce((a, b) => a + b, 0) / rider.reviews.length).toFixed(2)
        : 0;
      
      await rider.save();
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ 
      message: "Review deleted successfully",
      updatedRiderRating: rider?.averageRating 
    });

  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
};

// =====================================================
// 5️⃣ GET DASHBOARD STATS (Admin)
// =====================================================
exports.getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    
    const avgRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } }
    ]);
    
    const ratingDistribution = await Review.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.status(200).json({
      totalReviews,
      averageRating: avgRating[0]?.avg.toFixed(2) || 0,
      ratingDistribution
    });

  } catch (error) {
    console.error("Get review stats error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};