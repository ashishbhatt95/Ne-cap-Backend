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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Swift Dzire" }
 *               type: { type: string, example: "Sedan" }
 *               minPricePerKm: { type: number, example: 12 }
 *               fuelType: { type: string, example: "Petrol" }
 *               personCapacity: { type: number, example: 4 }
 *               acType: { type: string, example: "AC" }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Vehicle category added successfully
 *       400:
 *         description: Missing required fields or image upload failed
 */

/**
 * @swagger
 * /api/vehicle-category/:
 *   get:
 *     summary: Get all vehicle categories
 *     tags: [VehicleCategory]
 *     responses:
 *       200:
 *         description: List of all vehicle categories
 */

/**
 * @swagger
 * /api/vehicle-category/{id}:
 *   get:
 *     summary: Get vehicle category by ID
 *     tags: [VehicleCategory]
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
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/vehicle-category/{id}:
 *   put:
 *     summary: Update vehicle category
 *     tags: [VehicleCategory]
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
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/vehicle-category/{id}:
 *   delete:
 *     summary: Delete vehicle category
 *     tags: [VehicleCategory]
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
 *       404:
 *         description: Category not found
 */