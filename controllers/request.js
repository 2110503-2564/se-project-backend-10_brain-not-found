const Request = require('../models/Request');
const User = require('../models/User');
const Shop = require('../models/Shop');

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
        if(req.user.role === 'admin') {
            if(req.query.status === 'pending') {
                query = Request.find({status: 'pending'}).populate({
                    path: 'user',
                    select: 'name'
                });
            }
            else if(req.query.status === 'approved') {
                query = Request.find({status: 'approved'}).populate({
                    path: 'user',
                    select: 'name'
                });
            }
            else if(req.query.status === 'rejected') {
                query = Request.find({status: 'rejected'}).populate({
                    path: 'user',
                    select: 'name'
                });
            }
            else {
                query = Request.find().populate({
                    path: 'user',
                    select: 'name'
                });
            }
        } else if (req.user.role === 'shopOwner') {
            if(req.query.status === 'pending') {
                query = Request.find({status: 'pending', user: req.user.id}).populate({
                    path: 'user',
                    select: 'name'
                });
            }
            else if(req.query.status === 'approved') {
                query = Request.find({status: 'approved', user: req.user.id}).populate({
                    path: 'user',
                    select: 'name'
                });
            }
            else if(req.query.status === 'rejected') {
                query = Request.find({status: 'rejected', user: req.user.id}).populate({
                    path: 'user',
                    select: 'name'
                });
            }
            else{
                query = Request.find({user: req.user.id}).populate({
                    path: 'user',
                    select: 'name'
                });
            }
        }
        const requests = await query;
        res.status(200).json({success: true , data: requests});
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: error.message});
    }
}


//@desc   Approve a request and create a shop
//@route  Post /api/v1/requests/:id/approve
//@access Private
exports.approveRequest = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        // Create a shop from request data
        const shop = await Shop.create({ ...request.toObject(), status: 'approved' });

        // Update request status and remove (or keep for record)
        request.status = 'approved';
        await request.save();

        res.status(200).json({ success: true, message: 'Request approved, shop created', data: shop });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//@desc Reject a request
//@route  Post /api/v1/requests/:id/reject
//@access Private
exports.rejectRequest = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        request.status = 'rejected';
        request.rejectReason = req.body.rejectReason || 'No reason provided';
        await request.save();

        res.status(200).json({ success: true, message: 'Request rejected', data: request });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
