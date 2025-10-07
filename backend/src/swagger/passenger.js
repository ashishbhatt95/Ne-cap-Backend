/**
 * @swagger
 * tags:
 *   name: Passenger
 *   description: Passenger registration, OTP, and CRUD APIs
 */

/**
 * @swagger
 * /api/passenger/signup/send-otp:
 *   post:
 *     summary: Send OTP for passenger signup
 *     tags: [Passenger]
 *     description: "Public endpoint, no JWT required"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - dateOfBirth
 *               - mobile
 *             properties:
 *               name: { type: string, example: "Rohit Sharma" }
 *               email: { type: string, example: "rohit@gmail.com" }
 *               dateOfBirth: { type: string, example: "1995-04-10" }
 *               mobile: { type: string, example: "9876543210" }
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Missing fields or already registered
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passenger/signup/verify-otp:
 *   post:
 *     summary: Verify OTP and complete passenger registration
 *     tags: [Passenger]
 *     description: "Public endpoint, no JWT required"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - dateOfBirth
 *               - mobile
 *               - otp
 *             properties:
 *               name: { type: string, example: "Rohit Sharma" }
 *               email: { type: string, example: "rohit@gmail.com" }
 *               dateOfBirth: { type: string, example: "1995-04-10" }
 *               mobile: { type: string, example: "9876543210" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Passenger registered successfully
 *       400:
 *         description: Invalid OTP or already registered
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passenger:
 *   get:
 *     summary: Get all passengers
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     description: "Protected: accessible only by superadmin"
 *     responses:
 *       200:
 *         description: List of all passengers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   get:
 *     summary: Get passenger by ID
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     description: "Protected: accessible only by superadmin"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passenger ID
 *     responses:
 *       200:
 *         description: Passenger data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   put:
 *     summary: Update passenger details
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     description: "Protected: accessible only by superadmin"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passenger ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Rohit Sharma" }
 *               email: { type: string, example: "rohit@gmail.com" }
 *               dateOfBirth: { type: string, example: "1995-04-10" }
 *               mobile: { type: string, example: "9876543210" }
 *     responses:
 *       200:
 *         description: Passenger updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   delete:
 *     summary: Delete passenger by ID
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     description: "Protected: accessible only by superadmin"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passenger ID
 *     responses:
 *       200:
 *         description: Passenger deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal Server Error
 */
