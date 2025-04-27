const Request = require('../models/Request');
const User = require('../models/User');
const Shop = require('../models/Shop');
const mongoose = require('mongoose');

// @desc     Create request
// @route    Post /api/v1/requests
// @access   Private
exports.createRequest = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        if (req.user.role !== 'shopOwner') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to create request`
            });
        }

        // Prevent setting these fields manually
        delete req.body.createdAt;
        delete req.body.edited;
        delete req.body.status;
        delete req.body.reason;
        const request = await Request.create(req.body);

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//@desc    Get all request
//@route   Get /api/v1/requests
//@access  Private
exports.getRequests = async (req, res, next) => {
    try {
        let query;
        const populateOptions = [
            {
                path: 'user',
                select: 'name' // ดึงเฉพาะฟิลด์ name ของ User
            }
        ];

        if (req.user.role === 'admin') {
            if (req.query.status) {
                query = Request.find({ status: req.query.status })
                    .populate(populateOptions)
                    .select('createdAt user reason shop status'); // ดึงเฉพาะ createdAt, user, reason
            } else {
                query = Request.find()
                    .populate(populateOptions)
                    .select('createdAt user reason shop status'); // ดึงเฉพาะ createdAt, user, reason
            }
        } else if (req.user.role === 'shopOwner') {
             if (req.query.status) {
                query = Request.find({ status: req.query.status, user: req.user.id })
                    .populate(populateOptions)
                    .select('createdAt user reason shop status'); // ดึงเฉพาะ createdAt, user, reason
            } else {
                query = Request.find({ user: req.user.id })
                    .populate(populateOptions)
                    .select('createdAt user reason shop status'); // ดึงเฉพาะ createdAt, user, reason
            }
        }

        const requests = await query;
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//@desc     Get a single request
//@route    Get /api/v1/requests/:id
//@access   Private
exports.getRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        let request = await Request.findById(id).populate({
            path: 'user',
            select: 'name email tel'
        });

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        if (req.user.id !== request.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not allowed to access this request`})
        }

        res.status(200).json({ success: true, data: request });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
}

//@desc   Approve a request and create a shop
//@route  Put /api/v1/requests/:id/approve
//@access Private
exports.approveRequest = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        const request = await Request.findById(req.params.id);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Request already ${request.status}` });
        }
        
        // Create a new shop
        const shop = await Shop.create([request.shop], { session }); // ต้องใส่เป็น array เมื่อใช้ session

        // Update request status
        request.status = 'approved';
        await request.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ success: true, message: 'Request approved, shop created', data: shop });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ success: false, error: err.message });
    }
};

//@desc   Reject a request
//@route  Put /api/v1/requests/:id/reject
//@access Private
exports.rejectRequest = async (req, res, next) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Request already ${request.status}` });
        }

        request.status = 'rejected';
        request.reason = req.body.reason || 'No reason provided';
        await request.save();

        res.status(200).json({ success: true, message: 'Request rejected', data: request });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

//@desc Delete request
//@route Delete /api/v1/requests/:id
//@access Private
exports.deleteRequest = async (req,res,next) => {
    try {
        let request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: `No request with id ${req.params.id}`
            });
        }

        // Make sure user is the request owner
        if (request.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this request`
            });
        }

        // Allow delete only if status is 'pending' or 'reject'
        if (!['pending', 'rejected'].includes(request.status)) {
            return res.status(400).json({
                success: false,
                message: `Request with status '${request.status}' cannot be deleted`
            });
        }

        await request.deleteOne();

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: "Cannot delete request"
        });
    }
};


//@desc     Edit request
//@route    Put /api/v1/requests/:id
//@access   Private
exports.editRequest = async (req,res,next) => {
    try {
        let request = await Request.findById(req.params.id);
        if(!request){
            return res.status(404).json({success: false, message: `No request with id ${req.params.id}`});
        }

        if(req.user.id !== request.user.toString()){
            return res.status(401).json({success: false, message: `User ${req.user.id} is not authorized to edit this request`});
        }

        // Prevent editing of 'createdAt', 'status', 'edited' fields
        const { createdAt, status, edited , reason , ...updateData } = req.body;

        // Check if any of the restricted fields are in the request body
        if (createdAt || status || edited || reason) {
            return res.status(400).json({
                success: false,
                message: "You are not allowed to edit 'createdAt', 'status', 'reason' or 'edited' fields"
            });
        }

        updateData.status = 'pending';
        updateData.edited = Date.now();

        let updatedRequest = await Request.findByIdAndUpdate(req.params.id, updateData, {new: true, runValidators: true});
        res.status(200).json({
            success: true,
            data: updatedRequest
        });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({success: false, message: error.message});
    } 
}

//@desc     Edit request reason
//@route    PATCH /api/v1/requests/:id/reason
//@access   Private
exports.editReason = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const { reason } = req.body;

        // // ตรวจสอบว่า reason เป็น string
        if (typeof reason !== 'string') {
            return res.status(400).json({ success: false, message: "Reason must be a string" });
        }

        // ตรวจสอบความยาวของ reason ไม่เกิน 250 ตัวอักษร
        if (reason.length > 250) {
            return res.status(400).json({ success: false, message: "Reason cannot be longer than 250 characters" });
        }

        // ตรวจสอบว่าผู้ใช้มีสิทธิ์หรือไม่
        if (req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to edit reason` });
        }

        // ✅ หา request มาก่อนเพื่อเช็ค status
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ success: false, message: `No request with id ${requestId}` });
        }

        // ✅ เช็คว่าต้องเป็น status = "reject" เท่านั้น
        if (request.status !== 'rejected') {
            return res.status(400).json({ success: false, message: `Cannot edit reason unless status is 'reject'` });
        }

        // ✅ อัปเดต reason เท่านั้น
        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            { $set: { reason: reason } },
            {
                new: true,
                runValidators: false
            }
        );

        res.status(200).json({
            success: true,
            data: updatedRequest
        });

    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
};


