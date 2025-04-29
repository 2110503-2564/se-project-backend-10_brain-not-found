const Request = require('../models/Request');

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
        else {
            return res.status(401).json({success: false,message: `User ${req.user.id} is not authorized to get requests`});
        }

        const requests = await query;
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ success: false, message: error.message });
    }
};