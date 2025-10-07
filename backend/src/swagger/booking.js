/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking management APIs (User, Admin, Rider)
 */

/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     summary: User creates a new booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible only by role: user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passengerId:
 *                 type: string
 *                 example: 65123abc987xyz000111222
 *               pickupLocation:
 *                 type: string
 *                 example: "Indira Nagar, Delhi"
 *               dropLocation:
 *                 type: string
 *                 example: "Connaught Place, Delhi"
 *               distance:
 *                 type: number
 *                 example: 25
 *               pickupDate:
 *                 type: string
 *                 example: "2025-10-10"
 *               rideEndDate:
 *                 type: string
 *                 example: "2025-10-12"
 *               maleCount:
 *                 type: number
 *                 example: 2
 *               femaleCount:
 *                 type: number
 *                 example: 1
 *               kidsCount:
 *                 type: number
 *                 example: 1
 *               selectedCar:
 *                 type: string
 *                 example: 650d2f8b4c2a2f0012345679
 *               acType:
 *                 type: string
 *                 enum: [AC, Non-AC]
 *                 example: "AC"
 *               additionalDetails:
 *                 type: string
 *                 example: "Need child seat and water bottles"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized (JWT missing or invalid)
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Get all bookings
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible only by roles: superadmin, vendor"
 *     responses:
 *       200:
 *         description: List of all bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Failed to fetch bookings
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
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/booking/{id}/assign:
 *   put:
 *     summary: Admin assigns a rider to booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible only by roles: superadmin, vendor"
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
 *               riderId:
 *                 type: string
 *                 example: 650d2f8b4c2a2f0012345678
 *               finalPrice:
 *                 type: number
 *                 example: 2500
 *     responses:
 *       200:
 *         description: Rider assigned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Failed to assign rider
 */

/**
 * @swagger
 * /api/booking/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible by roles: rider, superadmin, vendor"
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
 *                 enum: [in-review, in-process, rider-assigned, completed, cancelled]
 *                 example: "completed"
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Failed to update status
 */

/**
 * @swagger
 * /api/booking/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible by roles: user, rider, superadmin, vendor"
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
 *               role:
 *                 type: string
 *                 enum: [user, rider, superadmin, vendor]
 *                 example: "user"
 *               reason:
 *                 type: string
 *                 example: "Plans changed, no longer needed"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking already cancelled or completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal Server Error
 */
