const Request = require('../models/Request');
const User = require('../models/User');

//create request
//@desc     Create request
//@route    Post /api/v1/request
//@access   Private
exports.createRequest = async (req,res,next) => {
    try {
        req.body.user = req.user.id;
        const request = await Request.create(req.body);
        res.status(200).json({success: true , data: request});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: error.message});
    }
}
//@desc     Get all request
//@route    Get /api/v1/request
//@access   Private
exports.getRequests = async (req,res,next) => {
    try {
        let query;
        if(req.user.role === 'admin' || req.user.role === 'shopOwner') {
            query = Request.find().populate({
                path: 'user',
                select: 'name'
            });
        } else {
            query = Request.find({user: req.user.id}).populate({
                path: 'user',
                select: 'name'
            });
        }
        const requests = await query;
        res.status(200).json({success: true , data: requests});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: error.message});
    }
}