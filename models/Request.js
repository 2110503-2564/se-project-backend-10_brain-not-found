const mongoose = require('mongoose');
const Shop = require('./Shop')

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
        // Directly imports the shop schema to be used here
        // Make edits on the shop schema instead
        type: Shop,
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
        type: String,
        required: false
    },
    edited: {
        type: Date
    }
});

module.exports = mongoose.model('Request',RequestSchema);