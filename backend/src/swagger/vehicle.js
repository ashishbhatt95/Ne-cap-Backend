/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Vehicle & Vehicle Category management (Admin/Rider)
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
 *     tags: [Vehicle]
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
 *         description: Vehicle category added
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vehicle-category:
 *   get:
 *     summary: Get all vehicle categories
 *     tags: [Vehicle]
 *     responses:
 *       200:
 *         description: List of vehicle categories
 *       500:
 *         description: Server error
 *
 * /api/vehicle-category/{id}:
 *   get:
 *     summary: Get vehicle category by ID
 *     tags: [Vehicle]
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
 *     tags: [Vehicle]
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
 *         description: Updated successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete vehicle category (Admin only)
 *     tags: [Vehicle]
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
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vehicle/add:
 *   post:
 *     summary: Add a vehicle (Rider only)
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               front:
 *                 type: string
 *                 format: binary
 *               back:
 *                 type: string
 *                 format: binary
 *               leftSide:
 *                 type: string
 *                 format: binary
 *               rightSide:
 *                 type: string
 *                 format: binary
 *               insurance:
 *                 type: string
 *                 format: binary
 *               pollutionCert:
 *                 type: string
 *                 format: binary
 *               vehicleCategoryId:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/vehicle/my-vehicles:
 *   get:
 *     summary: Get rider's own vehicles
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of rider vehicles
 *       500:
 *         description: Server error
 *
 * /api/vehicle:
 *   get:
 *     summary: Get all vehicles (Admin only)
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all vehicles
 *       500:
 *         description: Server error
 *
 * /api/vehicle/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     tags: [Vehicle]
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
 *         description: Vehicle found
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update vehicle
 *     tags: [Vehicle]
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
 *               front:
 *                 type: string
 *                 format: binary
 *               back:
 *                 type: string
 *                 format: binary
 *               leftSide:
 *                 type: string
 *                 format: binary
 *               rightSide:
 *                 type: string
 *                 format: binary
 *               insurance:
 *                 type: string
 *                 format: binary
 *               pollutionCert:
 *                 type: string
 *                 format: binary
 *               vehicleCategoryId:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete vehicle
 *     tags: [Vehicle]
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
 *         description: Vehicle deleted successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
