/**
 * @swagger
 * tags:
 *   name: Rider
 *   description: Rider management, OTP authentication, registration, approval, and reviews
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
 *           description: MongoDB ID
 *         riderId:
 *           type: string
 *           example: "XYZ1234"
 *         name:
 *           type: string
 *         dob:
 *           type: string
 *           format: date
 *         fatherName:
 *           type: string
 *         motherName:
 *           type: string
 *         email:
 *           type: string
 *         mobile:
 *           type: string
 *         aadharNumber:
 *           type: string
 *         panNumber:
 *           type: string
 *         address:
 *           type: string
 *         aadharFront:
 *           type: string
 *           format: url
 *         aadharBack:
 *           type: string
 *           format: url
 *         selfie:
 *           type: string
 *           format: url
 *         otpVerified:
 *           type: boolean
 *         isSubmitted:
 *           type: boolean
 *         isApproved:
 *           type: boolean
 *         role:
 *           type: string
 *         registrationDate:
 *           type: string
 *           format: date-time
 *         reviews:
 *           type: array
 *           items:
 *             type: integer
 *         reviewCount:
 *           type: integer
 *         averageRating:
 *           type: number
 */

/**
 * @swagger
 * /api/rider/send-otp:
 *   post:
 *     summary: Send OTP to rider's mobile
 *     tags: [Rider]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "+911234567890"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Mobile number required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/rider/verify-otp:
 *   post:
 *     summary: Verify OTP and check registration
 *     tags: [Rider]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified, returns token if registered
 *       400:
 *         description: Invalid OTP or missing fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/rider/register:
 *   post:
 *     summary: Register a new rider
 *     tags: [Rider]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               fatherName:
 *                 type: string
 *               motherName:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               aadharNumber:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               address:
 *                 type: string
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
 *       400:
 *         description: Missing fields or already registered
 *       500:
 *         description: Server error
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
 *         description: Server error
 *
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
 *         description: Server error
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
 *         description: List of riders
 *       500:
 *         description: Server error
 *
 * /api/rider/{id}:
 *   get:
 *     summary: Get a rider by ID
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
 *         description: Rider found
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a rider by ID
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
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a rider by ID (Admin only)
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
 *         description: Server error
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: "approve or reject"
 *                 example: "approve"
 *     responses:
 *       200:
 *         description: Rider approved/rejected successfully
 *       404:
 *         description: Rider not found
 *       400:
 *         description: Invalid action
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/rider/{riderId}/review:
 *   post:
 *     summary: Add a review to a rider (Passenger only)
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
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review added successfully
 *       400:
 *         description: Invalid rating
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Server error
 */
