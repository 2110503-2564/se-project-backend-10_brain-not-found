const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    header: {
        type: String,
        required: [true, 'Please add a header\n'],
        maxlength: [50, 'Header can not be more than 50 characters\n']
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment\n'],
        maxlength: [250, 'Comment can not be more than 250 characters\n']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating\n'],
        min: [1, 'Rating must be at least 1\n'],
        max: [5, 'Rating must not be more than 5\n']
    },
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shop',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ป้องกันไม่ให้ user เดียวกันรีวิวร้านซ้ำได้
ReviewSchema.index({ shop: 1, user: 1 }, { unique: true });

// Reverse populate with virtuals
ReviewSchema.virtual('reviews' , {
    ref: 'Review',
    localField: '_id',
    foreignField: 'shop',
    justOne:false
});

module.exports = mongoose.model('Review', ReviewSchema);
