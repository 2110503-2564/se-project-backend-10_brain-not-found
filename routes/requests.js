const express = require('express');
const { createRequest , getRequests, getRequest, approveRequest, rejectRequest, deleteRequest, editRequest , editReason } = require('../controllers/requests');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');

router.route('/')
    .get(protect,authorize('admin','shopOwner'),getRequests)
    .post(protect,authorize('shopOwner'),createRequest);

router.route('/:id/approve').post(protect, authorize('admin'), approveRequest);
router.route('/:id/reject').post(protect, authorize('admin'), rejectRequest);    
router.route('/:id')
    .get(protect, authorize('admin', 'shopOwner'), getRequest)
    .delete(protect, authorize('shopOwner'), deleteRequest)
    .put(protect, authorize('shopOwner'), editRequest);
    
router.route('/:id/reason')
    .patch(protect, authorize('admin'), editReason);
    
module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Request
 *     description: Operations regarding shop requests
 * 
 * paths:
 *   /requests:
 *     get:
 *       tags:
 *         - Request
 *       summary: Get your own requests if you are a shop owner, or all requests if you are an admin.
 *       responses:
 *         200:
 *           description: 'Successful Operation: Returns own request / all requests'
 * components:
 *   schemas:
 *      Request:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: UUID
 *            example: uoua1241241
 *          status:
 *            type: string
 *            example: pending
 * 
 */