const express = require('express');
const { createRequest , getRequests } = require('../controllers/request');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');


router.route('/')
    .get(protect,authorize('admin','shopOwner'),getRequests)
    .post(protect,authorize('shopOwner'),createRequest);

router.route('/:id/approve').put(protect,authorize('admin'),approveShop);
router.route('/:id/reject').put(protect,authorize('admin'),rejectShop);

module.exports = router;