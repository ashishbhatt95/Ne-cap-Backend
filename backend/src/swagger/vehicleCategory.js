/**
 * @swagger
 * tags:
 *   name: VehicleCategory
 *   description: Vehicle category management (Admin / Vendor)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         minPricePerKm:
 *           type: number
 *         fuelType:
 *           type: string
 *         personCapacity:
 *           type: integer
 *         acType:
 *           type: string
 *         status:
 *           type: string
 *         image:
 *           type: string
 *           format: url
 */

/**
 * @swagger
 * /api/vehicle-category/add:
 *   post:
 *     summary: Add new vehicle category (Admin only)
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               minPricePerKm:
 *                 type: number
 *               fuelType:
 *                 type: string
 *               personCapacity:
 *                 type: integer
 *               acType:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vehicle category added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vehicle-category:
 *   get:
 *     summary: Get all vehicle categories (Admin, Vendor)
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicle categories
 *       500:
 *         description: Server error
 *
 * /api/vehicle-category/{id}:
 *   get:
 *     summary: Get vehicle category by ID (Admin, Vendor)
 *     tags: [VehicleCategory]
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
 *         description: Vehicle category found
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update vehicle category (Admin only)
 *     tags: [VehicleCategory]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               minPricePerKm:
 *                 type: number
 *               fuelType:
 *                 type: string
 *               personCapacity:
 *                 type: integer
 *               acType:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Vehicle category updated successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete vehicle category (Admin only)
 *     tags: [VehicleCategory]
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
 *         description: Vehicle category deleted successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
