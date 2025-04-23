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
    address:{
        type: String,
        required: [true, 'Please add an address\n']
    },
    district:{
        type: String,
        required: [true, 'Please add a district\n']
    },
    province:{
        type: String,
        required: [true, 'Please add a province\n']
    },
    postalcode:{
        type: String,
        required: [true, 'Please add a postalcode\n'], maxlength:[5, 'Postal Code can not be more than 5 digits\n']
    },
    tel: {
        type: String,
        required: [true, 'Please add a phone number\n'],
        match: [
            /^(\d{3}-?\d{3}-?\d{4})$/, 
            'Please add a valid phone number\n'
        ]
    },
    region:{
        type: String,
        required: [true, 'Please add a region\n']
    },
    openTime: {
        type: String,
        required: [true, 'Please add an open time\n'],
        match: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, 'Please add a valid open time in HH:MM format\n']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add a close time\n'],
        match: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, 'Please add a valid close time in HH:MM format\n']
    },
    picture: {
        type: [String], // เป็น array ของ string
        validate: [
            {
                validator: function(arr) {
                    return arr.length <= 5; // จำกัดไม่เกิน 5 รูป
                },
                message: 'You can upload up to 5 pictures only\n'
            }
        ],
        required: [true, 'Please add at least 1 picture\n']
    },
    shopType: {
        type: String,
        required: false
    },
    services: {
        type: [String],
        required: false
    },
    licenseNumber: {
        type: String,
        required: false
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
    }
});

module.exports = mongoose.model('Request',RequestSchema);