/**
 * @swagger
 * tags:
 *   name: Vehicle
 *   description: Rider vehicles management APIs
 */

/**
 * @swagger
 * /api/vehicle/add:
 *   post:
 *     summary: Rider adds a new vehicle
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible by authenticated riders only"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - riderId
 *               - categoryId
 *               - vehicleNumber
 *               - front
 *               - back
 *               - leftSide
 *               - rightSide
 *             properties:
 *               riderId:
 *                 type: string
 *                 example: 650d2f8b4c2a2f0012345678
 *               categoryId:
 *                 type: string
 *                 example: 650d2f8b4c2a2f0012345679
 *               vehicleNumber:
 *                 type: string
 *                 example: MH12AB1234
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
 *     responses:
 *       201:
 *         description: Vehicle added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (role not allowed)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/vehicle/my-vehicles:
 *   get:
 *     summary: Get all vehicles added by the logged-in rider
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible by authenticated riders only"
 *     responses:
 *       200:
 *         description: List of vehicles for the rider
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (non-rider)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/vehicle:
 *   get:
 *     summary: Get all vehicles (Admin only)
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     description: "Accessible only by superadmin"
 *     responses:
 *       200:
 *         description: List of all vehicles
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/vehicle/{vehicleId}:
 *   get:
 *     summary: Get vehicle by ID (Admin or Rider)
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (rider trying to access another's vehicle)
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update vehicle details (Admin or Rider)
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: string
 *               vehicleNumber:
 *                 type: string
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
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a vehicle (Admin or Rider)
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         schema:
 *           type: string
 *         required: true
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal Server Error
 */
