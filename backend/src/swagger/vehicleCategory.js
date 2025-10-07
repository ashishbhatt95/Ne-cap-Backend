/**
 * @swagger
 * tags:
 *   name: VehicleCategory
 *   description: Vehicle category management APIs (Admin)
 */

/**
 * @swagger
 * /api/vehicle-category/add:
 *   post:
 *     summary: Add new vehicle category
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     description: Accessible only by superadmin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - minPricePerKm
 *               - fuelType
 *               - personCapacity
 *               - acType
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Swift Dzire"
 *               type:
 *                 type: string
 *                 example: "Sedan"
 *               minPricePerKm:
 *                 type: number
 *                 example: 12
 *               fuelType:
 *                 type: string
 *                 example: "Petrol"
 *               personCapacity:
 *                 type: number
 *                 example: 4
 *               acType:
 *                 type: string
 *                 example: "AC"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vehicle category added successfully
 *       400:
 *         description: Missing required fields or image upload failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/vehicle-category/:
 *   get:
 *     summary: Get all vehicle categories
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     description: Accessible by superadmin and vendor
 *     responses:
 *       200:
 *         description: List of all vehicle categories
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/vehicle-category/{id}:
 *   get:
 *     summary: Get vehicle category by ID
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *     responses:
 *       200:
 *         description: Vehicle category details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     summary: Update vehicle category
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { type: string }
 *               minPricePerKm: { type: number }
 *               fuelType: { type: string }
 *               personCapacity: { type: number }
 *               acType: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Vehicle category updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete vehicle category
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle category ID
 *     responses:
 *       200:
 *         description: Vehicle category deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */
