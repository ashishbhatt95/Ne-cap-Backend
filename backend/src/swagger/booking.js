/**
 * @swagger
 * tags:
 *   name: 📦 Bookings
 *   description: Booking management APIs for Users, Riders, and Admins
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *         passengerId:
 *           type: string
 *           example: "507f1f77bcf86cd799439012"
 *         riderId:
 *           type: string
 *           example: "507f1f77bcf86cd799439013"
 *         pickupLocation:
 *           type: string
 *           example: "Connaught Place, New Delhi"
 *         dropLocation:
 *           type: string
 *           example: "IGI Airport, New Delhi"
 *         distance:
 *           type: number
 *           example: 15.5
 *         pickupDate:
 *           type: string
 *           format: date-time
 *           example: "2025-10-20T10:00:00Z"
 *         rideEndDate:
 *           type: string
 *           format: date-time
 *           example: "2025-10-20T18:00:00Z"
 *         maleCount:
 *           type: number
 *           example: 2
 *         femaleCount:
 *           type: number
 *           example: 1
 *         kidsCount:
 *           type: number
 *           example: 0
 *         totalPassengers:
 *           type: number
 *           example: 3
 *         selectedCar:
 *           type: string
 *           example: "507f1f77bcf86cd799439014"
 *         acType:
 *           type: string
 *           enum: [AC, Non-AC]
 *           example: "AC"
 *         additionalDetails:
 *           type: string
 *           example: "Please call before arriving"
 *         journeyDays:
 *           type: number
 *           example: 1
 *         initialPrice:
 *           type: number
 *           example: 1500
 *         finalPrice:
 *           type: number
 *           example: 1800
 *         status:
 *           type: string
 *           enum: [in-review, rider-offer-sent, rider-assigned, in-process, completed, cancelled]
 *           example: "rider-assigned"
 *         offeredRiders:
 *           type: array
 *           items:
 *             type: string
 *           example: ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"]
 *         cancelledBy:
 *           type: string
 *           enum: [user, rider, admin]
 *           example: "user"
 *         cancelReason:
 *           type: string
 *           example: "Change of plans"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/bookings/create:
 *   post:
 *     summary: 🆕 Create a new booking (User only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupLocation
 *               - dropLocation
 *               - pickupDate
 *               - rideEndDate
 *               - selectedCar
 *               - acType
 *             properties:
 *               pickupLocation:
 *                 type: string
 *                 example: "Connaught Place, New Delhi"
 *               dropLocation:
 *                 type: string
 *                 example: "IGI Airport, New Delhi"
 *               distance:
 *                 type: number
 *                 example: 15.5
 *               pickupDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-20T10:00:00Z"
 *               rideEndDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-20T18:00:00Z"
 *               maleCount:
 *                 type: number
 *                 example: 2
 *               femaleCount:
 *                 type: number
 *                 example: 1
 *               kidsCount:
 *                 type: number
 *                 example: 0
 *               selectedCar:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439014"
 *               acType:
 *                 type: string
 *                 enum: [AC, Non-AC]
 *                 example: "AC"
 *               additionalDetails:
 *                 type: string
 *                 example: "Please call before arriving"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: 📋 Get all bookings (Admin only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: 🔍 Get booking by ID
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       403:
 *         description: Forbidden - Not your booking
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/candidate-riders/{id}:
 *   get:
 *     summary: 👥 Get candidate riders for booking (Admin only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: List of available riders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   mobile:
 *                     type: string
 *                   averageRating:
 *                     type: number
 *                   currentlyBusy:
 *                     type: boolean
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/assign/{id}:
 *   put:
 *     summary: 📤 Send offer to multiple riders (Admin only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - riderIds
 *               - finalPrice
 *             properties:
 *               riderIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"]
 *               finalPrice:
 *                 type: number
 *                 example: 1800
 *     responses:
 *       200:
 *         description: Offers sent to riders
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/accept/{id}:
 *   put:
 *     summary: ✅ Accept booking offer (Rider only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Booking accepted successfully
 *       400:
 *         description: Booking no longer available or already assigned
 *       403:
 *         description: Not offered this booking
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/reject/{id}:
 *   put:
 *     summary: ❌ Reject booking offer (Rider only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Booking offer rejected
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/status/{id}:
 *   put:
 *     summary: 🔄 Update booking status (Rider/Admin)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [in-review, rider-assigned, in-process, completed, cancelled]
 *                 example: "in-process"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/cancel/{id}:
 *   put:
 *     summary: 🚫 Cancel booking (User/Rider/Admin)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Change of plans"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Already cancelled or completed
 *       403:
 *         description: Cannot cancel after rider assignment
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/bookings/history/user:
 *   get:
 *     summary: 📜 Get user booking history (User only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 5
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/bookings/history/rider:
 *   get:
 *     summary: 📜 Get rider booking history (Rider only)
 *     tags: [📦 Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 12
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 */