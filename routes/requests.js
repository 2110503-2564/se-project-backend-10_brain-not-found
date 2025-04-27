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
 *                 description: Shop details for the request.
 *                 example: { name: "My Shop", address: "123 Main St" }
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
 *   post:
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
 *   post:
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
 *     description: Update the details of an existing request.
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
 *                 description: Updated shop details.
 *                 example: { name: "Updated Shop Name", address: "456 New St" }
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
 *                   description: The updated request object
 *       400:
 *         description: Invalid request data.
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