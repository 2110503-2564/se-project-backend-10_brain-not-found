const mongoose = require('mongoose');
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
    }

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// Reverse populate with virtuals
ShopSchema.virtual('reservations' , {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'shop',
    justOne:false
});

module.exports=mongoose.model('Shop',ShopSchema);
