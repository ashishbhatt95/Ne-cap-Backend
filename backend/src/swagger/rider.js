/**
 * @swagger
 * tags:
 *   name: Rider
 *   description: Rider registration, OTP, profile, management, and reviews
 */

/**
 * @swagger
 * /api/rider/send-otp:
 *   post:
 *     summary: Send OTP to rider mobile
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
 *         description: Mobile number required
 */

/**
 * @swagger
 * /api/rider/verify-otp:
 *   post:
 *     summary: Verify OTP and check registration status
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
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified. Returns token if rider exists
 *       400:
 *         description: Invalid OTP or missing fields
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
 *         description: Missing fields or mobile already registered
 */

/**
 * @swagger
 * /api/rider/me:
 *   get:
 *     summary: Get logged-in rider profile
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Rider profile returned
 *       401:
 *         description: Unauthorized / Invalid token
 * 
 *   put:
 *     summary: Update logged-in rider profile
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated rider profile
 *       401:
 *         description: Unauthorized / Invalid token
 */

/**
 * @swagger
 * /api/rider/approved:
 *   get:
 *     summary: Get all approved riders (admin only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of approved riders
 */

/**
 * @swagger
 * /api/rider/pending:
 *   get:
 *     summary: Get all pending riders (admin only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending riders
 */

/**
 * @swagger
 * /api/rider/:
 *   get:
 *     summary: Get all riders (admin only)
 *     tags: [Rider]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all riders
 */

/**
 * @swagger
 * /api/rider/{id}:
 *   get:
 *     summary: Get rider by ID (admin or rider)
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
 *         description: Rider details
 *       404:
 *         description: Rider not found
 * 
 *   put:
 *     summary: Update rider by ID (admin or rider)
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               isApproved:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *       404:
 *         description: Rider not found
 * 
 *   delete:
 *     summary: Delete rider by ID (admin only)
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
 *         description: Rider deleted
 *       404:
 *         description: Rider not found
 */

/**
 * @swagger
 * /api/rider/{id}/updateStatus:
 *   put:
 *     summary: Approve or reject rider (admin only)
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
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *     responses:
 *       200:
 *         description: Rider approved or rejected successfully
 *       404:
 *         description: Rider not found
 */

/**
 * @swagger
 * /api/rider/{riderId}/review:
 *   post:
 *     summary: Add passenger review to rider (user only)
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
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Review added successfully
 *       404:
 *         description: Rider not found
 */
