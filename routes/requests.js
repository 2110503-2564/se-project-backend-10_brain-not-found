const express = require('express');
const { createRequest , getRequests, getRequest, approveRequest, rejectRequest, deleteRequest, editRequest , editReason } = require('../controllers/requests');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');

router.route('/')
    .get(protect,authorize('admin','shopOwner'),getRequests)
    .post(protect,authorize('shopOwner'),createRequest);

router.route('/:id/approve').put(protect,authorize('admin'),approveRequest);
router.route('/:id/reject').put(protect,authorize('admin'),rejectRequest);

router.route('/:id')
    .get(protect, authorize('admin', 'shopOwner'), getRequest)
    .delete(protect, authorize('shopOwner'), deleteRequest)
    .put(protect, authorize('shopOwner'), editRequest);
    
router.route('/:id/reason')
    .patch(protect, authorize('admin'), editReason);
    
module.exports = router;

/**
 * @swagger
 * /api/v1/requests:
 *   get:
 *     summary: Get all requests
 *     description: Retrieve all requests. Admins can view all requests, while shop owners can only view their own requests.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter requests by status (e.g., pending, approved, rejected).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Request'
 *                   description: Array of request objects
 *       403:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 *   post:
 *     summary: Create a new request
 *     description: Allows a shop owner to create a new request.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the shop.
 *                     example: "My Shop"
 *                   address:
 *                     type: string
 *                     description: The address of the shop.
 *                     example: "123 Main St"
 *                   district:
 *                     type: string
 *                     description: The district where the shop is located.
 *                     example: "Downtown"
 *                   province:
 *                     type: string
 *                     description: The province where the shop is located.
 *                     example: "Bangkok"
 *                   postalcode:
 *                     type: string
 *                     description: The postal code of the shop.
 *                     example: "10110"
 *                   tel:
 *                     type: string
 *                     description: The phone number of the shop.
 *                     example: "02-123-4567"
 *                   region:
 *                     type: string
 *                     description: The region of the shop.
 *                     example: "Central"
 *                   openTime:
 *                     type: string
 *                     description: The opening time of the shop in HH:MM format.
 *                     example: "09:00"
 *                   closeTime:
 *                     type: string
 *                     description: The closing time of the shop in HH:MM format.
 *                     example: "18:00"
 *                   picture:
 *                     type: array
 *                     description: Array of picture URLs.
 *                     items:
 *                       type: string
 *                     example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *                   desc:
 *                     type: string
 *                     description: A description of the shop.
 *                     example: "A cozy massage shop offering relaxation and therapy services."
 *                   shopType:
 *                     type: string
 *                     description: The type or category of the shop.
 *                     example: "Massage"
 *                   services:
 *                     type: array
 *                     description: List of services offered by the shop.
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The service name.
 *                           example: "Swedish Massage"
 *                         desc:
 *                           type: string
 *                           description: A description of the service.
 *                           example: "A relaxing full-body massage."
 *                         duration:
 *                           type: number
 *                           description: Duration in minutes.
 *                           example: 60
 *                         price:
 *                           type: number
 *                           description: Price of the service.
 *                           example: 50
 *                   certificate:
 *                     type: string
 *                     description: Certificate of the shop.
 *                     example: "Valid Health Certificate"
 *     responses:
 *       200:
 *         description: Successfully created a request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *                   description: The newly created request object
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
/**
 * @swagger
 * /api/v1/requests/{id}/approve:
 *   put:
 *     summary: Approve a request
 *     description: Allows an admin to approve a request.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the request to approve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request successfully approved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Shop'
 *                   description: The newly created shop object
 *       400:
 *         description: Request is invalid or already processed.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/v1/requests/{id}/reject:
 *   put:
 *     summary: Reject a request
 *     description: Allows an admin to reject a request.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the request to reject.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: The reason for rejecting the request.
 *                 example: "Insufficient information provided."
 *     responses:
 *       200:
 *         description: Request successfully rejected.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *                   description: The rejected request object
 *       400:
 *         description: Request is invalid or already processed.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/v1/requests/{id}:
 *   get:
 *     summary: Get a single request
 *     description: Retrieve a specific request by its ID.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the request to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *                   description: The request object
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Request not found.
 *       500:
 *         description: Internal server error.
 *   put:
 *     summary: Update a request
 *     description: Update an existing request’s shop details. Note that fields "createdAt", "status", "reason", and "edited" cannot be updated.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the request to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The updated name of the shop.
 *                     example: "Updated Shop Name"
 *                   address:
 *                     type: string
 *                     description: The updated address of the shop.
 *                     example: "456 New St"
 *                   district:
 *                     type: string
 *                     description: The updated district of the shop.
 *                     example: "Downtown"
 *                   province:
 *                     type: string
 *                     description: The updated province of the shop.
 *                     example: "Bangkok"
 *                   postalcode:
 *                     type: string
 *                     description: The updated postal code of the shop.
 *                     example: "10110"
 *                   tel:
 *                     type: string
 *                     description: The updated phone number of the shop.
 *                     example: "02-123-4567"
 *                   region:
 *                     type: string
 *                     description: The updated region of the shop.
 *                     example: "Central"
 *                   openTime:
 *                     type: string
 *                     description: The updated opening time in HH:MM format.
 *                     example: "09:00"
 *                   closeTime:
 *                     type: string
 *                     description: The updated closing time in HH:MM format.
 *                     example: "18:00"
 *                   picture:
 *                     type: array
 *                     description: Updated array of picture URLs.
 *                     items:
 *                       type: string
 *                     example: ["https://example.com/updated1.jpg", "https://example.com/updated2.jpg"]
 *                   desc:
 *                     type: string
 *                     description: The updated description of the shop.
 *                     example: "Updated description of the shop"
 *                   shopType:
 *                     type: string
 *                     description: The updated type or category of the shop.
 *                     example: "Updated Shop Type"
 *                   services:
 *                     type: array
 *                     description: Updated list of services offered by the shop.
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: The updated service name.
 *                           example: "Updated Service Name"
 *                         desc:
 *                           type: string
 *                           description: The updated description of the service.
 *                           example: "Updated service description"
 *                         duration:
 *                           type: number
 *                           description: The updated service duration in minutes.
 *                           example: 60
 *                         price:
 *                           type: number
 *                           description: The updated service price.
 *                           example: 50
 *                   certificate:
 *                     type: string
 *                     description: The updated certificate of the shop.
 *                     example: "Updated Certificate"
 *     responses:
 *       200:
 *         description: Request successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *                   description: The updated request object.
 *       400:
 *         description: Invalid request data (e.g. attempting to modify restricted fields).
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Request not found.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a request
 *     description: Delete a specific request by its ID.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the request to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the request.
 *           example: "654321abcdef0123456789"
 *         user:
 *           type: string
 *           description: The ID of the user who created the request.
 *           example: "654321fedcba9876543210"
 *         shop:
 *           $ref: '#/components/schemas/Shop'
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: The status of the request.
 *           example: "pending"
 *         requestType:
 *           type: string
 *           enum: [create, update, delete]
 *           description: The type of request action.
 *           example: "create"
 *         reason:
 *           type: string
 *           description: The reason for the request (if applicable).
 *           example: "Request for new shop"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the request was created.
 *           example: "2024-01-01T00:00:00.000Z"
 *         edited:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the request was last updated.
 *           example: "2024-01-02T12:00:00.000Z"
 *
 *     Shop:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the shop.
 *           example: "654321abcdef0123456789"
 *         name:
 *           type: string
 *           description: The name of the shop.
 *           example: "My Shop"
 *         address:
 *           type: string
 *           description: The address of the shop.
 *           example: "123 Main St"
 *         district:
 *           type: string
 *           description: The district where the shop is located.
 *           example: "Downtown"
 *         province:
 *           type: string
 *           description: The province where the shop is located.
 *           example: "Bangkok"
 *         postalcode:
 *           type: string
 *           description: The postal code of the shop.
 *           example: "10110"
 *         tel:
 *           type: string
 *           description: The phone number of the shop.
 *           example: "02-123-4567"
 *         region:
 *           type: string
 *           description: The region of the shop.
 *           example: "Central"
 *         openTime:
 *           type: string
 *           description: The opening time of the shop in HH:MM format.
 *           example: "09:00"
 *         closeTime:
 *           type: string
 *           description: The closing time of the shop in HH:MM format.
 *           example: "18:00"
 *         picture:
 *           type: array
 *           description: Array of picture URLs.
 *           items:
 *             type: string
 *           example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         desc:
 *           type: string
 *           description: A description of the shop.
 *           example: "A cozy massage shop offering relaxation and therapy services."
 *         shopType:
 *           type: string
 *           description: The type or category of the shop.
 *           example: "Massage"
 *         services:
 *           type: array
 *           description: List of services offered by the shop.
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The service name.
 *                 example: "Swedish Massage"
 *               desc:
 *                 type: string
 *                 description: A description of the service.
 *                 example: "A relaxing full-body massage."
 *               duration:
 *                 type: number
 *                 description: Duration in minutes.
 *                 example: 60
 *               price:
 *                 type: number
 *                 description: Price of the service.
 *                 example: 50
 *         certificate:
 *           type: string
 *           description: Certificate of the shop.
 *           example: "Valid Health Certificate"
 */