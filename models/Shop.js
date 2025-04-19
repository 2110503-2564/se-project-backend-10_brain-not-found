const mongoose = require('mongoose');
const Review = require('./Review');
const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name\n'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters\n']
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
        unique: true,
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
    desc: {
        type: String,
        required: [true, 'Please add a description\n']
    }
    
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
    /* testing required */
    virtuals: {
        reservations: {
            options: {
                ref: 'Reservation',
                localField: '_id',
                foreignField: 'shop',
                justOne:false
            }
        },
        reviews: {
            options: {
                ref: 'Review',
                localField: '_id',
                foreignField: 'shop',
                justOne: false
            }
        },
        reviewCount: {
            get() {return this.reviews? this.reviews.length : undefined}
        },
        averageRating: {
            get() {
                if (!this.reviews) return undefined;
                if (this.reviews.length === 0) return 0; 

                const DECIMAL_POINT = 1;
                let ratingSum = 0;
                this.reviews.forEach(review => {
                    ratingSum += review.rating;
                });

                let avgRating = ratingSum / this.reviews.length;
                return Math.round(avgRating * (10 ** DECIMAL_POINT)) / (10 ** DECIMAL_POINT); // rounds to DECIMAL_POINT
            }
        }
    } 
});


module.exports=mongoose.model('Shop',ShopSchema);
