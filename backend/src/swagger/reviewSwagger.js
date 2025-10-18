/**
 * @swagger
 * tags:
 *   name:  Reviews
 *   description: Review and rating management APIs for Users, Riders, and Admins
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         bookingId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         passengerId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *         riderId:
 *           type: string
 *           example: "507f1f77bcf86cd799439014"
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           example: 4.5
 *         comment:
 *           type: string
 *           example: "Great ride! Driver was professional and punctual."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-20T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-20T10:30:00Z"
 *     
 *     ReviewStats:
 *       type: object
 *       properties:
 *         totalReviews:
 *           type: number
 *           example: 150
 *         averageRating:
 *           type: string
 *           example: "4.35"
 *         ratingDistribution:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: number
 *                 example: 5
 *               count:
 *                 type: number
 *                 example: 75
 */

/**
 * @swagger
 * /api/reviews/submit/{bookingId}:
 *   post:
 *     summary:  Submit review after ride completion (User only)
 *     tags: [ Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID to review
 *         example: "507f1f77bcf86cd799439012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4.5
 *                 description: Rating from 1 to 5
 *               comment:
 *                 type: string
 *                 example: "Excellent service! Very professional driver."
 *                 description: Optional review comment
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review submitted successfully!"
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *                 riderNewRating:
 *                   type: string
 *                   example: "4.52"
 *       400:
 *         description: Invalid rating or already reviewed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rating is required and must be between 1 and 5"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Can only review own rides
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/reviews/all:
 *   get:
 *     summary:  Get all reviews (Admin/Rider)
 *     tags: [ Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of reviews per page
 *         example: 20
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by specific rating
 *         example: 5
 *     responses:
 *       200:
 *         description: List of reviews with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 totalPages:
 *                   type: number
 *                   example: 8
 *                 currentPage:
 *                   type: number
 *                   example: 1
 *                 totalReviews:
 *                   type: number
 *                   example: 150
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied - Admin/Rider only
 */

/**
 * @swagger
 * /api/reviews/review/{id}:
 *   get:
 *     summary:  Get review by ID (Admin/Rider)
 *     tags: [ Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Review details with populated data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 bookingId:
 *                   type: object
 *                   description: Full booking details
 *                 passengerId:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *                 riderId:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     mobile:
 *                       type: string
 *                     riderId:
 *                       type: string
 *                     averageRating:
 *                       type: number
 *                     reviewCount:
 *                       type: number
 *                     selfie:
 *                       type: string
 *                 rating:
 *                   type: number
 *                 comment:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews/review/{reviewId}:
 *   delete:
 *     summary:  Delete review (Admin only)
 *     tags: [ Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID to delete
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Review deleted and rider rating recalculated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *                 updatedRiderRating:
 *                   type: string
 *                   example: "4.48"
 *                   description: Rider's new average rating after deletion
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews/stats/dashboard:
 *   get:
 *     summary:  Get review statistics (Admin/Rider Dashboard)
 *     tags: [ Reviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Review statistics and rating distribution
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReviewStats'
 *             example:
 *               totalReviews: 150
 *               averageRating: "4.35"
 *               ratingDistribution:
 *                 - _id: 5
 *                   count: 75
 *                 - _id: 4
 *                   count: 50
 *                 - _id: 3
 *                   count: 15
 *                 - _id: 2
 *                   count: 7
 *                 - _id: 1
 *                   count: 3
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin/Rider access required
 */