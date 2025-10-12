/**
 * @swagger
 * tags:
 *   - name: Vehicle
 *     description: Rider vehicles management APIs
 *   - name: VehicleCategory
 *     description: Vehicle category management APIs (Admin)
 *   - name: Booking
 *     description: Booking management APIs (User, Admin, Rider)
 */

/**
 * -------------------------------
 * Vehicle APIs
 * -------------------------------
 */

/**
 * @swagger
 * /api/vehicle/add:
 *   post:
 *     summary: Rider adds a new vehicle
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
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
 */

/**
 * @swagger
 * /api/vehicle/my-vehicles:
 *   get:
 *     summary: Get all vehicles added by the logged-in rider
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of rider's vehicles
 *       403:
 *         description: Forbidden
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
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle details
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 *
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
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 *
 *   delete:
 *     summary: Delete a vehicle (Admin or Rider)
 *     tags: [Vehicle]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Vehicle ID
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vehicle not found
 */

/**
 * -------------------------------
 * Vehicle Category APIs
 * -------------------------------
 */

/**
 * @swagger
 * /api/vehicle-category/add:
 *   post:
 *     summary: Add new vehicle category
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
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
 *         description: Validation error
 */

/**
 * @swagger
 * /api/vehicle-category:
 *   get:
 *     summary: Get all vehicle categories
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
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
 *       404:
 *         description: Category not found
 *
 *   put:
 *     summary: Update vehicle category
 *     tags: [VehicleCategory]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
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
 *                 type: number
 *               acType:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Vehicle category updated successfully
 *       404:
 *         description: Category not found
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
 *       404:
 *         description: Category not found
 */

/**
 * -------------------------------
 * Booking APIs
 * -------------------------------
 */

/**
 * @swagger
 * /api/booking/create:
 *   post:
 *     summary: User creates a new booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupLocation
 *               - dropLocation
 *               - distance
 *               - pickupDate
 *               - rideEndDate
 *               - maleCount
 *               - femaleCount
 *               - kidsCount
 *               - selectedCar
 *               - acType
 *             properties:
 *               pickupLocation:
 *                 type: string
 *               dropLocation:
 *                 type: string
 *               distance:
 *                 type: number
 *               pickupDate:
 *                 type: string
 *                 format: date
 *               rideEndDate:
 *                 type: string
 *                 format: date
 *               maleCount:
 *                 type: number
 *               femaleCount:
 *                 type: number
 *               kidsCount:
 *                 type: number
 *               selectedCar:
 *                 type: string
 *               acType:
 *                 type: string
 *                 enum: [AC, Non-AC]
 *               additionalDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Vehicle category not found
 */

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Get all bookings (Admin)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all bookings
 */

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Booking]
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
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/booking/{id}/assign:
 *   put:
 *     summary: Admin assigns a rider to booking
 *     tags: [Booking]
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
 *               - riderId
 *               - finalPrice
 *             properties:
 *               riderId:
 *                 type: string
 *               finalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Rider assigned successfully
 */

/**
 * @swagger
 * /api/booking/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Booking]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [in-review, in-process, rider-assigned, completed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 */

/**
 * @swagger
 * /api/booking/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     tags: [Booking]
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
 *               - role
 *               - reason
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, rider, superadmin, vendor]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking already cancelled or completed
 */
