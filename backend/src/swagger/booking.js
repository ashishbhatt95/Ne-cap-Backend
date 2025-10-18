/**
 * @swagger
 * tags:
 *   - name: Booking
 *     description: Booking management APIs (User, Admin, Rider, Vendor)
 */

/**
 * -------------------------------
 * 1️⃣ Create a new booking (User)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     summary: Create a new booking (User only)
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
 *               - pickupDate
 *               - rideEndDate
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
 *                 format: date-time
 *               rideEndDate:
 *                 type: string
 *                 format: date-time
 *               maleCount:
 *                 type: integer
 *                 default: 0
 *               femaleCount:
 *                 type: integer
 *                 default: 0
 *               kidsCount:
 *                 type: integer
 *                 default: 0
 *               selectedCar:
 *                 type: string
 *                 description: VehicleCategory ID
 *               acType:
 *                 type: string
 *                 description: "AC / Non-AC"
 *               additionalDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 2️⃣ Get all bookings (Admin / Vendor)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/:
 *   get:
 *     summary: Get all bookings (Admin / Vendor)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 3️⃣ Get booking by ID (Role-based)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get booking details by ID (User, Rider, Admin, Vendor)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */

/**
 * -------------------------------
 * 4️⃣ Get candidate riders for booking (Admin / Vendor)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/candidate-riders/{id}:
 *   get:
 *     summary: Get candidate riders for a booking (Admin / Vendor)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: List of candidate riders
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 5️⃣ Assign booking to riders (Admin / Vendor)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/assign/{id}:
 *   put:
 *     summary: Send booking offer to multiple riders (Admin / Vendor)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
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
 *               finalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Offers sent successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 6️⃣ Accept booking offer (Rider)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/accept/{id}:
 *   put:
 *     summary: Rider accepts booking offer (first come, first served)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking accepted successfully
 *       400:
 *         description: Booking no longer available / overlapping
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */

/**
 * -------------------------------
 * 7️⃣ Reject booking offer (Rider)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/reject/{id}:
 *   put:
 *     summary: Rider rejects booking offer
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking offer rejected
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 8️⃣ Update booking status (Rider / Admin / Vendor)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/status/{id}:
 *   put:
 *     summary: Update booking status (Rider / Admin / Vendor)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [in-review, rider-assigned, in-process, completed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */

/**
 * -------------------------------
 * 9️⃣ Cancel booking (User / Rider / Admin / Vendor)
 * -------------------------------
 */
/**
 * @swagger
 * /api/booking/cancel/{id}:
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
 *         description: Booking ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for cancellation
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking cannot be cancelled
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */

/**
 * 🔟 Submit review (User)
 */
/**
 * @swagger
 * /api/booking/review/{id}:
 *   post:
 *     summary: Submit review after ride completion (User)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
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
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review submitted successfully
 *       400:
 *         description: Invalid rating / booking not completed
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 */

