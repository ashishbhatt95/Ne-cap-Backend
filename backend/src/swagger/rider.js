/**
 * @swagger
 * tags:
 *   name: Rider
 *   description: Rider registration, OTP, document upload, admin approval, and reviews
 */

/**
 * @swagger
 * /api/rider/register:
 *   post:
 *     summary: Register new rider (with document upload)
 *     tags: [Rider]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Amit Singh" }
 *               dob: { type: string, example: "1998-02-15" }
 *               fatherName: { type: string, example: "Raj Singh" }
 *               motherName: { type: string, example: "Sita Singh" }
 *               email: { type: string, example: "amit@gmail.com" }
 *               mobile: { type: string, example: "9876543210" }
 *               aadharNumber: { type: string, example: "123456789012" }
 *               panNumber: { type: string, example: "ABCDE1234F" }
 *               address: { type: string, example: "123 MG Road, Delhi, 110001" }
 *               aadharFront: { type: string, format: binary }
 *               aadharBack: { type: string, format: binary }
 *               selfie: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Rider registration initiated (OTP sent)
 *       400:
 *         description: Missing or invalid fields
 */

/**
 * @swagger
 * /api/rider/verify-otp:
 *   post:
 *     summary: Verify OTP and activate rider
 *     tags: [Rider]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string, example: "9876543210" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Rider registered successfully
 *       400:
 *         description: Invalid OTP or missing data
 */

/**
 * @swagger
 * /api/rider/resend-otp:
 *   post:
 *     summary: Resend OTP to rider
 *     tags: [Rider]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile: { type: string, example: "9876543210" }
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Missing mobile or rider already verified
 */

/**
 * @swagger
 * /api/rider:
 *   get:
 *     summary: Get all riders
 *     tags: [Rider]
 *     responses:
 *       200:
 *         description: List of all riders
 */

/**
 * @swagger
 * /api/rider/{id}:
 *   get:
 *     summary: Get single rider by ID
 *     tags: [Rider]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider ID
 *     responses:
 *       200:
 *         description: Rider details
 *       404:
 *         description: Rider not found
 *   put:
 *     summary: Update rider details
 *     tags: [Rider]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               address: { type: string }
 *               panNumber: { type: string }
 *               aadharNumber: { type: string }
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *       404:
 *         description: Rider not found
 *   delete:
 *     summary: Delete rider
 *     tags: [Rider]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider ID
 *     responses:
 *       200:
 *         description: Rider deleted successfully
 *       404:
 *         description: Rider not found
 */

/**
 * @swagger
 * /api/rider/{id}/approve:
 *   post:
 *     summary: Admin approves rider registration
 *     tags: [Rider]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider ID
 *     responses:
 *       200:
 *         description: Rider approved successfully
 *       404:
 *         description: Rider not found
 */

/**
 * @swagger
 * /api/rider/{id}/reject:
 *   post:
 *     summary: Admin rejects rider registration
 *     tags: [Rider]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider ID
 *     responses:
 *       200:
 *         description: Rider rejected successfully
 *       404:
 *         description: Rider not found
 */

/**
 * @swagger
 * /api/rider/{riderId}/review:
 *   post:
 *     summary: Add passenger review to rider
 *     tags: [Rider]
 *     parameters:
 *       - in: path
 *         name: riderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Rider ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating: { type: number, example: 5 }
 *     responses:
 *       200:
 *         description: Review added successfully
 *       400:
 *         description: Invalid rating
 *       404:
 *         description: Rider not found
 */
