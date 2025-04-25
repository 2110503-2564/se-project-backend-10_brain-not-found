const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    requestType: {
        type: String,
        enum: ['create', 'update', 'delete'],
        default: 'create'
    },
    reason: {
        type: String
    },
    edited: {
        type: Date
    }
});

module.exports = mongoose.model('Request', RequestSchema);