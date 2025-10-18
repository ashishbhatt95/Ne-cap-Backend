/**
 * @swagger
 * tags:
 *   name: Passenger
 *   description: Passenger management, OTP authentication, and leaderboard
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Passenger:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB generated ID
 *         passengerId:
 *           type: string
 *           example: "ABC1234"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         mobile:
 *           type: string
 *           example: "1234567890"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         role:
 *           type: string
 *           example: "user"
 *         status:
 *           type: string
 *           example: "normal"
 *         registrationDate:
 *           type: string
 *           format: date-time
 *         bookingCount:
 *           type: integer
 *           example: 5
 */

/**
 * @swagger
 * /api/passenger/send-otp:
 *   post:
 *     summary: Send OTP to passenger's mobile
 *     tags: [Passenger]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: Mobile number required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/verify-otp:
 *   post:
 *     summary: Verify passenger OTP and check registration
 *     tags: [Passenger]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isRegister:
 *                   type: boolean
 *                 mobile:
 *                   type: string
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Invalid OTP or missing fields
 *       500:
 *         description: Server error
 */

/**
 * -------------------------------
 * PASSENGER REGISTRATION (PUBLIC)
 * -------------------------------
 */

/**
 * @swagger
 * /api/passenger/register:
 *   post:
 *     summary: Register a new passenger (no OTP)
 *     description: Used after OTP verification if the passenger is registering for the first time.
 *     tags: [Passenger]
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
 *               name:
 *                 type: string
 *                 example: "Ravi Sharma"
 *               email:
 *                 type: string
 *                 example: "ravi@example.com"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1998-05-22"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: Passenger registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Passenger registered successfully"
 *               token: "jwt-token-here"
 *               data:
 *                 id: "6711cfd0a5f16e01c4b2e9a9"
 *                 passengerId: "ABC1234"
 *                 name: "Ravi Sharma"
 *                 email: "ravi@example.com"
 *                 mobile: "9876543210"
 *                 role: "user"
 *       400:
 *         description: Missing fields or mobile already registered
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Mobile number already registered"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger:
 *   get:
 *     summary: Get all passengers (Admin only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of passengers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Passenger'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   get:
 *     summary: Get a single passenger by ID (User only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64f123abcd456ef7890"
 *     responses:
 *       200:
 *         description: Passenger retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Passenger'
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update passenger by ID (User only)
 *     tags: [Passenger]
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Passenger updated
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete passenger by ID (Admin only)
 *     tags: [Passenger]
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
 *         description: Passenger deleted
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/leaderboard:
 *   get:
 *     summary: Get passenger leaderboard (Admin only, buyers only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard retrieved
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/buyers:
 *   get:
 *     summary: Get all buyers (Admin only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Buyers list retrieved
 *       500:
 *         description: Server error
 */
