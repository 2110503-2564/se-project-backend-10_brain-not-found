const Reservation = require('../models/Reservation');
const Shop = require('../models/Shop');
const Review = require('../models/Review');
const updateCountReview = require('../utils/updateCountReview');
const updateShopRating = require('../utils/updateShopRating');


//@desc     Get all review in this shop
//@route    Get /api/v1/shop/shopId:/reviews
//@access   Public
exports.getReviews = async (req,res,next) => {
    // all user
    let query;
    query = Review.find({ review: req.params.shopId }).populate({
        path: 'review',
        selecet: 'header comment rating user createdAt'
    });

    if(!query){
        return res.status(404).json({ success: false, message: 'Review not found' });
    }

    try {
        const reviews = await query;
        res.status(200).json({
            success: true,
            count: reviews.length,
            from: req.user.id,
            data: reviews
        });
    } catch (error) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: 'Cannot find Review' });
    }
}

//@desc     Create review
//@route    Post /api/v1/shop/:shopId/reviews/
//@access   Private
exports.createReview = async (req,res,next) => {
    // customer who booking this shop and the book was in my booking page
    // then they can create the review to this shop
    try {
        req.body.shop = req.params.shopId;
        const shop = await Shop.findById(req.params.shopId);

        if(!shop){
            return res.status(404).json({success: false, message: `NO massage Shop with the id of ${req.params.shopId}`});
        }

        // for the review is invalid or the customer did not book the shop
        //add user Id to req.body
        req.body.user = req.user.id;

        //Check for existed reservation in customer booking with this shop
        const existedReservations = await Reservation.find({user:req.user.id, shop: req.params.shopId});
        if(existedReservations.length === 0){
            return res.status(401).json({success: false, message: `Customer doesn't has any reservation in this shop`});
        }


        const review = await Review.create(req.body);
        await updateShopRating(req.params.shopId);
        await updateCountReview(req.params.shopId);
        res.status(200).json({success: true , data: review});
    } catch (error) {
        console.log(err.stack);
        return res.status(500).json({success: false, message: 'Can not create review'});
    }
}

//@desc     Delete review
//@route    Delete /api/v1/shop/:shopId/reviews/:id
//@access   Private
exports.DeleteReview = async (req,res,next) => {
    try {
        // เป็น cutomer ที่เป็นเจ้าของ review และ admin
        let review = await Review.findById(req.params.id);
        if(!review){
            return res.status(404).json({success: false, message: `No review with id ${req.params.id}`});
        }

        // มีสิทธ์มั้ย
        if(req.user.role !== 'admin' && req.user.id.toString() !== review.user){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this review`});
        }

        await Review.deleteOne({_id: req.params.id});
        await updateShopRating(req.params.shopId);
        await updateCountReview(req.params.shopId);
        res.status(200).json({
            success: true,
            data: reservation
        });

    } catch (error) {
        console.log(err.stack);
        return res.status(500).json({success: false, message: "Cannot delete Review"});
    }
}

//@desc     Edit review
//@route    Update /api/v1/shop/:shopId/reviews/:id
//@access   Private
exports.EditReview = async (req,res,next) => {
    try {
        // customer
        let review = await Review.findById(req.params.id);
        if(!review){
            return res.status(404).json({success: false, message: `No review with id ${req.params.id}`});
        }

        if(req.user.id.toString() !== review.user){
            return res.status(401).json({success: false, message: `User ${req.user.id} is not authorized to edit this review`});
        }

        await Review.updateOne({_id: req.params.id}, req.body);
        await updateShopRating(req.params.shopId);
        res.status(200).json({
            success: true,
            data: review
        });

    } catch (error) {
        console.log(err.stack);
        return res.status(500).json({success: false, message: "Cannot edit Review"});
    }
}