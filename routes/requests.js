const express = require('express');
const { createRequest , getRequests, getRequest, approveRequest, rejectRequest, deleteRequest, editRequest  } = require('../controllers/requests');
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
    

module.exports = router;