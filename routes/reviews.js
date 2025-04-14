const express = require('express');
const { getReviews , editReview , createReview , deleteReview } = require('../controllers/reviews')
const router = express.Router({mergeParams: true});
const {protect,authorize} = require('../middleware/auth');
const reviewRouter=require('./shops');

router.use('/:shopId/reviews/',reviewRouter);

router.route('/').get(getReviews).post(protect,authorize('admin','user'),createReview);
router.route('/:id').put(protect,authorize('admin','user'),editReview).delete(protect,authorize('admin','user'),deleteReview);

module.exports = router;