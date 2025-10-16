/**
 * @swagger
 * tags:
 *   name: Rider
 *   description: Rider management and authentication
 */

/**
 * @swagger
 * /api/rider/send-otp:
 *   post:
 *     summary: Send OTP to rider's mobile number
 *     tags: [Rider]
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
 *       400:
 *         description: Missing or invalid mobile number
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/verify-otp:
 *   post:
 *     summary: Verify OTP and check rider registration
 *     tags: [Rider]
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
 *       400:
 *         description: Invalid OTP or missing fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/register:
 *   post:
 *     summary: Register a new rider (with document uploads)
 *     tags: [Rider]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - dob
 *               - fatherName
 *               - motherName
 *               - email
 *               - mobile
 *               - aadharNumber
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Rohit Sharma"
 *               dob:
 *                 type: string
 *                 example: "1994-08-15"
 *               fatherName:
 *                 type: string
 *                 example: "Mohan Sharma"
 *               motherName:
 *                 type: string
 *                 example: "Kiran Sharma"
 *               email:
 *                 type: string
 *                 example: "rohit@example.com"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               aadharNumber:
 *                 type: string
 *                 example: "123456789012"
 *               panNumber:
 *                 type: string
 *                 example: "ABCDE1234F"
 *               address:
 *                 type: string
 *                 example: "221B Baker Street, Delhi"
 *               aadharFront:
 *                 type: string
 *                 format: binary
 *               aadharBack:
 *                 type: string
 *                 format: binary
 *               selfie:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Rider registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 rider:
 *                   $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider:
 *   get:
 *     summary: Get all riders (Admin only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all riders
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/approved:
 *   get:
 *     summary: Get all approved riders (Admin only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved riders
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/pending:
 *   get:
 *     summary: Get all pending riders (Admin only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending riders
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/{id}:
 *   get:
 *     summary: Get rider details by ID
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 670e77b9c9f32fbc27e15c00
 *     responses:
 *       200:
 *         description: Rider details
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/{id}:
 *   put:
 *     summary: Update rider details
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Updated Rider Name"
 *               email: "updated@example.com"
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/{id}:
 *   delete:
 *     summary: Delete a rider (Admin only)
 *     tags: [Rider]
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
 *         description: Rider deleted successfully
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/{id}/updateRiderStatus:
 *   put:
 *     summary: Approve or reject a rider (Admin only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *                 example: approve
 *     responses:
 *       200:
 *         description: Rider approved or rejected
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/rider/{riderId}/review:
 *   post:
 *     summary: Add a review for a rider (User only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: riderId
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
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Review added successfully
 *       400:
 *         description: Invalid rating
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Rider:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 670e77b9c9f32fbc27e15c00
 *         riderId:
 *           type: string
 *           example: XYZ1234
 *         name:
 *           type: string
 *           example: Rohit Sharma
 *         email:
 *           type: string
 *           example: rohit@example.com
 *         mobile:
 *           type: string
 *           example: 9876543210
 *         aadharNumber:
 *           type: string
 *           example: 123456789012
 *         panNumber:
 *           type: string
 *           example: ABCDE1234F
 *         address:
 *           type: string
 *           example: 221B Baker Street, Delhi
 *         aadharFront:
 *           type: string
 *           example: https://res.cloudinary.com/demo/aadharFront.jpg
 *         aadharBack:
 *           type: string
 *           example: https://res.cloudinary.com/demo/aadharBack.jpg
 *         selfie:
 *           type: string
 *           example: https://res.cloudinary.com/demo/selfie.jpg
 *         isApproved:
 *           type: boolean
 *           example: false
 *         registrationDate:
 *           type: string
 *           example: 2025-10-17T12:00:00.000Z
 *         averageRating:
 *           type: number
 *           example: 4.8
 *         reviewCount:
 *           type: number
 *           example: 25
 */

