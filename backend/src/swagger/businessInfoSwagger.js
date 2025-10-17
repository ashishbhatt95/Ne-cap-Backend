/**
 * @swagger
 * tags:
 *   name: BusinessInfo
 *   description: Manage business information (logo, contact, social links)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BusinessInfo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB generated ID
 *         businessName:
 *           type: string
 *           example: "NE Cab Services"
 *         address:
 *           type: string
 *           example: "123 Main Street, City, Country"
 *         contactNumber:
 *           type: string
 *           example: "+911234567890"
 *         emergencyContactNumber:
 *           type: string
 *           example: "+919876543210"
 *         email:
 *           type: string
 *           example: "info@necab.com"
 *         facebook:
 *           type: string
 *           example: "https://facebook.com/necab"
 *         instagram:
 *           type: string
 *           example: "https://instagram.com/necab"
 *         youtube:
 *           type: string
 *           example: "https://youtube.com/necab"
 *         logo:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "https://res.cloudinary.com/xyz/logo.png"
 *             public_id:
 *               type: string
 *               example: "logo123"
 *       required:
 *         - businessName
 *         - address
 *         - contactNumber
 */

/**
 * @swagger
 * /api/admin/business-info:
 *   post:
 *     summary: Add or update business info (Admin only)
 *     tags: [BusinessInfo]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               businessName:
 *                 type: string
 *               address:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               emergencyContactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *               facebook:
 *                 type: string
 *               instagram:
 *                 type: string
 *               youtube:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Business info added successfully
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
 *                   example: Business info added
 *                 data:
 *                   $ref: '#/components/schemas/BusinessInfo'
 *       200:
 *         description: Business info updated successfully
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
 *                   example: Business info updated
 *                 data:
 *                   $ref: '#/components/schemas/BusinessInfo'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server Error
 *                 error:
 *                   type: string
 *                   example: Error details
 *
 *   get:
 *     summary: Get current business info (public)
 *     tags: [BusinessInfo]
 *     responses:
 *       200:
 *         description: Business info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BusinessInfo'
 *       404:
 *         description: No business info found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No business info found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server Error
 *                 error:
 *                   type: string
 *                   example: Error details
 */
