/**
 * @swagger
 * tags:
 *   - name: Booking
 *     description: Booking management APIs (User, Admin, Rider)
 */

/**
 * -------------------------------
 * Booking APIs
 * -------------------------------
 */

/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     summary: User creates a new booking
 *     tags: [Booking]
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
 *               - distance
 *               - pickupDate
 *               - rideEndDate
 *               - maleCount
 *               - femaleCount
 *               - kidsCount
 *               - selectedCar
 *               - acType
 *             properties:
 *               pickupLocation:
 *                 type: string
 *               dropLocation:
 *                 type: string
 *               distance:
 *                 type: number
 *               pickupDate:
 *                 type: string
 *                 format: date
 *               rideEndDate:
 *                 type: string
 *                 format: date
 *               maleCount:
 *                 type: number
 *               femaleCount:
 *                 type: number
 *               kidsCount:
 *                 type: number
 *               selectedCar:
 *                 type: string
 *               acType:
 *                 type: string
 *                 enum: [AC, Non-AC]
 *               additionalDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Get all bookings (Admin)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */

/**
 * @swagger
 * /api/booking/my:
 *   get:
 *     summary: Get all bookings of logged-in user (User)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's bookings
 */

/**
 * @swagger
 * /api/booking/assigned:
 *   get:
 *     summary: Get all bookings assigned to logged-in rider (Rider)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned bookings
 */

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/booking/{id}/assign:
 *   put:
 *     summary: Admin assigns a rider to booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - riderId
 *             properties:
 *               riderId:
 *                 type: string
 *               finalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Rider assigned successfully
 */

/**
 * @swagger
 * /api/booking/{id}/candidate-riders:
 *   get:
 *     summary: Get available riders for a booking (Admin)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of candidate riders
 */

/**
 * @swagger
 * /api/booking/{id}/price:
 *   put:
 *     summary: Update final price before ride starts (Admin)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - finalPrice
 *             properties:
 *               finalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Booking price updated
 */

/**
 * @swagger
 * /api/booking/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [in-review, in-process, rider-assigned, completed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 */

/**
 * @swagger
 * /api/booking/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - reason
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, rider, superadmin, vendor]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking already cancelled or completed
 */

/**
 * @swagger
 * /api/booking/{id}/review:
 *   post:
 *     summary: Submit rating/review after ride completion (User)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review submitted successfully
 */

/**
 * @swagger
 * /api/booking/{id}/notifications:
 *   get:
 *     summary: Get all notifications for a booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of notifications related to the booking
 */

/**
 * @swagger
 * /api/booking/{id}/history:
 *   get:
 *     summary: Get booking event history
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking history events
 */
