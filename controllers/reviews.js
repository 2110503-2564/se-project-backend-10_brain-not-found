const Reservation = require('../models/Reservation');
const Shop = require('../models/Shop');
const Review = require('../models/Review');

//@desc     Get all review in this shop
//@route    Get /api/v1/shops/shopId:/reviews
//@access   Public
exports.getReviews = async (req,res,next) => {
    
    let query;
    // FIelds to exclude
    const reqQuery = {...req.query};
    const removeFields = ['select','sort','page','limit'];

    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
    const queryJSON = JSON.parse(queryStr);
        
    query = Review.find({shop: req.params.shopId}).find(queryJSON).populate({
        path: 'user',
        select: 'name'
    });
    // Select & sort
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else { // Default sorts by newest
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 5;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;

    try {
        const total = await Review.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const reviews = await query;
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if (startIndex > 0) {
            pagination.previous = {
                page: page - 1,
                limit
            }
        }


        res.status(200).json({
            success: true,
            count: reviews.length,
            pagination,
            data: reviews
        });
        
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: 'Cannot find Review' });
    }
}

//@desc     Create review
//@route    Post /api/v1/shops/:shopId/reviews/
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

        
        //add user Id to req.body
        req.body.user = req.user.id;

        //Check if customer had made a reservation to the shop
        const existedReservations = await Reservation.find({user:req.user.id, shop: req.params.shopId});
        if(existedReservations.length === 0){
            return res.status(401).json({success: false, message: `Customer doesn't has any reservation in this shop`});
        }


        const review = await Review.create(req.body);
        res.status(200).json({success: true , data: review});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: 'Can not create review'});
    }
}

//@desc     Delete review
//@route    Delete /api/v1/shops/:shopId/reviews/:id
//@access   Private
exports.deleteReview = async (req,res,next) => {
    try {
        // เป็น cutomer ที่เป็นเจ้าของ review และ admin
        let review = await Review.findById(req.params.id);
        if(!review){
            return res.status(404).json({success: false, message: `No review with id ${req.params.id}`});
        }

        // มีสิทธ์มั้ย
        if(req.user.role !== 'admin' && req.user.id !== review.user.toString()){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this review`});
        }

        await review.deleteOne();
        res.status(200).json({
            success: true,
            data: []
        });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: "Cannot delete Review"});
    }
}

//@desc     Edit review
//@route    Put /api/v1/shops/:shopId/reviews/:id
//@access   Private
exports.editReview = async (req,res,next) => {
    try {
        // customer
        let review = await Review.findById(req.params.id);
        if(!review){
            return res.status(404).json({success: false, message: `No review with id ${req.params.id}`});
        }

        if(req.user.id !== review.user.toString()){
            return res.status(401).json({success: false, message: `User ${req.user.id} is not authorized to edit this review`});
        }

        let updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json({
            success: true,
            data: updatedReview
        });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: "Cannot edit Review"});
    } 
}