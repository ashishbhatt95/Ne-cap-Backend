/**
 * @swagger
 * tags:
 *   name: Rider
 *   description: Rider registration, OTP, and document upload APIs
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
 *               email: { type: string, example: "amit@gmail.com" }
 *               mobile: { type: string, example: "9876543210" }
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
