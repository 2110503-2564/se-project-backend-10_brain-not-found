const Request = require('../models/Request');
const Shop = require('../models/Shop');

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
