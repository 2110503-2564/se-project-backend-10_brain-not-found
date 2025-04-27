// c:\vscode_test\softwareEng\se-project-backend-10_brain-not-found\models\Request.js
const mongoose = require('mongoose');
// Import เฉพาะ ShopSchema ที่ export ออกมาใหม่
const { ShopSchema } = require('./Shop');

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
        // ตอนนี้ ShopSchema จะมีค่าที่ถูกต้องแล้ว
        type: ShopSchema,
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

module.exports = mongoose.model('Request', RequestSchema);
