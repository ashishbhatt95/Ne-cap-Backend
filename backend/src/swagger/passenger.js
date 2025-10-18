/**
 * @swagger
 * tags:
 *   name: Passenger
 *   description: Passenger management, authentication, and profile operations
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
 *           example: "9876543210"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1995-04-23"
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
 *           example: 0
 * 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/passenger/send-otp:
 *   post:
 *     summary: Send OTP to passenger's mobile number
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
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid or missing mobile number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/verify-otp:
 *   post:
 *     summary: Verify passenger OTP and check if registered
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
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP or missing fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/register:
 *   post:
 *     summary: Register a new passenger (after OTP verification)
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
 *                 example: "1998-05-22"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: Passenger registered successfully
 *       400:
 *         description: Missing fields or mobile already registered
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger/me:
 *   get:
 *     summary: Get logged-in passenger profile (User only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Passenger profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Passenger'
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       403:
 *         description: Forbidden - Not a passenger
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update logged-in passenger profile (User only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
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
 *               dateOfBirth:
 *                 type: string
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: Passenger profile updated successfully
 *       404:
 *         description: Passenger not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 *         description: List of all passengers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   get:
 *     summary: Get passenger by ID (User only)
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
 *         description: Passenger retrieved successfully
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
 *         description: Passenger deleted successfully
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/leaderboard:
 *   get:
 *     summary: Get top buyers by booking count (Admin only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Leaderboard retrieved successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/passenger/buyers:
 *   get:
 *     summary: Get all passengers with buyer status (Admin only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Buyers retrieved successfully
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
