const express = require('express');
const shopController = require('../controllers/shopController');

const router = express.Router();
const {protect , authorize} = require('../middleware/auth')

// Admin routes
router.route('/:id/approve').post(protect,authorize('admin'),approveShop);
router.route('/:id/reject').post(protect,authorize('admin'),rejectShop);

module.exports = router;
