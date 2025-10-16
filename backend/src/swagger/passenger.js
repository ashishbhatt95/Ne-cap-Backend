/**
 * @swagger
 * tags:
 *   name: Passenger
 *   description: Passenger management and OTP authentication
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
 *             required:
 *               - mobile
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
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
 *         description: Missing or invalid mobile number
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger/verify-otp:
 *   post:
 *     summary: Verify OTP and check registration status
 *     tags: [Passenger]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - otp
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isRegister:
 *                   type: boolean
 *                   example: false
 *                 mobile:
 *                   type: string
 *                   example: "9876543210"
 *                 message:
 *                   type: string
 *                   example: First-time user. Please complete registration.
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid OTP or missing fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger/register:
 *   post:
 *     summary: Register a new passenger
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
 *                 example: "Ravi Kumar"
 *               email:
 *                 type: string
 *                 example: "ravi@example.com"
 *               dateOfBirth:
 *                 type: string
 *                 example: "1995-07-12"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       201:
 *         description: Passenger registered successfully
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
 *                   example: Passenger registered successfully
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 670e77b9c9f32fbc27e15c00
 *                     passengerId:
 *                       type: string
 *                       example: ABC1234
 *                     name:
 *                       type: string
 *                       example: Ravi Kumar
 *                     email:
 *                       type: string
 *                       example: ravi@example.com
 *                     mobile:
 *                       type: string
 *                       example: 9876543210
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Validation error or user already registered
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
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Passenger'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   get:
 *     summary: Get a passenger by ID (Admin only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: 670e77b9c9f32fbc27e15c00
 *     responses:
 *       200:
 *         description: Passenger details
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   put:
 *     summary: Update a passenger (Admin only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Updated Name"
 *               email: "updated@example.com"
 *     responses:
 *       200:
 *         description: Passenger updated successfully
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/passenger/{id}:
 *   delete:
 *     summary: Delete a passenger (Admin only)
 *     tags: [Passenger]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Passenger deleted successfully
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal server error
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
 *           example: 670e77b9c9f32fbc27e15c00
 *         passengerId:
 *           type: string
 *           example: ABC1234
 *         name:
 *           type: string
 *           example: Ravi Kumar
 *         email:
 *           type: string
 *           example: ravi@example.com
 *         mobile:
 *           type: string
 *           example: 9876543210
 *         role:
 *           type: string
 *           example: user
 *         registrationDate:
 *           type: string
 *           example: 2025-10-17T10:45:00.000Z
 */