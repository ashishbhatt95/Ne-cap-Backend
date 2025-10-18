/**
 * @swagger
 * tags:
 *   - name: Booking
 *     description: Booking management APIs (User, Admin, Rider, Vendor)
 */

/**
 * -------------------------------
 * 1️⃣ Create Booking (User)
 * -------------------------------
 * @swagger
 * /api/booking/create:
 *   post:
 *     summary: Create a new booking (User only)
 *     description: Passenger books a ride after selecting car and trip details.
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
 *                 example: "Delhi"
 *               dropLocation:
 *                 type: string
 *                 example: "Jaipur"
 *               distance:
 *                 type: number
 *                 example: 280
 *               pickupDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-19T09:00:00Z"
 *               rideEndDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-21T18:00:00Z"
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
 *                 description: VehicleCategory ID
 *                 example: "67121ae4f5b7b8e4c0b2dfc7"
 *               acType:
 *                 type: string
 *                 enum: [AC, Non-AC]
 *                 example: "AC"
 *               additionalDetails:
 *                 type: string
 *                 example: "Need a baby seat"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Booking created successfully"
 *               booking:
 *                 _id: "67122ceaf9b1c4a1234abcde"
 *                 status: "in-review"
 *                 pickupLocation: "Delhi"
 *                 dropLocation: "Jaipur"
 *                 initialPrice: 4200
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 2️⃣ Get All Bookings (Admin / Vendor)
 * -------------------------------
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Get all bookings
 *     description: Admin or vendor can fetch all bookings with populated user, rider, and vehicle info.
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             example:
 *               - _id: "67122ceaf9b1c4a1234abcde"
 *                 passengerId:
 *                   name: "Ravi Sharma"
 *                   mobile: "9876543210"
 *                 selectedCar:
 *                   name: "Innova Crysta"
 *                   minPricePerKm: 12
 *                 status: "in-review"
 *       500:
 *         description: Failed to fetch bookings
 */

/**
 * -------------------------------
 * 3️⃣ Get Booking by ID (Role-based)
 * -------------------------------
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get booking details by ID
 *     description: Accessible by user (own booking), rider (assigned booking), or admin/vendor.
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
 *         description: Booking details retrieved
 *         content:
 *           application/json:
 *             example:
 *               _id: "67122ceaf9b1c4a1234abcde"
 *               pickupLocation: "Delhi"
 *               dropLocation: "Jaipur"
 *               status: "rider-assigned"
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 4️⃣ Get Candidate Riders (Admin / Vendor)
 * -------------------------------
 * @swagger
 * /api/booking/candidate-riders/{id}:
 *   get:
 *     summary: Get list of available riders for a booking
 *     description: Admin/vendor can see which riders are free for a booking window.
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
 *         description: List of available riders
 *         content:
 *           application/json:
 *             example:
 *               - _id: "67123abc99e31e8e9b5b1234"
 *                 name: "Amit Singh"
 *                 mobile: "9876500012"
 *                 isApproved: true
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 5️⃣ Assign Rider (Admin / Vendor)
 * -------------------------------
 * @swagger
 * /api/booking/assign/{id}:
 *   put:
 *     summary: Assign rider manually to a booking
 *     description: Admin/vendor assigns a specific rider to a booking with optional final price update.
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
 *             required: [riderId]
 *             properties:
 *               riderId:
 *                 type: string
 *                 example: "6711d9f0a7a0cba3e8b12345"
 *               finalPrice:
 *                 type: number
 *                 example: 5500
 *     responses:
 *       200:
 *         description: Rider assigned successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Rider assigned successfully"
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Failed to assign rider
 */

/**
 * -------------------------------
 * 6️⃣ Update Booking Status (Rider / Admin / Vendor)
 * -------------------------------
 * @swagger
 * /api/booking/status/{id}:
 *   put:
 *     summary: Update booking status
 *     description: Rider, admin, or vendor updates the booking’s current status.
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [rider-assigned, in-process, completed, cancelled]
 *                 example: "in-process"
 *     responses:
 *       200:
 *         description: Booking status updated
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 7️⃣ Cancel Booking (All Roles)
 * -------------------------------
 * @swagger
 * /api/booking/cancel/{id}:
 *   put:
 *     summary: Cancel a booking
 *     description: Booking can be cancelled by user, rider, or admin depending on rules.
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
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, rider, superadmin, vendor]
 *                 example: "user"
 *               reason:
 *                 type: string
 *                 example: "Changed travel plan"
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Already cancelled or completed
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */

/**
 * -------------------------------
 * 8️⃣ Submit Review (User)
 * -------------------------------
 * @swagger
 * /api/booking/review/{id}:
 *   post:
 *     summary: Submit review and rating after ride completion
 *     description: Passenger gives feedback on the completed ride.
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
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Very smooth and comfortable ride!"
 *     responses:
 *       200:
 *         description: Review submitted successfully
 *       400:
 *         description: Ride not completed yet
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
